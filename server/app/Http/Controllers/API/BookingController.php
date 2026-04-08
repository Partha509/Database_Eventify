<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Event;

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

        // All events hosted by this user
        $events = Event::with(['tickets.bookings.payment'])->where('user_id', $userId)->get();

        $totalEvents = $events->count();
        $totalAttendees = 0;
        $totalRevenue = 0;

        foreach ($events as $event) {
            foreach ($event->tickets as $ticket) {
                $bookingCount = $ticket->bookings->count();
                $totalAttendees += $bookingCount;
                foreach ($ticket->bookings as $booking) {
                    $totalRevenue += $booking->payment ? (float)$booking->payment->pay_amount : (float)$ticket->price;
                }
            }
        }

        return response()->json([
            'total_events'    => $totalEvents,
            'total_attendees' => $totalAttendees,
            'total_revenue'   => $totalRevenue,
        ]);
    }

    /**
     * Stats for the Attending tab:
     * total events user is attending, total cost paid, total attendees at those events
     */
    public function attendingStats(Request $request)
    {
        $userId = auth()->id();

        $bookings = Booking::with(['ticket.event.tickets.bookings', 'payment'])
                ->where('user_id', $userId)
                ->get();

        $totalEventsAttending = $bookings->count();
        $totalCost = $bookings->sum(fn($b) => $b->payment ? (float)$b->payment->pay_amount : (float)optional($b->ticket)->price);

        // Sum all attendees across those events
        $totalAttendees = 0;
        $seenEvents = [];
        foreach ($bookings as $b) {
            $event = optional($b->ticket)->event;
            if ($event && !in_array($event->event_id, $seenEvents)) {
                $seenEvents[] = $event->event_id;
                foreach ($event->tickets as $ticket) {
                    $totalAttendees += $ticket->bookings->count();
                }
            }
        }

        return response()->json([
            'total_events'    => $totalEventsAttending,
            'total_cost'      => $totalCost,
            'total_attendees' => $totalAttendees,
        ]);
    }

    public function store(Request $request)
    {
        $booking = Booking::create($request->all());

        return response()->json([
            'message'=>'Booking Successful',
            'booking'=>$booking
        ],201);
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