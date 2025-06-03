<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Http\Controllers\Controller;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $user = Auth::user();
        if ($user->role != 0 && $user->role != 1) {
            return response("you are not allowed here", 200);
        }
        $items = File::select('id', 'name', 'description')->paginate(40);
        return response($items, 200);
    }
    public function searchAdmin(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $category = File::select('id', 'name', 'description')->where('name', 'like', '%' . $request->value . '%')->orWhere('description', 'like', '%' . $request->value . '%')->orderBy('name')->paginate(25);
        return response($category);
    }
    public function search()
    {

        $user = Auth::user();
        if ($user->role != 0 && $user->role != 1) {
            return response("you are not allowed here", 200);
        }
        $items = File::select('id', 'name', 'description')->paginate(40);
        return response($items, 200);
    }
    public function upload(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'key' => 'required',
                'name' => 'required|string',
                'description' => 'nullable|string',
                'file' => 'required',
            ]

        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        if ($request->key != "oMAR_aSSOLI") {
            return response("wrong key", 200);
        }
        $item = new File();
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . random_int(1, 99) . '.' . $file->getClientOriginalExtension();

            $destinationPath = public_path('/img/files/');
            $file->move($destinationPath, $filename);
            $item->name = $filename;
        }
        $item->description = $request->description;
        $item->save();
        $history = new History();
        $history->user_id = 1;
        $history->action = "New File Has Been Added with Name: " . $item->name . " and Path: " . " and Description: " . $item->description;
        $history->save();
        return response($item, 201);
    }
    public function show($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, [0, 1])) {
            return response("you are not allowed here", 200);
        }
        $category = File::where('id', $id)->get();
        return response($category);
    }
    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->role > 1) {
            return response("you are not allowed here", 200);
        }
        $validator = Validator::make(
            ['id' => $id],
            [
                'id' => 'required|exists:files,id',
            ]

        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        $file = File::find($id);
        if ($file == null) {
            return response("wrong file");
        }
        $filePath = public_path('/img/files/' . $file->file);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        $file->delete();
        $history = new History();
        $history->user_id = $user->id;
        $history->action = "File Has Been Deleted By user: " . $user->id . " with Path: " . $filePath;
        $history->save();
        return response("deleted", 200);
        //
    }
}
