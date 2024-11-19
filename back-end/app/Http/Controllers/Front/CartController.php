<?php

namespace App\Http\Controllers\Front;


use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Repositories\Cart\CartModelRepository;
use App\Repositories\Cart\CartRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Response;

class CartController extends Controller
{
    protected $cart;


    public function __construct(CartRepository $cart)
    {
        $this->cart=$cart;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {


        return Response::json([
            'cart'=>$this->cart->get()
        ]);

    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id'=>['required','int','exists:products,id'],
            'quantity'=>['nullable','int','min:1']
        ]);

        $product=Product::findOrFail($request->product_id);
        $user = Auth::guard('user')->hasUser();
        Log::debug("line 25 info from controller ". $user);

      $result=  $this->cart->add($product->id,$request->quantity);

      return $result;

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */


    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity'=>['required','int','min:1']
        ]);

      $newupdatecart=  $this->cart->update($id,$request->quantity);

        return Response::json([
           "cart"=>$newupdatecart
        ]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $this->cart->delete($id);


    }

//    public function show(){
//        $user = Auth::guard('user')->user();
//        $cart=Cart::with('product')->where('user_id',$user->id)->get();
//        $total= $cart->sum(function ($item) {
//            return $item->quantity * $item->product->price; // حساب الإجمالي
//        });
//
//        return Response::json([
//            'cart'=>$cart,
//            'total'=>$total
//        ]);
//
//    }

    public function show() {
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

        return response()->json([
            'cart' => $cartItems,
            'total' => $total
        ]);
    }

    public function count(){
        $user = Auth::guard('user')->user();
        $cartCount = Cart::where('user_id', $user->id)->count();

        return Response::json([
            'cartAcount'=>$cartCount
        ]);
    }

}
