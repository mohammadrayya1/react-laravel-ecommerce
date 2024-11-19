import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Website/Home.js";
import LoginUser from "./Pages/Auth/LoginUser";
import LoginAdmin from "./Pages/Auth/LoginAdmin";
import Register from "./Pages/Auth/RegisterUser";
import User from "./Pages/Dashboard/User.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./assets/css/glightbox.min.css";
import "./assets/css/LineIcons.3.0.css";
import "./assets/css/main.css";
import "./plugins/fontawesome-free/css/all.min.css";
import Dashboard from "./Pages/Dashboard/Dashboard.js";
import Authrequired from "./Pages/Auth/Authrequired.js";
import UserProfile from "./Pages/Dashboard/UserProfile";
import AddProducts from "./Pages/Dashboard/Products/AddProducts.js";
import Product from "./Pages/Dashboard/Products/Products.js";
import Category from "./Pages/Dashboard/Categories/Categories.js";
import Order from "./Pages/Dashboard/Order/Orders.js";
import CreateCategory from "./Pages/Dashboard/Categories/CreateCategory.js";
import EditCategory from "./Pages/Dashboard/Categories/EditCategory.js";
import ProductDetails from "./Pages/Dashboard/Products/ProductDetails.js";
import FrontProductDetails from "./Pages/Website/ProductsDetails.js";
import EditProduct from "./Pages/Dashboard/Products/EditProduct.js";
import ProductTrendeing from "./Pages/Website/ProductTrendeing.js";
import CartDetails from "./Pages/Website/CartDetails.js";
import Checkout from "./Pages/Website/CheckOut.js";
import OrderForUser from "./Pages/Website/OrderForUser.js";
import OrderItems from "./Pages/Dashboard/Order/OrderItems.js";
import OrderItemsForUser from "./Pages/Website/OrderItemsForUser.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="loginAdmin" element={<LoginAdmin />}></Route>
        {/* public Route */}

        <Route path="/home" element={<HomePage />}>
          <Route path="checkout" element={<Checkout />}></Route>
          <Route path="OrderForUser" element={<OrderForUser />}></Route>
          <Route path="orderItems/:id" element={<OrderItemsForUser />}></Route>
          <Route path="register" element={<Register />}></Route>
          <Route path="loginUser" element={<LoginUser />}></Route>
          <Route index element={<ProductTrendeing />}></Route>
          <Route path="cartDetails" element={<CartDetails />}></Route>
          <Route
            path="detailsproduct/:id"
            element={<FrontProductDetails />}
          ></Route>
        </Route>
        {/* protected Route */}
        <Route element={<Authrequired />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index path="users" element={<User />}></Route>
            <Route path="categories" element={<Category />}></Route>
            <Route path="Add-category" element={<CreateCategory />}></Route>
            <Route path="editCategory/:id" element={<EditCategory />}></Route>
            <Route path="orderItems/:id" element={<OrderItems />}></Route>
            <Route path="products" element={<Product />}></Route>
            <Route path="product-edit/:id" element={<EditProduct />}></Route>
            <Route path="productsDetails" element={<ProductDetails />}></Route>
            <Route path="Add-products" element={<AddProducts />}></Route>
            <Route path="userProfile/:id" element={<UserProfile />}></Route>
            <Route path="orders" element={<Order />}></Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
