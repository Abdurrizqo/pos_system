<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderMenu;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function listOrder(Request $request)
    {
        $tanggalMulai = $request->input('tanggalMulai', Carbon::today()->toDateString());
        $tanggalAkhir = $request->input('tanggalAkhir', Carbon::today()->toDateString());

        if ($tanggalAkhir < $tanggalMulai) {
            $tanggalAkhir = $tanggalMulai;
        }

        $orders = Order::whereDate('created_at', '>=', $tanggalMulai)
            ->whereDate('created_at', '<=', $tanggalAkhir)
            ->orderBy('created_at', 'desc')
            ->get();

        $balance = Order::whereDate('created_at', '>=', $tanggalMulai)
            ->whereDate('created_at', '<=', $tanggalAkhir)
            ->where('isDelete', false)
            ->sum('total_harga');

        return response()->json([
            'data' =>
            [
                'order' => $orders,
                'balance' => $balance
            ]
        ], 200);
    }

    public function createOrder(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'totalHarga' => 'required|integer|min:0',
            'menu' => 'required|array',
            'menu.*.namaMenu' => 'required|exists:menus,menuName',
            'menu.*.jumlah' => 'required|integer|min:1',
            'menu.*.hargaSatuan' => 'required|integer|min:1',
        ]);


        if ($validate->fails()) {
            return response()->json(['data' => null, 'message' => $validate->errors()->all()], 400);
        }

        try {
            $user = Auth::user();
            DB::beginTransaction();
            $order = Order::create([
                'total_harga' => $request->totalHarga,
                'namaKasir' => $user->name
            ]);

            $menu = [];
            foreach ($request->menu as $value) {
                $menu[] = OrderMenu::create([
                    'namaMenu' => $value['namaMenu'],
                    'jumlah' => $value['jumlah'],
                    'hargaSatuan' => $value['hargaSatuan'],
                    'orderId' => $order->id,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Menu created successfully', 'data' => [
                'total_harga' => $order->total_harga,
                'namaKasir' => $order->namaKasir,
                'idOrder' => $order->id,
                'created_at' => Carbon::parse($order->created_at)->format('d-m-Y H:i:s'),
                'menu' => $menu
            ]], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['data' => null, 'message' => $th->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $order = Order::findOrFail($id);
            $menu = OrderMenu::where('orderId', $id)->get();

            return response()->json(['message' => 'Success', 'data' => [
                'total_harga' => $order->total_harga,
                'namaKasir' => $order->namaKasir,
                'isDelete' => boolval($order->isDelete),
                'idOrder' => $order->id,
                'created_at' => Carbon::parse($order->created_at)->format('d-m-Y H:i:s'),
                'menu' => $menu
            ]], 200);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 404);
        }
    }

    public function changeOrderStatus($id)
    {
        try {
            $order = Order::findOrFail($id);
            $order->isDelete = !$order->isDelete;
            $order->save();

            return response()->json(['message' => 'Menu Delete successfully', 'data' => $order], 200);
        } catch (\Throwable $th) {
            return response()->json(['data' => null, 'message' => $th->getMessage()], 400);
        }
    }

    // public function totalPendapatanHariIni(Request $request)
    // {
    //     $tanggalMulai = $request->input('tanggalMulai', Carbon::today()->toDateString());
    //     $tanggalAkhir = $request->input('tanggalAkhir', Carbon::today()->toDateString());

    //     if ($tanggalAkhir < $tanggalMulai) {
    //         $tanggalAkhir = $tanggalMulai;
    //     }

    //     $orders = Order::whereDate('created_at', '>=', $tanggalMulai)
    //         ->whereDate('created_at', '<=', $tanggalAkhir)
    //         ->orderBy('created_at', 'asc')
    //         ->get();

    //     return response()->json(['data' => $orders], 200);
    // }
}
