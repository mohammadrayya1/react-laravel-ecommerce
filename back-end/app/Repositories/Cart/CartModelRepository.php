<?php

namespace App\Repositories\Cart;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class CartModelRepository implements CartRepository
{

    protected $items;

    public function __construct()
    {
        $this->items=collect([]);
    }

    public function get():Collection
    {
        if(!$this->items->count()){
            $this->items= Cart::with('product')->get();
        }
        return $this->items;
    }

    public function add($id, $quantity = 1)
    {

        $user = Auth::guard('user')->user();
        Log::info("line 25 info ". $user->id);
        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }
        $item = Cart::where('product_id', $id)->first();

        if (!$item) {

            $cart= Cart::create([
                    "user_id" =>$user->id,
                    'product_id' => $id,
                    'quantity' => $quantity
                ]);
            Log::info("new cart ". $cart);
                $this->get()->push($cart);

                return $cart;
            }
        $item->increment('quantity', $quantity);
            return $item;
        }



    public function update($id,$quantity){

        Cart::where('id','=',$id)
            ->update(['quantity'=>$quantity]);

    }
    public function delete($id){

        Cart::where('id','=',$id)
            ->delete();

    }
    public function empty(){
        Cart::query()->delete();
    }
    public function total():float{
       /* return Cart::join("products",'products.id','=','carts.product_id')
            ->selectRaw('sum(products.price * carts.quantity) as total')
            ->value('total');//return just value not column
       */

       return  $this->get()->sum(function ($items){
            return  $items->quantity* $items->product->price;
        });
    }




}
