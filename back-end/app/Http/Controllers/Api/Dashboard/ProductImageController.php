<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{

    public function store(Request $request)
    {
        $product = new ProductImage();
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = date('YmdHis') . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs(
                'products',
                $filename,
                'uploads'
            );
        }

        $product->product_id = $request->product_id;
        $product->save();
        return $product;
    }

    public function destroy($id)
    {
        $productimage=ProductImage::findOrFail($id);
        $url=$productimage->image;
        if($productimage->delete()){
            if ($url) {
                Storage::disk('uploads')->delete($url);
            }
            return Response::json([
                "message"=>"image of Ptoduct  is deleted Successfully"
            ],200);
        }
        return Response::json([
            "message"=>"image of Ptoduct  is faild to  delete"
        ],400);;

    }
}
