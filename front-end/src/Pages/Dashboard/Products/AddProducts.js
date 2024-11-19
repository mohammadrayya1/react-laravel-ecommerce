import { useRef } from "react";
import { baseUrl, CATEGORIES, ADDPRODUCTS } from "../../../Api/Api";
import {
  Loading,
  useState,
  useEffect,
  axios,
  useNavigate,
  configget,
  configFile,
} from "../Library/library.js";
import LoadingTokenExpire from "../../../components/Loading/LoadingTokenExpire.js";

export default function AddProducts() {
  const [form, setForm] = useState({
    product_name: "",
    description: "",
    stock: 0,
    price: 0,
    product_image: null,
    status: "",
    category_id: "",
    product_images: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorcreateProducts, seterrorPrtoducts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/${CATEGORIES}`, configget);
        if (response) {
          setCategories(response.data.categories);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          <LoadingTokenExpire />;
          setTimeout(() => {
            navigate("/loginAdmin");
          }, 3000);
        }
        setLoading(false);
        window.location.pathname = "/loginAdmin";
      }
    }

    fetchData();
  }, []);

  function handleChange(e) {
    const { name, type, value, files } = e.target;

    if (type === "file" && name === "product_images") {
      const selectedFiles = [...files];
      setForm((prevForm) => ({
        ...prevForm,
        [name]: selectedFiles,
      }));
    } else if (type === "file" && name === "product_image") {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: files[0],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (
        key === "product_images" &&
        (form[key] === null || form[key] === "")
      ) {
        form[key] = "";
      } else if (
        key === "product_image" &&
        (form[key] === null || form[key] === "")
      ) {
        form[key] = "";
      } else if (
        key === "product_images" &&
        form[key] &&
        form[key].length > 0
      ) {
        form[key].forEach((file, index) => {
          formData.append(`${key}[${index}]`, file);
        });
      } else {
        formData.append(key, form[key]);
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${baseUrl}/${ADDPRODUCTS}`,
        formData,
        configFile
      );
      if (response.data) {
        setForm({
          product_name: "",
          description: "",
          stock: 0,
          price: 0,
          product_image: null,
          status: "",
          category_id: "",
          product_images: null,
        });
        navigate("/dashboard/products");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      seterrorPrtoducts(error.response.data.errors);
    }
  }

  const openImage = useRef(null);
  function handelOpenImage() {
    openImage.current.click();
  }
  return (
    <>
      {loading && <Loading />}

      <div className="container mt-5 mb-5">
        <h2>Add Product</h2>

        {errorcreateProducts && (
          <div className="errorregister">
            {Object.keys(errorcreateProducts).map((key) =>
              errorcreateProducts[key].map((error, index) => (
                <span key={`${key}-${index}`}>{error}</span>
              ))
            )}
          </div>
        )}

        <form className="bg-white w-100 mx-2 p-3" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="product_name"
              id="product_name"
              value={form.product_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="category_id">Category Parent</label>
            <select
              name="category_id"
              className="form-control"
              value={form.category_id || ""}
              onChange={handleChange}
            >
              <option value="">No Parent</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="art_path">Main image:</label>
            <input
              type="file"
              name="product_image"
              id="product_image"
              onChange={handleChange}
              className="form-control"
            />
            {form.product_image && (
              <img
                className="mb-1"
                src={URL.createObjectURL(form.product_image)}
                alt="Preview"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="art_path">Images:</label>
            <input
              hidden
              type="file"
              multiple
              name="product_images"
              id="product_images"
              onChange={handleChange}
              className="form-control"
              ref={openImage}
            />
          </div>
          <div
            onClick={handelOpenImage}
            className="d-flex align-items-center justify-content-center gap-2 py-3 mb-3 rounded w-100 flex-column"
            style={{ border: "2px dashed #0086fe ", cursor: "pointer" }}
          >
            <img
              src={require("../../../assets/images/upload.png")}
              alt="upload here"
              width="100px"
            ></img>
            <p className="fw-bold" style={{ color: "#0086fe" }}>
              Upload Here
            </p>
          </div>
          {form.product_images &&
            form.product_images.map((file, index) => (
              <div key={index} className="border p-2 w-100">
                <div className="d-flex align-items-center  justify-content-start gap-2 border p-2 w-100 mb-2">
                  <img
                    className="mb-1"
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    style={{ width: "100px", height: "100px" }}
                  />
                  <div>
                    <p className="mb-1">{file.name}</p>
                    <p>
                      {file.size / 1024 < 900
                        ? (file.size / 1024).toFixed(2) + " KB"
                        : (file.size / (1024 * 1024)).toFixed(2) + " MB"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          <div className="form-group mb-3">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={form.stock}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              name="price"
              id="price"
              step="0.01"
              value={form.price || 0}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="status">Status:</label>
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="active"
                  onChange={handleChange}
                />
                <label className="form-check-label">Active</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="draft"
                  onChange={handleChange}
                />
                <label className="form-check-label">draft</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="archvied"
                  onChange={handleChange}
                />
                <label className="form-check-label">archived</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            ADD Prodcut
          </button>
        </form>
      </div>
    </>
  );
}
