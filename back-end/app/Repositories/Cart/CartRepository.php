<?php

namespace App\Repositories\Cart;

use App\Models\Product;
use Illuminate\Support\Collection;

interface CartRepository
{

    public function get(): Collection;
    public function add($product_id,$quantity  = 1 );
    public function update($id,$quantity);
    public function delete($id);
    public function empty();
    public function total():float;

}
