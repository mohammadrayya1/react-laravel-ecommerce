<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $name= $this->faker->name;
        return [
            'product_name' => $this->faker->words(3, true),
            'slug' => $this->faker->slug,
            'description' => $this->faker->paragraph,
            'stock' => $this->faker->numberBetween(0, 100),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'product_image' => $this->faker->imageUrl(640, 480, 'products', true),
            'status' => $this->faker->randomElement(['active','draft',"archvied"]),
            'category_id' =>Category::inRandomOrder()->first()->id,
        ];

    }
}
