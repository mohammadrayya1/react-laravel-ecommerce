import { NavLink } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import {
  Loading,
  configgetUser,
  useNavigate,
} from "../Dashboard/Library/library.js";
import Cookie from "cookie-universal";
import axios from "axios";

import { LOGOUTUSER, baseUrl, COUNTCART } from "../../Api/Api.js";
import { GlobalVarContext } from "./Context/Context.js";
import LoadingTokenExpire from "../../components/Loading/LoadingTokenExpire";
import LoadingLogout from "../../components/Loading/LoadingLogout";

export default function Header() {
  const cartcount = useContext(GlobalVarContext);
  const [countCart, SetcoutCart] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [refresh, setrefresh] = useState(true);
  const [loading, Setloading] = useState(false);
  useEffect(() => {
    const cookiesuser = Cookie();
    const getToken = Cookie();
    const user = cookiesuser.get("username");
    if (user) {
      setUsername(user);
      setIsLoggedIn(true);
    }
    getCountCart();
  }, [refresh]);

  async function getCountCart() {
    const cookiesuser = Cookie();
    const cookieslogout = Cookie();
    const token = cookiesuser.get("user-token");
    if (token) {
      try {
        const response = await axios.get(
          `${baseUrl}/${COUNTCART}`,
          configgetUser
        );
        console.log(response);
        cartcount.setGlobalVar(response.data.cartAcount);
      } catch (error) {
        if (error.response.status === 422) {
          if (cookieslogout.remove("username")) {
            console.log("go out");
          }

          cookieslogout.remove("user-token");

          cookieslogout.remove("user_id");
          // window.location.pathname = "/home";
        }
      }
    }
  }
  const handleLogout = async () => {
    Setloading(true);
    const cookieslogout = Cookie();

    const cookiesuser = Cookie();
    const token = cookiesuser.get("user-token");

    try {
      const res = await axios.post(
        `${baseUrl}/${LOGOUTUSER}`,
        JSON.stringify(token),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
        Setloading(false);
        cookieslogout.remove("user-token");
        cookieslogout.remove("username");
        cookieslogout.remove("user_id");

        setTimeout(function () {
          window.location.pathname = "/home";
        }, 2000);
        setrefresh((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 422) {
        Setloading(false);
        cookieslogout.remove("user-token");
        cookieslogout.remove("username");
        cookieslogout.remove("user_id");
        window.location.pathname = "/home";
        setrefresh((prev) => !prev);

        Setloading(false);
      }
      setIsLoggedIn(false);
    }
  };
  return (
    <>
      {loading && <LoadingLogout />}
      <header class="header navbar-area">
        <div class="topbar">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-4 col-md-4 col-12">
                <div class="top-left"></div>
              </div>
              <div class="col-lg-4 col-md-4 col-12">
                <div class="top-middle">
                  <ul class="useful-links">
                    <li>
                      <NavLink to={"../home"}>Home</NavLink>
                    </li>

                    <li>
                      <a href="about-us.html">About Us</a>
                    </li>
                    <li>
                      <a href="contact.html">Contact Us</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-4 col-md-4 col-12">
                <div class="top-end">
                  {isLoggedIn ? (
                    <>
                      <div className="user">Hello, {username}</div>
                      <ul className="user-login">
                        <li>
                          <button
                            onClick={handleLogout}
                            className="btn btn-primary"
                          >
                            Log Out
                          </button>
                        </li>
                        <li>
                          <NavLink
                            to={`./OrderForUser`}
                            className="btn btn-success"
                          >
                            {" "}
                            My Order
                          </NavLink>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <ul className="user-login">
                      <li>
                        <NavLink to="loginUser">Sign In</NavLink>
                      </li>
                      <li>
                        <NavLink to="register">Register</NavLink>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="header-middle">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-3 col-md-3 col-7">
                <NavLink to={"/home"}>
                  <img
                    src={require("../../assets/images/logo/logo.png")}
                    alt="Logo"
                    style={{ width: "200px", height: "41px" }}
                  />
                </NavLink>
              </div>
              <div class="col-lg-5 col-md-7 d-xs-none">
                <div class="main-menu-search">
                  <div class="navbar-search search-style-5">
                    <div class="search-select">
                      <div class="select-position">
                        <select id="select1">
                          <option selected>All</option>
                          <option value="1">option 01</option>
                          <option value="2">option 02</option>
                          <option value="3">option 03</option>
                          <option value="4">option 04</option>
                          <option value="5">option 05</option>
                        </select>
                      </div>
                    </div>
                    <div class="search-input">
                      <input type="text" placeholder="Search" />
                    </div>
                    <div class="search-btn">
                      <button>
                        <i class="lni lni-search-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-2 col-5">
                <div class="middle-right-area">
                  <div class="nav-hotline">
                    <i class="lni lni-phone"></i>
                    <h3>
                      Hotline:
                      <span>(+100) 123 456 7890</span>
                    </h3>
                  </div>
                  <div class="navbar-cart">
                    <div class="wishlist">
                      <a href="#">
                        <i class="lni lni-heart"></i>
                        <span class="total-items">0</span>
                      </a>
                    </div>
                    <div class="cart-items">
                      <NavLink
                        className="main-btn"
                        to={"./cartDetails"}
                        style={{
                          height: "40px",
                          width: "40px",
                          lineHeight: "40px",
                          display: "inline-block",
                          borderRadius: "50%",
                          border: "1px solid #eee",
                          color: "#555",
                          fontSize: "18px",
                          textAlign: "center",
                          position: "relative",
                        }}
                      >
                        <i class="lni lni-cart"></i>
                        <span class="total-items">
                          {cartcount.globalVar ? cartcount.globalVar : 0}
                        </span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
