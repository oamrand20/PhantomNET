<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Code;
use App\Models\History;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CodeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $coupons = Code::select('id', 'name', 'code', 'description', 'category_id')->orderByDesc('id')->paginate(25);
        $categories = Category::select("name", 'id')->orderByDesc('id')->get();
        return response([
            'coupons' => $coupons,
            'categories' => $categories
        ], 200);
    }
    public function commands()
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $commands = Code::select('id', 'code')->orderByDesc('id')->get();
        return response($commands, 200);
    }
    public function search(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        if ($request->value == "") {
            $category = Code::select('id', 'name', 'code', 'description', 'category_id')->orderByDesc('id')->paginate(30);
            $categories = Category::select("name", 'id')->orderByDesc('id')->get();
            return response([
                'coupons' => $category,
                'categories' => $categories
            ], 200);
        }
        $category = Code::select('id', 'name', 'code', 'description', 'category_id')->where('code', 'like', '%' . $request->value . '%')->orWhere('id', '=', $request->value)->orderByDesc('id')->paginate(30);
        $categories = Category::select("name", 'id')->orderByDesc('id')->get();
        return response([
            'coupons' => $category,
            'categories' => $categories
        ], 200);
    }
    public function toggle($id)
    {
        $user = Auth::user();
        $order = Code::find($id);
        if (in_array($user->role, [0, 1])) {
            if ($order->state == 0) {
                $order->state = 1;
                $order->update();
                return response('updated');
            } elseif ($order->state == 1) {
                $order->state = 0;
                $order->update();
                return response('updated');
            } else {
                return response('wrong');
            }
        } else {
            return response('not allowed here');
        }
    }
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        // return response($request);
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'code' => 'required|unique:codes',
                'description' => 'required',
                'category_id' => 'required|exists:categories,id',
            ]

        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        $nCode = new Code();
        $nCode->name = $request->name;
        $nCode->description = $request->description;
        $nCode->code = $request->code;
        $nCode->category_id = $request->category_id;
        $nCode->save();
        $history = new History();
        $history->user_id = $user->id;
        $history->action = "New Code Has been Added " . $nCode->code . " By user with id: " . $user->id;
        $history->save();
        return response($nCode, 201);
    }
    public function show($id)
    {
        $code = Code::where('code', '=', $id)->get();
        if (count($code) == 0) {
            return response("wrong code");
        }
        return response($code);
    }
    public function details($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $code =  Code::find($id);
        return response($code);
    }
    public function destroy($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $history = new History();
        $history->user_id = $user->id;
        $history->action = "Code Has been Deleted by user: " . $user->name;
        $history->save();
        return Code::where('id', '=', $id)->delete();
    }
}
