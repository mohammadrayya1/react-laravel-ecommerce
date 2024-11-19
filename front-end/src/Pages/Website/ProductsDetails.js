import {
  Loading,
  useState,
  useEffect,
  axios,
  configget,
  useParams,
} from "../Dashboard/Library/library.js";
import {
  baseUrl,
  imageurl,
  ADDPRODUCTTOCART,
  PRODUCTBYID,
} from "../../Api/Api.js";
import LoadingLogin from "../../components/Loading/LoadingLogin.js";
import "./home.css";
import Cookie from "cookie-universal";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { GlobalVarContext } from "./Context/Context.js";

export default function ProductsDetails() {
  const cartcount = useContext(GlobalVarContext);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadingadd, setLoadingadd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ProductForm, setProductForm] = useState({});
  const [ProductFormImages, setProductFormImages] = useState("");
  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      const ProductId = id;
      try {
        setLoading(true);

        const productById = await axios.get(
          `${baseUrl}/${PRODUCTBYID}/${ProductId}`,
          configget
        );

        if (productById) {
          console.log(productById.data.product);
          console.log(productById.data.products_images);

          setProductForm(productById.data.product);
          setProductFormImages(productById.data.products_images);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
        if (res.status === 200) {
          console.log(res.data);
        }
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
      <section class="item-details section">
        <div class="container">
          <div class="top-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="product-images">
                    <main id="gallery">
                      <div className="main-img">
                        <img
                          className="mb-1"
                          src={
                            ProductForm.product_image
                              ? `${imageurl}/${ProductForm.product_image}`
                              : require("../../assets/images/comingSoon.png")
                          }
                          alt="Preview"
                          style={{ width: "100%", height: "auto" }} // تأكد من أن الصورة تأخذ العرض الكامل للعمود مع الحفاظ على نسب العرض إلى الارتفاع
                        />
                      </div>
                      <div className="images d-flex flex-wrap">
                        {ProductFormImages &&
                          ProductFormImages.map((file, index) => (
                            <div key={index} className="p-2">
                              <div>
                                {isZoomed && (
                                  <div
                                    className="zoomed-backdrop"
                                    onClick={() => setIsZoomed(false)}
                                  >
                                    <img
                                      src={`${imageurl}/${file.image}`}
                                      className="zoomed-image"
                                      alt="Enlarged preview"
                                    />
                                  </div>
                                )}
                                <img
                                  src={`${imageurl}/${file.image}`}
                                  alt="Preview"
                                  className="img-preview"
                                  style={{ width: "100px", height: "100px" }}
                                  onClick={() => setIsZoomed(true)}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </main>
                  </div>
                </div>
                <div class="col-lg-6 col-md-12 col-12">
                  <div class="product-info">
                    <h2 class="title">{ProductForm.product_name}</h2>
                    <p class="category">
                      <span> Category</span>
                      {ProductForm.category
                        ? ProductForm.category.name
                        : " : public"}
                      :
                    </p>
                    <h3>
                      <span>${ProductForm.price}</span>
                    </h3>
                    <p class="info-text mt-2">{ProductForm.description}</p>
                    <div class="row">
                      <div class="col-lg-4 col-md-4 col-12">
                        <div class="form-group color-option">
                          <label class="title-label" for="size">
                            Choose color
                          </label>
                          <div class="single-checkbox checkbox-style-1">
                            <input
                              type="checkbox"
                              id="checkbox-1"
                              name="color"
                              checked
                            />
                            <label for="checkbox-1">
                              <span></span>
                            </label>
                          </div>
                          <div class="single-checkbox checkbox-style-2">
                            <input type="checkbox" id="checkbox-2" />
                            <label for="checkbox-2">
                              <span></span>
                            </label>
                            0
                          </div>
                          <div class="single-checkbox checkbox-style-3">
                            <input type="checkbox" id="checkbox-3" />
                            <label for="checkbox-3">
                              <span></span>
                            </label>
                          </div>
                          <div class="single-checkbox checkbox-style-4">
                            <input type="checkbox" id="checkbox-4" />
                            <label for="checkbox-4">
                              <span></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-4 col-md-4 col-12">
                        <div class="form-group quantity">
                          <label for="color">Quantity</label>
                          <input
                            type="number"
                            name="quantity"
                            class="form-control"
                            max={5}
                          />
                        </div>
                      </div>
                    </div>
                    <div class="bottom-content">
                      <div class="row align-items-end">
                        <div class="col-lg-12 col-md-4 col-12">
                          <div class="button cart-button">
                            <div
                              class="button"
                              onClick={() => handleaddcart(id)}
                            >
                              <span class="btn">
                                <i class="lni lni-cart mt-3"></i> Add to Cart
                              </span>
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
        </div>
      </section>
    </>
  );
}
