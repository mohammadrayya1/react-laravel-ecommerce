<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use PHPUnit\Event\Code\Throwable;
use function Psy\debug;

class CheckoutController extends Controller
{








    public function store(Request $request)
    {

        DB::beginTransaction();
        try {

            $order = Order::create([

                'user_id' => Auth::guard('user')->user()->id,
                'username' => $request->username,
                "email"=>$request->email,
                "phone"=>$request->phone,
                "address"=>$request->address,
                "city"=>$request->city,
                "postal_code"=>$request->postal_code,
                "total"=> $request->total,


            ]);
            $carts=$this->cart();
            Log::error("The carts is ".$carts);
            foreach ( $carts as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'price' => $item['price_per_item'],
                    'quantity' => $item['quantity'],
                    'total'=>$item['total_price']
                ]);
            }
            $user = Auth::guard('user')->user();
            $cartItems = Cart::with('product')->where('user_id', $user->id)->get();

            $cartItems->each(function ($item) {
                $item->delete();
            });

            DB::commit();
//            event(new OrderCreated($order));
//            return Redirect::route('home');
        } catch (Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }


    protected function cart() {
        $user = Auth::guard('user')->user();
        $cartItems = Cart::with('product')->where('user_id', $user->id)->get();


        $cartItems = $cartItems->map(function ($item) {
            $totalPrice = $item->quantity * $item->product->price;
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->product_name,
                'product_image' => $item->product->product_image, // تأكد من وجود هذه الخاصية في جدول المنتجات
                'quantity' => $item->quantity,
                'price_per_item' => $item->product->price,
                'total_price' => $totalPrice,
            ];
        });

        // حساب الإجمالي الكلي للسلة
        $total = $cartItems->sum('total_price');

        return $cartItems;
    }
}
