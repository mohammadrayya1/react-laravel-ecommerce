<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;


class Product extends Model
{

    use HasFactory,SoftDeletes;
    protected $connection="mysql";
    protected $table="products";
    protected $primaryKey="id";
    public $incrementing =true;


    protected $fillable=[
        'product_name','slug','status','category_id','description','stock',
        "product_image",'price','category_id'
    ];

    public  function category(){
        return $this->belongsTo(Category::class,"category_id",'id');
    }

    public function Images(){
        return $this->hasMany(ProductImage::class);
    }

    public static function rules($id = null)
    {
        return [
            'product_name' => ['required', 'string', 'max:255', Rule::unique('products', 'product_name')->ignore($id)],
            'status' => ['required', 'in:active,draft,archvied'],
            'category_id' => ['nullable', Rule::exists('categories', 'id')->whereNull('deleted_at')],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric'],
            'stock' => ['required', 'integer'],
            'product_image' => ['nullable', 'sometimes', 'max:2048'],
            'product_images' => [

                function ($attribute, $value, $fail) {
                    $isNull = is_null($value) ? 'true' : 'false';

                    if (is_null($value)) {
                        return;
                    }
                    if (!is_array($value)) {
                        $fail('The ' . $attribute . ' must be an kkkkarray.');
                    }
                },
            ],
        ];
    }





}
