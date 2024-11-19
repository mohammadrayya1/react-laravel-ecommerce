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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->nullable()->constrained('users')->nullOnDelete();
            $table->string("username");
            $table->string("email");
            $table->string("phone");
            $table->string("address");
            $table->string("city");
            $table->string("postal_code");
            $table->unsignedFloat("total");
            $table->enum("status",['pending','processing','delivering','completed','cancelled','refunded'])
                ->default('pending');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
