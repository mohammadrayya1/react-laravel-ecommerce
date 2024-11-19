<?php

use App\Http\Controllers\Api\Dashboard\ProductImageController;
use App\Http\Controllers\Api\Dashboard\ProductsControler;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UsersContoller;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Front\CartController;
use App\Http\Controllers\Front\CheckoutController;
use App\Http\Controllers\Front\OrderController;
use App\Http\Controllers\Front\PaypalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Dashboard\CategoriesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//
//Route::middleware('guest:sanctum')->post('/login', function (Request $request) {
//    return $request->user();
//});
//
Route::get('/',function (Request $request){
    return $request->user();
})->middleware('auth:admin');

Route::post('admin/login', [AuthController::class, 'loginAdmin']);
Route::post('user/login', [AuthController::class, 'loginUser']);
Route::post('user/register', [AuthController::class, 'register']);
Route::get('/dashboard',[\App\Http\Controllers\Dashboard\HomeController::class,"index"]);
Route::get('/products',[ProductsControler::class,'index']);
Route::get('/product/{id}',[ProductsControler::class,'show']);


// Protected Routes for Admin
Route::middleware('auth:admin')->group(function () {
    Route::post('/logoutAdmin', [AuthController::class, 'logoutAdmin']);
    Route::get('/users', [UsersContoller::class, 'GetUsers']);
    Route::post('/authAdmin', [UsersContoller::class, 'AuthAdmin']);
    Route::get('/user/{id}', [UsersContoller::class, 'getUser']);
    Route::get('/userProfile/{id}', [ProfileController::class, 'getProfileById']);
    Route::put('/user/edit/{id}', [UsersContoller::class, 'editUser']);
    Route::delete('/user/delete/{id}', [UsersContoller::class, 'destroy']);
    Route::put('/profile/edit/{id}',[ProfileController::class,"updateProfileById"]);

});

//protected linke for Categories
Route::middleware(['auth:admin','forceJson'])->group(function () {

    Route::get('/admin/categories',[CategoriesController::class,'index']);
    Route::post('/admin/addcategory',[CategoriesController::class,'store']);
    Route::get('/admin/category/{id}',[CategoriesController::class,'getcategoryById']);
    Route::post('/admin/categoryEdit/{id}',[CategoriesController::class,'updateCategoryById']);
    Route::Delete('/admin/categories/delete/{id}',[CategoriesController::class,'destroy']);


});

//protected linke for orders
Route::middleware(['auth:admin'])->group(function () {

    Route::get('admin/orders',[OrderController::class, 'getAllOreders']);

    Route::get('admin/orders-items/{id}',[OrderController::class, 'getOrderItemsByOrderId']);
    Route::Delete('admin/delete-order/{id}',[OrderController::class, 'destroy']);

});
//protected linke for products
Route::middleware('auth:admin')->group(function () {

    Route::get('/admin/products',[ProductsControler::class,'index']);
    Route::post('/admin/products/add',[ProductsControler::class,'store']);
    Route::get('/admin/product/{id}',[ProductsControler::class,'show']);
    Route::post('/admin/products/edit/{id}',[ProductsControler::class,'edit']);
    Route::delete('/admin/products/delete/{id}',[ProductsControler::class,'destroy']);
});
Route::middleware('auth:admin')->controller(ProductImageController::class)->group(function () {
    Route::post('/product-img/add', 'store');
    Route::delete('admin/product-foto-delete/{id}', 'destroy');
});
// Protected Routes for User
Route::middleware('auth:user')->group(function () {

    Route::post('/logoutUser', [AuthController::class, 'logoutUser']);
    Route::post('/loginUser', [UsersContoller::class, 'AuthUser']);
    Route::get('/user-info/{id}', [UsersContoller::class, 'getUser']);
    Route::post('/add-cart/{id}',[CartController::class,'store']);
    Route::get('/show-cart',[CartController::class,'show']);
    Route::get('/show-cart-count',[CartController::class,'count']);
    Route::Delete('/delete-cart/{id}',[CartController::class,'destroy']);
    Route::post('/update-cart/{id}',[CartController::class,'update']);
    Route::get('/Checkout',[ProfileController::class, 'getProfileForCheckout']);
    Route::post('/Checkout-create',[CheckoutController::class, 'store']);
    Route::get('/OrderItemsforuser/{id}',[OrderController::class, 'getOrderItemsByUserID']);
    Route::get('/Orderforuser',[OrderController::class, 'getOrderByUserID']);

    Route::Delete('delete-order-foruser/{id}',[OrderController::class, 'destroyByUser']);
    Route::Delete('delete-order-item/{itemId}/{orderId}',[OrderController::class, 'destroyorderitem']);

    Route::post("kaufen/{id}",[PaypalController::class,'kauf']);

});


Route::get("paypal/success/{order_id}/",[PaypalController::class,'success'])->name('paypal_success');
Route::get("paypal/cancel",[PaypalController::class,'cancel'])->name('paypal_cancel');
Route::get('/Order-edit/{id}',[OrderController::class, 'EditOrderById'])->name('paypal_complete');
