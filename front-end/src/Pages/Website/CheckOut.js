import { useState, useEffect } from "react";
import axios from "axios";
import React, { useRef } from "react";
import { baseUrl, CHECKOUTCREATE, EDITPROFILEa } from "../../Api/Api";
import "../Auth/Auth.css";
import Loading from "../../components/Loading/Loading";
import { useParams } from "react-router-dom";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const formRef = useRef(null);
  const [totalBig, settotal] = useState(0);
  const { id } = useParams();
  const [ref, setref] = useState(true);
  const navigate = useNavigate();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorRegister, setErrorRegister] = useState();
  const [errorUpdate, setErrorUpdate] = useState();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    birthday: "",
    last_name: "",
    first_name: "",
    gender: "",
    address: "",
    state: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
    total: totalBig + 5,
  });
  const cookie = Cookie();
  const token = cookie.get("user-token");

  const configget = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const userId = id;
    setForm((prevForm) => ({
      ...prevForm,
      total: totalBig + 5,
    }));
    fetchUserData(userId);
  }, [totalBig]);

  // async function fetchCartItems() {
  //   const cookiesuser = Cookie();
  //   const token = cookiesuser.get("user-token");

  //   if (token) {
  //     try {
  //       const response = await axios.get(
  //         `http://127.0.0.1:8000/api/show-cart`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       settotal(response.data.total);

  //       console.log(totalBig);
  //       // setref((prev) => !prev);
  //     } catch (error) {
  //       //    window.location.pathname = "/home/loginUser";
  //     }
  //   }
  // }
  // Function to fetch user data
  async function fetchUserData() {
    const cookiesuser = Cookie();
    const token = cookiesuser.get("user-token");

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/Checkout`, configget);
      const response1 = await axios.get(`http://127.0.0.1:8000/api/show-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response1.status === 200) {
        settotal(response1.data.total);
      }
      if (response.status === 200) {
        const profileData =
          response.data.profile.length > 0 ? response.data.profile[0] : "";
        console.log(response.data.profile);
        const userData = response.data.user;
        const formData = {
          address: profileData.address ? profileData.address : "",
          birthday: profileData.birthday ? profileData.birthday : "",
          city: profileData.city ? profileData.city : "",
          country: profileData.country ? profileData.country.toUpperCase() : "",
          email: userData.email,
          first_name: profileData.first_name ? profileData.first_name : "",
          gender: profileData.gender ? profileData.gender : "",
          last_name: profileData.last_name ? profileData.last_name : "",
          postal_code: profileData.postal_code ? profileData.postal_code : "",
          state: profileData.state ? profileData.state : "",
          username: userData.name,
          phone: profileData.phone,
          total: totalBig + 5,
        };

        setForm(formData);
        console.log(totalBig);

        setDisable(false); // Enable form inputs after data is fetched
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorRegister("Failed to load user data");
    }
    setLoading(false);
  }
  //fetchCartItems();
  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    try {
      const result = await axios.post(
        `${baseUrl}/${CHECKOUTCREATE}`,
        JSON.stringify(form),
        configget
      );
      if (result.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      setLoading(false);
      setErrorUpdate(error.response.data.errors);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <section class="checkout-wrapper section">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div class="checkout-steps-form-style-1">
                  <ul id="accordionExample">
                    <li>
                      <h6
                        class="title"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="true"
                        aria-controls="collapseThree"
                      >
                        Your Personal Details{" "}
                      </h6>
                      <section
                        class="checkout-steps-form-content collapse show"
                        id="collapseThree"
                        aria-labelledby="headingThree"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="row mt-2">
                          <div class="col-md-12">
                            <div class="single-form form-default">
                              <label>User Name</label>
                              <div class="row">
                                <div class="col-md-6 form-input form">
                                  <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={form.username}
                                    className="form-control"
                                  />
                                </div>
                                <div class="col-md-6 form-input form"></div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 mt-4">
                            <div class="single-form form-default">
                              <label>Email</label>
                              <div class="form-input form">
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={form.email}
                                  className="form-control"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 mt-4">
                            <div class="single-form form-default">
                              <label>Phone Number</label>
                              <div class="form-input form">
                                <input
                                  type="text"
                                  id="phone"
                                  name="phone"
                                  value={form.phone}
                                  className="form-control"
                                  maxLength="11"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-12 mt-4">
                            <div class="single-form form-default">
                              <label> Address</label>
                              <div class="form-input form">
                                <input
                                  type="text"
                                  id="address"
                                  name="address"
                                  value={form.address}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 mt-4">
                            <div class="single-form form-default">
                              <label>City</label>
                              <div class="form-input form">
                                <input
                                  type="text"
                                  id="city"
                                  name="city"
                                  value={form.city}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 mt-4">
                            <div class="single-form form-default">
                              <label>Post Code</label>
                              <div class="form-input form">
                                <input
                                  type="text"
                                  id="postal_code"
                                  name="postal_code"
                                  value={form.postal_code}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 mt-4">
                            <div class="single-form form-default">
                              <label>Region/State</label>
                              <div class="select-items">
                                <input
                                  type="text"
                                  id="state"
                                  name="state"
                                  value={form.state}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 mt-4">
                            <div class="single-form form-default">
                              <label>Country</label>
                              <div class="form-input form">
                                <input
                                  type="text"
                                  id="country"
                                  name="country"
                                  value={form.country}
                                  className="form-control"
                                  maxLength="2"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-12 mt-4">
                            <div class="single-checkbox checkbox-style-3"></div>
                          </div>
                          <div class="col-md-12 mt-4"></div>
                        </div>
                      </section>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
            <div class="col-lg-4">
              <div class="checkout-sidebar">
                <div class="checkout-sidebar-price-table mt-30">
                  <h5 class="title">Pricing Table</h5>

                  <div class="sub-total-price">
                    <div class="total-price shipping">
                      <p class="value">Subotal Price shipping: $5 </p>
                    </div>
                  </div>

                  <div class="total-payable">
                    <div class="payable-price">
                      <p class="value">Subotal Price:{totalBig}</p>
                      <p class="price">Subotal Price:{totalBig + 5} </p>
                    </div>
                  </div>
                  <div class="price-table-btn button">
                    <button
                      class="btn btn-alt"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
                <div class="checkout-sidebar-banner mt-30">
                  <a href="product-grids.html">
                    <img
                      src={require("../../assets/images/checkout.jpg")}
                      alt="#"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
