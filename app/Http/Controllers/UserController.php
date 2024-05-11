<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function loginUser(Request $request)
    {
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $auth = Auth::user();
            $res['token'] = $auth->createToken('auth_token')->plainTextToken;
            $res['username'] = $auth->username;
            $res['name'] = $auth->name;
            $res['role'] = $auth->role;
            $res['id'] = $auth->id;

            return response()->json(['data' => $res], 200);
        } else {
            return response()->json(['data' => null, 'message' => 'unauthorized'], 401);
        }
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        if (empty($search)) {
            $users = User::where('role', 'employee')->get();
        } else {
            $users = User::where('role', 'employee')->where('name', 'like', "%$search%")->get();
        }
        return response()->json(['data' => $users, 'message' => 'success'], 200);
    }

    public function create(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users|max:255',
            'password' => 'required|string|min:8|max:255',
        ]);

        if ($validate->fails()) {
            return response()->json(['data' => null, 'message' => $validate->errors()->all()], 400);
        }

        try {
            $validatedData = $validate->validated();
            $validatedData['password'] = bcrypt($validatedData['password']);
            $user = User::create($validatedData);

            return response()->json(['data' => $user, 'message' => "success"], 201);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json(['data' => $user, 'message' => 'success'], 200);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 404);
        }
    }

    public function edit($id, Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'password' => 'required|string|min:8|max:255',
        ]);

        if ($validate->fails()) {
            return response()->json(['data' => null, 'message' => $validate->errors()->all()], 400);
        }

        try {
            $validatedData = $validate->validated();
            $validatedData['password'] = bcrypt($validatedData['password']);
            $user = User::where('id', $id)->update($validatedData);
            return response()->json(['data' => $user, 'message' => "success"], 201);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id); // Cari user berdasarkan ID
            $user->delete(); // Hapus user dari database

            return response()->json(['data' => $user, 'message' => 'success'], 200);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 404);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['data' => 'Logout', 'message' => 'success'], 200);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 404);
        }
    }
}
