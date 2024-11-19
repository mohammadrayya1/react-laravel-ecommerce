<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
class CategoriesController extends Controller
{


    public function index() {

        $categories = Category::with('parent')->get();

        return response()->json([
            'categories' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'status' => $category->status,
                    'description' => $category->description,
                    'imagePath' => asset($category->imag)? asset($category->imag) : null,
                    'parent' => [
                        'id' => $category->parent ? $category->parent->id : null,
                        'name' => $category->parent ? $category->parent->name : null

                    ]
                ];
            })
        ]);
    }



    public function getcategoryById($id){
        return Response::json([
            "category"=>Category::findOrFail($id)
        ]);
    }

    public function store(CategoryRequest $request){
        $request->merge(['slug'=>Str::slug($request->name)]);
        $data=$request->except('imag');
        $data['imag']=$this->uploadImage($request);


        DB::beginTransaction();
        try {

            $category = Category::create($data);
            DB::commit();
            return Response::json(['category' => $category]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }


    public function updateCategoryById(CategoryRequest $request,$id){



        $request->merge(['slug'=>Str::slug($request->name)]);
        $data=$request->except('imag');


        $new_image=$this->uploadImage($request);
        if ($new_image){
            $data['imag']=$new_image;
        }

        $category= Category::find($id);
        $old_image=$category->imag;
        $category->update($data);
        $category->save();
        if ($old_image && $new_image){
            Storage::disk('uploads')->delete($old_image);
        }
        return Response::json([
            "category"=>Category::findOrFail($id)
        ]);
    }
    public function destroy($id)
    {
        $category=Category::findOrFail($id);
        $url=$category->imag;
        if($category->delete()){
            if ($url) {

                Storage::disk('uploads')->delete($url);
            }


            return Response::json([
                "message"=>"Category is deleted Successfully"
            ],200);
        }
         return Response::json([
            "message"=>"Category is faild to  delete"
            ],400);;
        }


    protected function uploadImage(Request $request) {
        if ($request->hasFile('imag')) {
            $file = $request->file('imag');
            if ($file->isValid()) {

                $filename = date('YmdHis') . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs(
                    'categories',
                    $filename,
                    'uploads'
                );

                return $path;
            }
        }
        return null;
    }


}


