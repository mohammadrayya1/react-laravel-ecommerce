<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\Rule;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'status', 'category_id', 'description', 'imag'
    ];


    protected $connection = "mysql";
    protected $table = "categories";
    protected $primaryKey = "id";
    public $incrementing = true;

    public function products()
    {
        return $this->hasMany(Product::class, "category_id", 'id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::Class, "category_id")->withDefault(['name' => '--']);
    }

    public function childern()
    {
        return $this->hasMany(Category::class, "category_id", "id");
    }

    public static function rules($id = null)
    {


        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($id)],
            'status' => ['required', 'in:active,inactive'],
            'category_id' => ['nullable', Rule::exists('categories', 'id')->whereNull('deleted_at')],
            'description' => ['nullable', 'string'],
        //    'imag' => ['nullable', 'image', 'max:255'],
            ];

    }




}
