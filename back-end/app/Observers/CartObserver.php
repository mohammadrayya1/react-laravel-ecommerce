<?php

namespace App\Observers;

use App\Models\Cart;
use Illuminate\Support\Str;

class CartObserver
{
    public function creating(Cart $cart)
    {

        $cart->id=Str::uuid();
        $cart->cookie_id=Cart::getCookie_id();
    }
}
