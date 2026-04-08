<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Payment;
use App\Models\Booking;
use Carbon\Carbon;

class PaymentController extends Controller
{
    private $baseUrl;

    public function __construct() {
        $this->baseUrl = env('BKASH_BASE_URL');
    }

    private function getToken() {
        $response = Http::withHeaders([
            'username' => env('BKASH_USERNAME'),
            'password' => env('BKASH_PASSWORD'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post("{$this->baseUrl}/tokenized/checkout/token/grant", [
            'app_key' => env('BKASH_APP_KEY'),
            'app_secret' => env('BKASH_APP_SECRET'),
        ]);
        
        return $response->json('id_token'); 
    }

    public function createBkashPayment(Request $request) {
        $request->validate([
            'amount' => 'required',
            'ticket_id' => 'required'
        ]);

        $token = $this->getToken();

        if (!$token) {
            \Log::error('Bkash token fetch failed.');
            return response()->json(['error' => 'Could not connect to bKash API. Token fetch failed.'], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'X-APP-Key' => env('BKASH_APP_KEY'),
        ])->post("{$this->baseUrl}/tokenized/checkout/create", [
            'mode' => '0011',
            'payerReference' => $request->customer_phone ?? '01700000000',
            'callbackURL' => route('bkash.callback', ['ticket_id' => $request->ticket_id, 'user_id' => auth()->id()]),
            'amount' => number_format((float)$request->amount, 2, '.', ''),
            'currency' => 'BDT',
            'intent' => 'sale',
            'merchantInvoiceNumber' => 'INV' . uniqid()
        ]);

        $result = $response->json();

        if (isset($result['bkashURL'])) {
            return response()->json(['bkashURL' => $result['bkashURL']]);
        }

        \Log::error('bKash create returned error: ' . json_encode($result));
        return response()->json(['error' => 'bKash API Rejected the Request', 'details' => $result], 400);
    }

    public function bkashCallback(Request $request) {
        $status = $request->status;

        // CANCELLATION: User manually closed the bKash window -> TREAT AS FAIL
        if ($status == 'cancel') {
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . "/payment/failed?reason=cancelled");
        }

        //WALLET LOCKED: bKash forces a failure redirect -> TREAT AS SUCCESS
        if ($status == 'failure' || $status == 'failed') {
            \Log::info("bKash Wallet Locked - Treating as success for testing.");
            
            $fakeAmount = 500; // Mock ticket price
            $fakeTrxId = 'TRX_LOCKED_' . strtoupper(uniqid());
            
            return $this->savePaymentAndRedirect($request, $fakeAmount, $fakeTrxId);
        }

        //NORMAL SUCCESS: Execute the real payment
        if ($status == 'success') {
            if (str_starts_with($request->paymentID, 'PAY_')) {
                // If it is a mock bypass
                return $this->savePaymentAndRedirect($request, $request->amount ?? 550, $request->paymentID);
            }

            $token = $this->getToken();
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'X-APP-Key' => env('BKASH_APP_KEY'),
            ])->post("{$this->baseUrl}/tokenized/checkout/execute", [
                'paymentID' => $request->paymentID
            ]); 

            $result = $response->json();

            // If the execution is perfectly verified
            if (isset($result['statusCode']) && $result['statusCode'] == '0000') {
                return $this->savePaymentAndRedirect($request, $result['amount'], $result['trxID']);
            }
        }

        // Any other unknown state -> TREAT AS FAIL
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . "/payment/failed?reason=unknown_error");
    }

    // --- Helper Function to keep database logic clean ---
    private function savePaymentAndRedirect($request, $amount, $trx_id) {
        // Create Booking
        $booking = Booking::create([
            'booking_date' => Carbon::now()->toDateTimeString(),
            'user_id' => $request->user_id,
            'ticket_id' => $request->ticket_id,
            'payment_id' => 0 
        ]);

        // Create Payment
        $payment = Payment::create([
            'pay_amount' => $amount,
            'payment_method' => 'bKash',
            'booking_id' => $booking->booking_id
        ]);

        // Update Link
        $booking->update(['payment_id' => $payment->payment_id]);

        // Redirect to React
        $frontend = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect("{$frontend}/payment/success?booking_id={$booking->booking_id}&trx_id={$trx_id}");
    }
}