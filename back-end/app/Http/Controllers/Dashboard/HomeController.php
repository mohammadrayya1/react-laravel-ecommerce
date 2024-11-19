<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class HomeController extends Controller
{
  public  function index(){
      return Response::json(['message'=>"Hello to the Dashboard"]);
  }
}
