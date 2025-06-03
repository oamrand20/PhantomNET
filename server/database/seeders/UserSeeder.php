<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin Super',
            'password' => Hash::make('123_321Aa'),
            'location_id' => 1,
            'address' => "address1, address1",
            'phone' => '0777777770',
            'email' => 'admin.super@admin.com',
            'role' => 0,
        ]);
        User::create([
            'name' => 'Admin Normal',
            'password' => Hash::make('123_321Aa'),
            'location_id' => 2,
            'address' => "address2, address2",
            'phone' => '0777777771',
            'email' => 'admin.normal@admin.com',
            'role' => 1,
        ]);
        User::create([
            'name' => 'Admin Banned',
            'password' => Hash::make('123_321Aa'),
            'location_id' => 3,
            'address' => "address3, address3",
            'phone' => '0777777772',
            'email' => 'admin.banned@admin.com',
            'role' => 2,
        ]);
    }
}
