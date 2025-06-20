<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('message')->require();
            $table->unsignedInteger('sender_id')->require();
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('restrict');
            $table->tinyInteger('status')->default(0); //0:unread, 1:read
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
