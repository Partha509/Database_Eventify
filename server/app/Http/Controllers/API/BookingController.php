<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{

    public function index()
    {
        return Booking::all();
    }

    public function myTickets(Request $request)
    {
        $bookings = Booking::with(['ticket.event.venue', 'ticket.event.category', 'payment'])
                ->where('user_id', auth()->id())
                ->get();
        return response()->json($bookings);
    }

    /**
     * Stats for the Hosting tab:
     * total events hosted, total unique attendees across all my events, total revenue
     */
    public function hostingStats(Request $request)
    {
        $userId = auth()->id();

        $stats = Event::where('user_id', $userId)
            ->join('tickets', 'events.event_id', '=', 'tickets.event_id')
            ->leftJoin('bookings', 'tickets.ticket_id', '=', 'bookings.ticket_id')
            ->leftJoin('payments', 'bookings.booking_id', '=', 'payments.booking_id')
            ->selectRaw('
                COUNT(DISTINCT events.event_id) as total_events,
                COUNT(bookings.booking_id) as total_attendees,
                SUM(CASE WHEN bookings.booking_id IS NOT NULL THEN COALESCE(payments.pay_amount, tickets.price, 0) ELSE 0 END) as total_revenue
            ')
            ->first();

        return response()->json([
            'total_events'    => (int) ($stats->total_events ?? 0),
            'total_attendees' => (int) ($stats->total_attendees ?? 0),
            'total_revenue'   => (float) ($stats->total_revenue ?? 0),
        ]);
    }

    /**
     * Stats for the Attending tab:
     * total events user is attending, total cost paid, total attendees at those events
     */
    public function attendingStats(Request $request)
    {
        $userId = auth()->id();

        $stats = Booking::where('bookings.user_id', $userId)
            ->leftJoin('payments', 'bookings.booking_id', '=', 'payments.booking_id')
            ->leftJoin('tickets', 'bookings.ticket_id', '=', 'tickets.ticket_id')
            ->selectRaw('
                COUNT(DISTINCT bookings.booking_id) as total_events_attending,
                SUM(COALESCE(payments.pay_amount, tickets.price, 0)) as total_cost
            ')
            ->first();

        // Count all attendees across the events the user is attending
        $eventAttendees = DB::table('bookings as b2')
            ->whereIn('b2.ticket_id', function($query) use ($userId) {
                $query->select('ticket_id')
                    ->from('bookings')
                    ->where('user_id', $userId);
            })
            ->count();

        return response()->json([
            'total_events'    => (int) ($stats->total_events_attending ?? 0),
            'total_cost'      => (float) ($stats->total_cost ?? 0),
            'total_attendees' => (int) $eventAttendees,
        ]);
    }

    public function store(Request $request)
    {
        try {
            return DB::transaction(function() use ($request) {
                $ticket = Ticket::lockForUpdate()->find($request->ticket_id);
                
                if (!$ticket) {
                    return response()->json(['message' => 'Ticket not found'], 404);
                }

                if ($ticket->quantity <= 0) {
                    return response()->json(['message' => 'Tickets sold out'], 400);
                }

                $booking = Booking::create($request->all());
                
                // Atomic decrement
                $ticket->decrement('quantity');

                return response()->json([
                    'message' => 'Booking Successful',
                    'booking' => $booking
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Booking failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        return Booking::find($id);
    }

    public function destroy($id)
    {
        Booking::destroy($id);

        return response()->json([
            'message'=>'Booking Cancelled'
        ]);
    }
}