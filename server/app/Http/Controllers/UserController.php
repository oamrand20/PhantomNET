<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Location;
use App\Models\Referral;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'phone' => ['required', 'regex:/^07[789][0-9]{7}$/'],
            'password' => [
                'required',
                'string',
                'min:8',
                'max:32',
                'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/'
            ],
        ]);

        // Remove cart from credentials before attempting authentication
        $credentials = [
            'phone' => $validatedData['phone'],
            'password' => $validatedData['password']
        ];

        // Attempt to log in the user
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Invalid credentials',
                'errors' => ['auth' => ['The provided credentials are incorrect.']]
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Retrieve the authenticated user
        $user = Auth::user();
        if ($user->role >= 2) {
            return response([
                'message' => 'Account is suspended',
                'errors' => ['auth' => ['Your account has been suspended. Please contact support.']]
            ], Response::HTTP_FORBIDDEN);
        }

        // Generate the token
        $token = $user->createToken('user-token');

        // Optionally, delete other tokens (if you want single-token sessions)
        $user->tokens()->where('id', '<>', $token->accessToken->id)->delete();
        $location = Location::where('id', $user->location_id)->first();
        // Return the token and user ID in the response
        return response([
            'token' => $token->plainTextToken,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'address' => $user->address,
            'location_id' => $user->location_id,
            'role' => $user->role
        ]);
    }
    public function user()
    {
        return Auth::user();
    }
    public function allUsers()
    {
        $user = Auth::user();
        if ($user->role > 1) {
            return response("you are not allowed here", 200);
        }
        $users = User::select('id', 'name', 'role', 'email', 'phone')->orderByDesc('name')->paginate(20);
        return response($users, 200);
    }
    public function search(Request $request)
    {
        $user = Auth::user();
        if ($user->role > 1) {
            return response("you are not allowed here", 200);
        }
        $users = User::where('name', 'like', '%' . $request->value . '%')->orWhere('email', 'like', '%' . $request->value . '%')->orWhere('phone', 'like', '%' . $request->value . '%')->orderBy('name')->paginate(20);
        return response($users);
    }
    public function addUserAdmin(Request $request)
    {
        $admin = Auth::user();
        if ($admin->role != 0) {
            return response("you are not allowed here", 200);
        }
        $validator = Validator::make(
            $request->all(),
            [
                'name' => ['required', 'min:3', 'max:35'],
                'password' => 'required|min:8|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_%^&*-.]).{8,}$/',
                'role' => ['required', Rule::in([0, 1, 2, 3, 4])],
                'phone' => ['required', 'regex:/^07[0-9]{8}$/', 'unique:users,phone'],
            ]
        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }
        $user = new User();
        $user->name = $request->input('name');
        $user->role = $request->input('role');
        $user->phone = $request->input('phone');
        $user->location_id = 1;
        // return response("done");
        $user->password = Hash::make($request->input('password'));
        $user->save();
        $history = new History();
        $history->user_id = $admin->id;
        $history->action = "added new User " . $user->name . "with phone " . $user->phone . " and role: " . $user->role;
        $history->save();
        return response($user, 201);
    }
    public function showOne($id)
    {
        $user = Auth::user();
        if ($user->role != 0) {
            return response("you are not allowed here", 200);
        }
        $data = User::where('id', $id)->get();
        return response($data);
    }
    public function show($id)
    {
        $user = User::where('id', $id)->get();
        return response($user);
    }

    //admin roles update
    public function makeSuperAdmin($id)
    {
        $admin = Auth::user();
        if ($admin->role != 0) {
            return response("you are not allowed here", 200);
        }
        $user = User::find($id);
        $user->role = 0;
        $user->update();
        return response($user, 201);
    }
    public function makeNormalAdmin($id)
    {
        $admin = Auth::user();
        if ($admin->role != 0 || $admin->id == $id) {
            return response("you are not allowed here", 200);
        }
        $user = User::find($id);
        $user->role = 1;
        $user->update();
        return response($user, 201);
    }
    public function banAdmin($id)
    {
        $admin = Auth::user();
        if ($admin->role != 0 || $admin->id == $id) {
            return response("you are not allowed here", 200);
        }
        $user = User::find($id);
        $user->role = 2;
        $user->update();
        return response($user, 201);
    }
    public function addLocation($id, Request $request)
    {
        $admin = Auth::user();
        if ($admin->role != 0 || $admin->id == $id) {
            return response("you are not allowed here", 200);
        }
        $user = User::find($id);
        $user->location_link = $request->location_link;
        $user->update();
        return response($user, 201);
    }
    public function updateProfile(Request $request, $id)
    {
        $loggedUser = Auth::user();
        if ($loggedUser->id != $id) {
            return response("you are not allowed here", 200);
        }
        $request->validate([
            'name' => ['required', 'min:3', 'max:35'],
            'email' => 'nullable|email',
            'location_id' => 'nullable|exists:locations,id',
            'address1' => 'required|min:8|max:100',
            'address2' => 'required|min:8|max:100',
            'location_link' => 'nullable|min:10|max:128',

        ]);
        $user = User::find($id);
        $user->name = $request->name;
        $user->location_id = $request->location_id;
        $user->location_link = $request->location_link;
        $user->address1 = $request->address1;
        $user->address2 = $request->address2;
        $user->email = $request->email;
        $user->update();
        return response($user, 201);
    }
    public function passwordUpdate(Request $request, $id)
    {
        $loggedUser = Auth::user();
        if ($loggedUser->id != $id) {
            return response("you are not allowed here", 200);
        }

        $request->validate([
            'current_password' => ['required'],
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_%^&*-.]).{8,}$/'
            ]
        ]);

        $user = User::find($id);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'errors' => [
                    'current_password' => ['Current password is incorrect']
                ]
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response($user, 201);
    }
    public function destroy($id)
    {
        $admin = Auth::user();
        if ($admin->role != 0 || $admin->id == $id) {
            return response("you are not allowed here", 200);
        }
        return User::where('id', '=', $id)->delete();
    }
    //admin data
    public function adminData()
    {
        $user = Auth::user();
        if ($user->role != 0 && $user->role != 1) {
            return response("you are not allowed here", Response::HTTP_FORBIDDEN);
        }

        // Get current date references
        $users = User::count();
        $messages = DB::table('messages')->where('status', 0)->count();
        $locations = Location::count();

        return response([
            'users' => $users,
            'messages' => $messages,
            'locations' => $locations,
        ], 200);
    }
    private function getMonthlyStats(int $year, int $month): array
    {
        $orders = DB::table('orders')->where('state', 5)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->selectRaw('SUM(total) as total, COUNT(*) as count')
            ->first();

        $payments = DB::table('payments')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->sum('amount');
        $salaries = DB::table('payments')->where('type', 4)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->sum('amount');
        return [
            'profit' => ($orders->total ?? 0) - $payments,
            'income' => $orders->total ?? 0,
            'sold_orders' => $orders->count ?? 0,
            'payments' => $payments ?? 0,
            'salaries' => $salaries ?? 0,
        ];
    }
    private function getYearlyStats(int $year): array
    {
        $orders = DB::table('orders')->where('state', 5)
            ->whereYear('created_at', $year)
            ->selectRaw('SUM(total) as total, COUNT(*) as count')
            ->first();

        $payments = DB::table('payments')
            ->whereYear('created_at', $year)
            ->sum('amount');
        $salaries = DB::table('payments')->where('type', 4)
            ->whereYear('created_at', $year)
            ->sum('amount');

        return [
            'profit' => ($orders->total ?? 0) - $payments,
            'income' => $orders->total ?? 0,
            'sold_orders' => $orders->count ?? 0,
            'payments' => $payments ?? 0,
            'salaries' => $salaries ?? 0,
        ];
    }
    // earnings
    public function earnings() //ok
    {
        $user = Auth::user();
        if ($user->role != 0) {
            return response("you are not allowed here", Response::HTTP_FORBIDDEN);
        }

        // Get current date references
        $now = now();
        $startOfDay = $now->startOfDay();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfYear = $now->copy()->startOfYear();

        // Calculate daily, monthly, and yearly earnings
        $dailyMoney = DB::table('orders')
            ->whereDate('created_at', $now->toDateString())
            ->where('state', 5)
            ->sum('total');

        $monthlyMoney = DB::table('orders')
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->where('state', 5)
            ->sum('total');

        $yearlyMoney = DB::table('orders')
            ->whereYear('created_at', $now->year)
            ->where('state', 5)
            ->sum('total');

        return response([
            'dailyMoney' => $dailyMoney,
            'monthlyMoney' => $monthlyMoney,
            'yearlyMoney' => $yearlyMoney,
        ], 200);
    }

    public function yearEearnings(Request $request)
    {
        $user = Auth::user();
        if ($user->role != 0) {
            return response("you are not allowed here", Response::HTTP_FORBIDDEN);
        }

        $year = $request->year;

        // Calculate total year income
        $totalYearIncome = DB::table('orders')
            ->whereYear('created_at', $year)
            ->where('state', 5)
            ->sum('total');

        // Calculate monthly profits
        $monthlyProfits = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthlyProfits[$month] = DB::table('orders')
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->where('state', 5)
                ->sum('total');
        }

        return response([
            'totalYearIncome' => $totalYearIncome,
            'monthlyProfits' => $monthlyProfits
        ], 200);
    }

    public function periodEearnings(Request $request)
    {
        $user = Auth::user();
        if ($user->role != 0) {
            return response("you are not allowed here", Response::HTTP_FORBIDDEN);
        }

        $validator = Validator::make($request->all(), [
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()]);
        }
        $query = DB::table('orders')
            ->whereBetween('created_at', [$request->from, $request->to])
            ->where('state', 5);

        $earningsMoney = $query->sum('orders.total');

        return response([
            'earningsMoney' => $earningsMoney
        ], 200);
    }
}
