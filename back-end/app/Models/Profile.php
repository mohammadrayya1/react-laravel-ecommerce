<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class Profile extends Model
{
    use HasFactory;


    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'birthday',
        'gender',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'phone'
    ];


    protected $primaryKey='user_id';
    protected  $table="profile";

    public function user(){
        return $this->belongsTo(User::class,'user_id','id');
    }



    public static function rules($id = null){
        $rules = [
            'username' => 'required|string',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($id)],
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'birthday' => 'required|date',
            'gender' => 'required|nullable|in:male,female',
            'address' => 'required|string',
            'city' => 'required|nullable|string',
            'state' => 'nullable|string',
            'postal_code' => 'nullable|string|max:10',
            'country' => 'required|nullable|string|max:2',
            'phone'=>'required|nullable|string|max:20|min:11'
        ];

                if (!$id) {
            $rules['password'] = ['required', 'string', 'min:8'];
        }

        return $rules;
    }
}
