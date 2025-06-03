<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => "steal",
            'description' => "steal from victim device",
        ]);
        Category::create([
            'name' => "spy",
            'description' => "spy on victim device",
        ]);
        Category::create([
            'name' => "hack",
            'description' => "hack victim device",
        ]);
        Category::create([
            'name' => "crack",
            'description' => "crack victim device",
        ]);
        Category::create([
            'name' => "phishing",
            'description' => "phishing victim device",
        ]);
    }
}
