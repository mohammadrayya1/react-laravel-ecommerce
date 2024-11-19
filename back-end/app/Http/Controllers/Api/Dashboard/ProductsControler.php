<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductsControler extends Controller
{

    public function index(){

        $products= Product::with(['category', 'images'])->get();

        return Response::json([
            "products"=>$products
        ]);
    }

    public function show($id){
        if ($product = Product::findOrFail($id)->makeHidden(['created_at', 'deleted_at',"slug",'updated_at'])){
            return Response::json([
                "product"=>$product,
                "products_images"=>$product->Images()->get(),
                "category"=>$product->category
            ],200);
        }
        return null;
    }
    public function edit(ProductRequest $request,$id){
        try {
            $request->merge(['slug'=>Str::slug($request->product_name)]);

            $data=$request->except('product_image');
            $data=$request->except('product_images');
            $data['product_image']=$this->uploadImage($request);


            DB::beginTransaction();
            try {

                if($product= Product::findOrFail($id)){
                    $this->uploadMultiImages($request,$product->id);
                    $product->update($data);
                    $product->save();
                };

                DB::commit();
                return Response::json(['products' => $product]);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }catch (\Exception $e){
            return Response::json([
                ["message"=>$e->getMessage(),"success"=>false],422
            ]);
    }}
    public function store(ProductRequest $request){
        try {
            $request->merge(['slug'=>Str::slug($request->product_name)]);

            $data=$request->except('product_image');
            $data=$request->except('product_images');
            $data['product_image']=$this->uploadImage($request);


            DB::beginTransaction();
            try {

                if($product= Product::create($data)){
                    $this->uploadMultiImages($request,$product->id);
                };

                DB::commit();
                return Response::json(['products' => $product]);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }catch (\Exception $e){
                return Response::json([
                    ["message"=>$e->getMessage(),"success"=>false],422
                ]);
        }


    }
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $product = Product::findOrFail($id);
            $imagesToDelete = [];
            if ($product->Images()->exists()) {
                foreach ($product->Images as $image) {
                    $imagesToDelete[] = $image->image;
                }
            }

            if ($product->product_image) {
                $imagesToDelete[] = $product->product_image;
            }

            if ($product->delete()) {

                foreach ($imagesToDelete as $path) {
                    Storage::disk('uploads')->delete($path);
                }
                DB::commit();
                return response()->json([
                    "message" => "Product and all related images are deleted successfully."
                ], 200);
            }

        }catch(\Exception $e){
            DB::rollBack();
            return Response::json([
                ["message"=>$e->getMessage(),"success"=>false],422
            ]);

    }


    }

    protected function uploadImage(Request $request){

        if (!$request->hasFile('product_image')) {
            return $request->get('product_image');
        }
        $file = $request->file('product_image');
        if ($file && $file->isValid()) {
            $filename = date('YmdHis') . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs(
                'products',
                $filename,
                'uploads'
            );

            return $path;
        }
        return null;
    }

    protected function uploadMultiImages(Request $request ,$id) {

        if (!$request->hasFile('product_images')) {
            return null;
        }
        $files = $request->file('product_images');
        if (!is_array($files)) {

            if ($files->isValid()) {
                $filename = date('YmdHis') . '.' . $files->getClientOriginalExtension();
                $path = $files->storeAs(
                    'products',
                    $filename,
                    'uploads'
                );
             ProductImage::create([
                 'product_id'=>$id,
                 'image'=>$path
             ]);
            }
        } else {

            foreach ($files as $file) {
                if ($file->isValid()) {
                    $filename = date('YmdHis') .$file->getFilename(). '.'. $file->getClientOriginalExtension();
                    $path = $file->storeAs(
                        'products',
                        $filename,
                        'uploads'
                    );
                    ProductImage::create([
                        'product_id'=>$id,
                        'image'=>$path
                    ]);

                }
            }
        }

        return true; // إرجاع قائمة المسارات
    }

}
