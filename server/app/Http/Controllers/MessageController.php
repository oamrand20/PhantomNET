<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function index()
    {

        $user = Auth::user();
        if ($user->role != 0 && $user->role != 1) {
            return response("you are not allowed here", 200);
        }
        $items = Message::select('id', 'message', 'f_name', 'l_name', 'contact', 'status', 'created_at')->paginate(40);
        return response($items, 200);
    }
    public function search(Request $request) //ok
    {
        $user = Auth::user();
        if ($user->role != 0 && $user->role != 1) {
            return response("you are not allowed here", 200);
        }

        $searchValue = $request->value;

        $items = Message::select('id', 'message', 'f_name', 'l_name', 'contact', 'status', 'created_at')
            ->where(function ($query) use ($searchValue) {
                $query->where('id', 'like', "%{$searchValue}%")
                    ->orWhere('contact', 'like', "%{$searchValue}%")
                    ->orWhere('f_name', 'like', "%{$searchValue}%")
                    ->orWhere('l_name', 'like', "%{$searchValue}%");
            })->paginate(40);
        return response($items);
    }
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'f_name' => 'required',
                'l_name' => 'required',
                'contact' => [
                    'required',
                    'regex:/^(\+?1\s?)?(\([0-9]{3}\)|[0-9]{3})([-.\s]?[0-9]{3})([-.\s]?[0-9]{4})$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
                ],
                'message' => 'required'
            ]
        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        $item = new Message();
        $item->f_name = $request->input('f_name');
        $item->l_name = $request->input('l_name');
        $item->contact = $request->input('contact');
        $item->message = $request->input('message');
        $item->save();
        return response("Your order has been sent successfully", 200);
    }
    public function update($id)
    {
        $user = Auth::user();
        if ($user->role != 0 && $user->role != 1) {
            return response("you are not allowed here", 200);
        }
        $item = Message::find($id);
        if ($item->status == 0) {
            $item->status = 1;
        } else {
            $item->status = 0;
        }
        $item->update();
        return response($item, 200);
    }
}
