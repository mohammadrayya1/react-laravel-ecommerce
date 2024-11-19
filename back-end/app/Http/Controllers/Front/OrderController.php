<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class OrderController extends Controller
{
    public  function getAllOreders(){
        if(Auth::guard("admin")){
            return Response::json([
                "orders"=>Order::all(),


            ]);
        }}

    public function getOrderItemsByOrderId($id)
    {
        if (Auth::guard("admin")->check()) { // تأكد من أن الدالة check() تستخدم للتحقق من الحراسة
            $orderItems = OrderItem::with('product') // تحميل البيانات المرتبطة بالمنتج
            ->where("order_id", $id)
                ->get();

            return Response::json([
                "orderItems" => $orderItems->map(function ($item) {

                    return [
                        "id" => $item->id,
                        "order_id" => $item->order_id,
                        "product_id" => $item->product_id,
                        "product_name" => $item->product_name,
                        "price" => $item->price,
                        "quantity" => $item->quantity,
                        "options" => $item->options,
                        "total" => $item->total,
                        "product_image" => $item->product ? $item->product->product_image : null
                    ];
                })
            ]);
        }
        return response()->json(["error" => "Unauthorized"], 401);
    }

    public function getOrderItemsByUserID($id)
    {
        if(Auth::guard("user")->check()) {
            $userId = Auth::guard("user")->user()->id;
            $orderItems = OrderItem::with('product') // تحميل البيانات المرتبطة بالمنتج
            ->where("order_id", $id)
                ->get();

            return Response::json([
                "orderItems" => $orderItems->map(function ($item) {

                    return [
                        "id" => $item->id,
                        "order_id" => $item->order_id,
                        "product_id" => $item->product_id,
                        "product_name" => $item->product_name,
                        "price" => $item->price,
                        "quantity" => $item->quantity,
                        "options" => $item->options,
                        "total" => $item->total,
                        "product_image" => $item->product ? $item->product->product_image : null
                    ];
                })
            ]);

        return response()->json(["error" => "Unauthorized"], 401);
        }
    }

    public function getOrderByUserID(){
        if(Auth::guard("user")->check()) {
            $userId = Auth::guard("user")->user()->id;
            $orderItems = Order::where('user_id',$userId) // تحميل البيانات المرتبطة بالمنتج
                ->get();
            return Response::json([
                'order'=>$orderItems
            ]);
        }
        return response()->json(["error" => "Unauthorized"], 401);
    }
    public function destroy($id)
    {

        DB::beginTransaction();


        try {
            $order = Order::find($id);
            Log::error($order);
            if (!$order) {

                return Response::json([
                    "message" => "Order not found",
                ], 404);
            }
            $order->delete();
            DB::commit();
            return Response::json([
                "message" => "Order deleted successfully",
            ], 200);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json([
                "message" => "Failed to delete order",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function destroyByUser($id)
    {

        DB::beginTransaction();

        if (Auth::guard('user')){
        try {
            $user=Auth::guard('user')->user();
            $order = Order::where("id",$id)->where('user_id',$user->id)->first();
            Log::error($order);
            if (!$order) {
                DB::rollback();
                return Response::json([
                    "message" => "Order not found",
                ], 404);
            }
            $order->delete();
            DB::commit();
            return Response::json([
                "message" => "Order deleted successfully",
            ], 200);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json([
                "message" => "Failed to delete order",
                "error" => $e->getMessage(),
            ], 500);
        }
    }
    }
    public function destroyorderitem($itemId,$orderId){
        DB::beginTransaction();

        if (Auth::guard('user')){
            try {
                $user=Auth::guard('user')->user();

                $order = Order::where('id', $orderId)
                    ->where('user_id', $user->id)
                    ->first();


                if (!$order) {

                    DB::rollback();
                    return response()->json(['message' => 'Order not found or does not belong to the user'], 404);
                }


                if ($order) {
                    foreach ($order->products as $product) {
                        if ($product->pivot->id == $itemId) {


                            $order->total=$order->total - $product->pivot->total;
                            $order->save();

                            $product->pivot->delete(); // حذف العلاقة
                        }
                    }}


             //   $orderItem->delete();
                DB::commit();
                return Response::json([
                    "message" => "Order deleted successfully",
                ], 200);

            } catch (\Exception $e) {
                DB::rollback();
                return Response::json([
                    "message" => "Failed to delete order",
                    "error" => $e->getMessage(),
                ], 500);
            }
        }
    }



    public function EditOrderById($id){



            $order=Order::findOrfail($id);

            if($order){
                $order->update([
                    'status'=>'COMPLETED'
                ]);
                return redirect()->away('http://localhost:3000/home/OrderForUser');
            }



        return Response::json([
            "message" => "Failed to pay order",
        ], 500);

    }

}
