<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    public function index() //ok
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $history = History::select()->orderByDesc('id')->paginate(100);
        return response($history, 200);
    }
    public function search(Request $request) //ok
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $history = History::where('action', 'like', '%' . $request->value . '%')->orWhere('id', 'like', '%' . $request->value . '%')->orWhere('user_id', 'like', '%' . $request->value . '%')->orderByDesc('id')->paginate(100);
        return response($history, 200);
    }
}
