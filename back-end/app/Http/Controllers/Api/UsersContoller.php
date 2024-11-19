<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class UsersContoller extends Controller
{


    public  function GetUsers(){

        return Response::json([
            "users"=>User::all()
        ]);
    }

    public function AuthAdmin(){
        $admin=Auth::guard('admin')->user();
        $time = $admin->tokens()->latest()->first()->expires_at;
        $time=  Carbon::parse($time);
        if ( Carbon::now('Europe/Berlin')->greaterThan($time)) {

            return response()->json(['message' => 'Token has expired'], 401);
        }

        return Response::json([
            "admin"=>Auth::guard('admin')->user(),
            "time"=>$time
        ]);
    }

    public function AuthAuser(){
        return Response::json([
            "user"=>Auth::guard('user')->user()
        ]);
    }
    public function getUser($id)
    {

        if(Auth::guard("admin")){
            return User::findOrFail($id);
        }elseif (Auth::guard("user")->user()->id==$id){
            return User::findOrFail($id);
        }
        return Response::json([
            'message'=>"Erorr"
        ]);
    }

    // Edit User
    public function editUser(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email'
        ]);
        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();
    }

    // Delete User
    public function destroy($id)
    {
        return  User::findOrFail($id)->delete();
    }
}
