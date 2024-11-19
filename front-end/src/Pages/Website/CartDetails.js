import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { baseUrl, imageurl } from "../../Api/Api.js";
import { GlobalVarContext } from "./Context/Context.js";
import { configgetUser } from "../Dashboard/Library/library.js";
import { NavLink } from "react-router-dom";
export default function CartDetails() {
  const [cartItems, setCartItems] = useState([]);
  const [total, settotal] = useState(0);
  const [loadingadd, setLoadingadd] = useState(false);
  const [loadingExpire, setloadingExpire] = useState(false);
  const [refresh, setrefresh] = useState(true);

  const cartcount = useContext(GlobalVarContext);
  useEffect(() => {
    const cookiesuser = Cookie();
    const token = cookiesuser.get("user-token");

    async function fetchCartItems() {
      console.log(token);
      if (token) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/show-cart`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setCartItems(response.data.cart);
          settotal(response.data.total);
        } catch (error) {
          setloadingExpire(true);
          console.error("Failed to fetch cart items:", error);
          setTimeout(() => {
            setloadingExpire(false);
          }, 3000);
          //    window.location.pathname = "/home/loginUser";
        }
      } else {
        setLoadingadd(true);

        setTimeout(() => {
          setLoadingadd(false);
        }, 3000);
      }
    }
    fetchCartItems();
  }, [refresh]);

  const updateQuantity = async (id, newQuantity) => {
    try {
      const response = await axios.post(
        `${baseUrl}/update-cart/${id}`,

        {
          quantity: newQuantity,
        },
        configgetUser
      );
      if (response.status === 200) {
        const updatedItems = cartItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        setCartItems(updatedItems);
        setrefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/delete-cart/${id}`,
        configgetUser
      );
      if (response.status === 200) {
        // Filter out the removed item from the cart
        const remainingItems = cartItems.filter((item) => item.id !== id);
        setCartItems(remainingItems);
        setrefresh((prev) => !prev);
        cartcount.setGlobalVar((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };
  const incrementQuantity = (id, currentQuantity) => {
    updateQuantity(id, currentQuantity + 1);
    setrefresh((prev) => !prev);
  };

  const decrementQuantity = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
      setrefresh((prev) => !prev);
    }
  };

  return (
    <div className="breadcrumbs">
      <div className="shopping-cart section">
        <div className="container">
          <div className="row mb-2">
            <div className="col-lg-2 col-md-2 col-12">
              <strong>Image</strong>
            </div>
            <div className="col-lg-2 col-md-2 col-12">
              <strong>Product</strong>
            </div>
            <div className="col-lg-2 col-md-2 col-12 ">
              <strong>Price</strong>
            </div>
            <div className="col-lg-2 col-md-1 col-12 me-4 px-5 ">
              <strong className="align-items-center">Quantity</strong>
            </div>
            <div className="col-lg-1 col-md-2 col-12">
              <strong>Total Price</strong>
            </div>
            <div className="col-lg-1 col-md-2 col-12"></div>
          </div>

          {cartItems.length > 0 ? (
            <div className="cart-list-head">
              {cartItems.map((item) => (
                <div className="cart-single-list mb-2" key={item.id}>
                  <div className="row align-items-center">
                    <div className="col-lg-2 col-md-2 col-12">
                      <img
                        src={
                          item.product_image
                            ? `${imageurl}/${item.product_image}`
                            : require("../../assets/images/comingSoon.png")
                        }
                        alt="Product"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>
                    <div className="col-lg-2 col-md-3 col-12 mb-2">
                      <h5 className="product-name">{item.product_name}</h5>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12 mb-2">
                      <h5 className="product-price">
                        ${item.price_per_item.toFixed(2)}
                      </h5>
                    </div>
                    <div className="col-lg-2 col-md-1 col-12">
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            decrementQuantity(item.id, item.quantity)
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            incrementQuantity(item.id, item.quantity)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12">
                      <h5 className="total-price px-4">
                        ${(item.quantity * item.price_per_item).toFixed(2)}
                      </h5>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12">
                      <a
                        className="remove-item btn btn-danger"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove <i className="lni lni-close"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}

          <div className="row">
            <div className="col-12">
              <div className="total-amount">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="left">
                      {cartItems.length > 0 && (
                        <p className="btn btn-primary"> Total : {total} $</p>
                      )}
                      <div className="button">
                        <NavLink to={`../checkout`} className="btn mb-2 mt-5">
                          Checkout
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
