<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Profile;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function loginAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $admin = Auth::guard('admin')->getProvider()->retrieveByCredentials(['email' => $request->email]);

        if ($admin && Auth::guard('admin')->getProvider()->validateCredentials($admin, ['password' => $request->password])) {

          $token = $admin->createToken('AdminsToken', ['*'], Carbon::now('Europe/Berlin')->addMinutes(config('sanctum.expiration')))->plainTextToken;
            $time= $admin->tokens()->latest()->first()->expires_at;
            return response()->json([
                'token' => $token,
                'admin' => $admin,
                'time'=>$time
            ], 200);
        } else {
            return response()->json(['message' => 'The password is not correct.'], 401);
        }
    }

    public function loginUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = Auth::guard('user')->getProvider()->retrieveByCredentials(['email' => $request->email]);

        if ($user && Auth::guard('user')->getProvider()->validateCredentials($user, ['password' => $request->password])) {

            $token = $user->createToken('UserToken', ['*'],Carbon::now('Europe/Berlin')->addMinutes(config('sanctum.expiration')))->plainTextToken;
            return response()->json([
                'token' => $token,
                'user' => $user
            ], 200);
        } else {
            return response()->json(['message' => 'The password is not correct.'], 401);
        }
    }

    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password)  // تصحيح الكتابة من 'passowrd' إلى 'password'
            ]);

            $profile = new Profile([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'birthday' => $request->birthday,
                'gender' => $request->gender,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'phone'=>$request->phone
            ]);

            $user->profile()->save($profile);

            DB::commit();

            return response()->json([
                "message" => "Welcome",
                "userID" => $user->id
            ]);
        } catch (\Exception $e) {
            DB::rollback();


            return response()->json([
                "message" => "Registration failed",
                "error" => $e->getMessage()
            ], 400);
        }
    }

    public function logoutAdmin(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $request->user('admin')->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }

    public function logoutUser(Request $request)
    {

        $admin = Auth::guard('user')->user();
        $request->user('user')->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out'], 200);
    }

}
