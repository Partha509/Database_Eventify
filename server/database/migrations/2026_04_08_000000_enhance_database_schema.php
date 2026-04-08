<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EnhanceDatabaseSchema extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add Soft Deletes to core tables
        Schema::table('events', function (Blueprint $table) {
            $table->softDeletes();
            $table->index('user_id');
            $table->index('category_id');
            $table->index('venue_id');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->softDeletes();
            $table->index('user_id');
            $table->index('ticket_id');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->index('event_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['user_id']);
            $table->dropIndex(['category_id']);
            $table->dropIndex(['venue_id']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['user_id']);
            $table->dropIndex(['ticket_id']);
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['event_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email']);
        });
    }
}
