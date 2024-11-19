<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
class PaypalController extends Controller
{

    public function kauf(Request $request,$id){

       if(Auth::guard('user')->user()) {
           $user = Auth::guard('user')->user();
           $order = Order::where('id', $id)->where('user_id', $user->id)->firstOrFail();
           $order = Order::where('id', $id)->firstOrFail();

       }



        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken=$provider->getAccessToken();
        $order = $provider->createOrder([
            "intent"=>"CAPTURE",
            "application_context"=>[
                "return_url"=>route('paypal_success',['order_id' => $order->id]),
                "cancel_url"=>route('paypal_cancel'),
            ],
            "purchase_units"=> [
                [
                      "amount"=> [
                      "currency_code"=> "USD",
                      "value"=> $order->total,
                          ]
                    ],

           ],

        ]);

        if(isset($order['id'])&& $order['id']!=null){
            foreach ($order['links']as $link){
                if ($link['rel']==='approve'){


                    return response()->json([
                        'success' => true,
                        'message' => 'Redirect to PayPal to approve the payment.',
                        'redirect_url' => $link['href']
                    ]);
                }
            }

        }else{

            return redirect()->route("paypal_cancel");
        }


    }




    public function success(Request $request,$order_id){

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken=$provider->getAccessToken();
        $order = $provider->capturePaymentOrder($request->token);
        if($order['status']=='COMPLETED'){

            redirect()->route("paypal_cancel");
            return redirect()->route('paypal_complete', ['id' => $order_id]);
        } else {
            return redirect()->route('payment_failed');

        }

    }
}

//
//'address'=>$request->address,
//            'city'=>$request->city,
//            'email'=>$request->email,
//            "id_order"=>$request->id,
//            'postal_code'=>$request->postal_code,
//            'status'=>$request->status,
//            'user_id'=>$request->user_id,
//            'username'=>$request->username
