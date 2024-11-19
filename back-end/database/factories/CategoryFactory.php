<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'name' => $this->faker->word,
            'slug' => $this->faker->slug,
            'imag' => $this->faker->imageUrl(),
            'description' => $this->faker->text(200),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'category_id' => null
        ];

    }
}
