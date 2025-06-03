<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Models\History;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $category = Category::select('id', 'name', 'description')->orderByDesc('id')->paginate(25);
        return response($category, 200);
    }
    public function searchAdmin(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $category = Category::select('id', 'name', 'description')->where('name', 'like', '%' . $request->value . '%')->orderBy('name')->paginate(25);
        return response($category);
    }
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role != 0 && $user->role != 1) {
            return response("you are not allowed here", 200);
        }
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|string|unique:categories',
                'description' => 'required|string|max:300',
            ]

        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        $category = new Category();
        $category->name = $request->name;
        $category->description = $request->description;
        $category->save();
        $history = new History();
        $history->user_id = $user->id;
        $history->action = "Added New Category " . $user->name;
        $history->save();
        return response($category, 201);
    }
    public function show($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $category = Category::where('id', $id)->get();
        return response($category);
    }
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|string|max:30',
                'description' => 'required|string|max:300',
            ]

        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        if ($request->role >= 2) {
            return response()->json(['errors' => "not allowed here"]);
        }
        $category = Category::find($id);
        $category->name = $request->name;
        $category->description = $request->description;
        $category->update();
        $history = new History();
        $history->user_id = $user->id;
        $history->action = "The Category with Id: " . $category->id . " was updated by user: " . $user->id;
        $history->save();
        return response($category, 201);
    }
    public function destroy($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 403);
        }

        // Find the category
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        // Delete the category
        $history = new History();
        $history->user_id = $user->id;
        $history->action = "The category " . $category->name . " has been deleted by user: " . $user->id;
        $history->save();
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
