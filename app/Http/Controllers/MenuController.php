<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'menuName' => 'required|string|max:255',
            'pict' => 'required|image|mimes:jpeg,png,jpg,gif|max:3072',
            'harga' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return response()->json(['data' => null, 'message' => $validate->errors()->all()], 400);
        }

        try {

            $fileName = Str::random(6) . '_' . time() . '.' . $request->file('pict')->getClientOriginalExtension();
            $storedFile = $request->file('pict')->storeAs('pict', $fileName, 'public');

            $menu = Menu::create([
                'menuName' => $request->menuName,
                'pict' => $storedFile,
                'harga' => $request->harga,
            ]);

            return response()->json(['message' => 'Menu created successfully', 'data' => $menu], 201);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 404);
        }
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        if (empty($search)) {
            $menus = Menu::all();
        } else {
            $menus = Menu::where('menuName', 'like', "%$search%")->get();
        }
        return response()->json(['data' => $menus], 200);
    }

    public function update(Request $request, $id)
    {
        $validate = Validator::make($request->all(), [
            'menuName' => 'required|string|max:255',
            'pict' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:3072',
            'harga' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return response()->json(['data' => null, 'message' => $validate->errors()->all()], 400);
        }

        try {
            $menu = Menu::findOrFail($id);

            $storedFile = null;
            if ($request->pict) {
                if (isset($menu->pict)) {
                    Storage::delete("public/{$menu->pict}");
                }

                $fileName = Str::random(6) . '_' . time() . '.' . $request->file('pict')->getClientOriginalExtension();
                $storedFile = $request->file('pict')->storeAs('pict', $fileName, 'public');
            }

            $menu->update([
                'menuName' => $request->menuName,
                'pict' => $storedFile ? $storedFile : $menu->pict,
                'harga' => $request->harga,
            ]);

            return response()->json(['message' => 'Menu updated successfully', 'data' => $menu], 200);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $menu = Menu::findOrFail($id);

            if (isset($menu->pict)) {
                Storage::delete("public/{$menu->pict}");
            }

            $menu->delete();
            return response()->json(['message' => 'Menu deleted successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 404);
        }
    }
}
