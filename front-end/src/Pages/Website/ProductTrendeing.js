import {
  baseUrl,
  imageurl,
  PRODUCTSHOME,
  ADDPRODUCTTOCART,
  COUNTCART,
} from "../../Api/Api.js";
import LoadingLogin from "../../components/Loading/LoadingLogin.js";
import { GlobalVarContext } from "./Context/Context.js";
import {
  Loading,
  useState,
  useEffect,
  Link,
  axios,
  configget,
  configgetUser,
} from "../Dashboard/Library/library.js";
import Cookie from "cookie-universal";
import { NavLink } from "react-router-dom";
import { useContext } from "react";

export default function ProductTrendeing() {
  const cartcount = useContext(GlobalVarContext);

  const [loading, setLoading] = useState(false);
  const [loadingadd, setLoadingadd] = useState(false);
  const [products, setProducts] = useState([]);
  const [refresh, setrefresh] = useState(true);
  const [form, setForm] = useState({
    product_id: 1,
    quantity: 1,
  });

  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/${PRODUCTSHOME}`, configget);
      if (response.data.products) {
        setLoading(false);
        console.log(response.data.products);
        setProducts(response.data.products);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  async function getCountCart() {
    const cookiesuser = Cookie();
    const token = cookiesuser.get("user-token");
    if (token) {
      try {
        const response = await axios.get(
          `${baseUrl}/${COUNTCART}`,
          configgetUser
        );
        cartcount.setGlobalVar(response.data.cartAcount);
      } catch (error) {
        console.log(error);
      }
    }
  }
  useEffect(() => {
    fetchData();
    getCountCart();
  }, [refresh]);

  const handleaddcart = async (id) => {
    const cookiesuser = Cookie();
    const token = cookiesuser.get("user-token");
    if (token) {
      setLoading(true);
      try {
        const res = await axios.post(
          `${baseUrl}/${ADDPRODUCTTOCART}/${id}`,
          {
            product_id: id,
            quantity: 1,
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setLoading(false);
        console.log(res.status);
        if (res.status === 200) {
          setrefresh((prev) => !prev);
        }
        setrefresh((prev) => !prev);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setLoadingadd(true);

      setTimeout(() => {
        setLoadingadd(false);
      }, 3000);
    }
  };
  return (
    <>
      {loading && <Loading />}
      {loadingadd && <LoadingLogin />}
      <section class="trending-product section" style={{ marginTop: "12px" }}>
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="section-title">
                <h2>Trending Product</h2>
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form.
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            {products &&
              products.map((item, index) => (
                <div class="col-lg-3 col-md-6 col-12" key={index}>
                  <div class="single-product">
                    <div class="product-image">
                      <img
                        src={
                          item.product_image
                            ? `${imageurl}/${item.product_image}`
                            : require("../../assets/images/comingSoon.png")
                        }
                        alt="#"
                      />
                      <div
                        class="button"
                        onClick={() => handleaddcart(item.id)}
                      >
                        <span class="btn">
                          <i class="lni lni-cart"></i> Add to Cart
                        </span>
                      </div>
                    </div>
                    <div class="product-info">
                      <span class="category">
                        {" "}
                        {item.category
                          ? item.category.name
                          : "Without Category"}
                      </span>
                      <h4 class="title">
                        <Link to={`detailsproduct/${item.id}`}>
                          {item.product_name}
                        </Link>
                      </h4>
                      <ul class="review">
                        <li>
                          <i class="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i class="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i class="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i class="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i class="lni lni-star"></i>
                        </li>
                        <li>
                          <span>4.0 Review(s)</span>
                        </li>
                      </ul>
                      <div class="price">
                        <span> price:{item.price}$</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
