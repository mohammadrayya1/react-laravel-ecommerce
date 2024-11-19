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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->integer('stock')->default(0);
            $table->float('price')->default(0);
            $table->unsignedSmallInteger("quantity")->default(0);
            $table->string('product_image')->nullable();
            $table->enum('status',['active','draft',"archvied"])->default('active');
            $table->softDeletes();
            $table->timestamps();

            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();



        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
