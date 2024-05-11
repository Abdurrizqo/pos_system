<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = Profile::first();
        return response()->json(['data' => $profile, 'message' => 'success'], 200);
    }

    public function editProfile(Request $request)
    {
    }
}
