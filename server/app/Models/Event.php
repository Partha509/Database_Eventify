<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'event_id';
    
    public $timestamps = false;

    protected $appends = ['price', 'attendees_count'];

    public function getPriceAttribute()
    {
        $ticket = $this->tickets->first();
        return $ticket ? (float) $ticket->price : 0;
    }

    public function getAttendeesCountAttribute()
    {
        // Sum bookings across all tickets for this event
        return \App\Models\Booking::whereIn('ticket_id', $this->tickets->pluck('ticket_id'))->count();
    }

    protected $fillable = [
        'event_name',
        'description',
        'start_date_time',
        'venue_id',
        'category_id',
        'user_id'
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class,'venue_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class,'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class,'event_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class,'event_id');
    }
}