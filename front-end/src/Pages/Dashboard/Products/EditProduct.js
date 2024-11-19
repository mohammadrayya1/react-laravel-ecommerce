import { useRef } from "react";
import {
  baseUrl,
  CATEGORIES,
  EditPRODUCTS,
  PRODUCT,
  imageurl,
  DeleteMultiFoto,
} from "../../../Api/Api";
import {
  Loading,
  useState,
  useEffect,
  axios,
  useNavigate,
  configget,
  configFile,
  useParams,
} from "../Library/library.js";
import LoadingTokenExpire from "../../../components/Loading/LoadingTokenExpire.js";

export default function EditProduct() {
  const { id } = useParams();

  const [ProductForm, setProductForm] = useState({});
  const [ProductFormImages, setProductFormImages] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [DeleteFoto, setDeleteFoto] = useState(false);
  const [errorEditProducts, seterrorPrtoducts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const ProductId = id;
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/${CATEGORIES}`, configget);
        const productById = await axios.get(
          `${baseUrl}/${PRODUCT}/${ProductId}`,
          configget
        );
        if (response) {
          console.log(response.data.categories);
          setCategories(response.data.categories);
        }
        if (productById) {
          console.log(productById.data.product);
          console.log(productById.data.products_images);
          const updatedProduct = {
            ...productById.data.product,
            product_images: null,
          };

          setProductForm(updatedProduct);
          setProductFormImages(productById.data.products_images);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchData();
  }, [DeleteFoto]);

  function handleChange(e) {
    const { name, type, value, files } = e.target;

    if (type === "file" && name === "product_images") {
      const selectedFiles = [...files];
      setProductForm((prevForm) => ({
        ...prevForm,
        [name]: selectedFiles,
      }));
    } else if (type === "file" && name === "product_image") {
      setProductForm((prevForm) => ({
        ...prevForm,
        [name]: files[0],
      }));
    } else {
      setProductForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(ProductForm);
    const formData = new FormData();
    Object.keys(ProductForm).forEach((key) => {
      if (
        key === "product_images" &&
        (ProductForm[key] === null || ProductForm[key] === "")
      ) {
        ProductForm[key] = "";
      } else if (
        key === "product_image" &&
        (ProductForm[key] === null || ProductForm[key] === "")
      ) {
        ProductForm[key] = "";
      } else if (
        key === "product_images" &&
        ProductForm[key] &&
        ProductForm[key].length > 0
      ) {
        ProductForm[key].forEach((file, index) => {
          formData.append(`${key}[${index}]`, file);
        });
      } else if (key === "category_id" && !ProductForm[key]) {
        formData.append(key, "");
      } else {
        formData.append(key, ProductForm[key]);
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${baseUrl}/${EditPRODUCTS}/${id}`,
        formData,
        configFile
      );
      if (response.data) {
        navigate("/dashboard/products");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        <LoadingTokenExpire />;
        setTimeout(() => {
          navigate("/loginAdmin");
        }, 3000);
      }
      console.error(error);
      setLoading(false);
      seterrorPrtoducts(error.response.data.errors);
    }
  }
  async function handelDeleteFoto(id) {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${baseUrl}/${DeleteMultiFoto}/${id}`,
        configget
      );
      if (response.data) {
        console.log(response.data);
        setDeleteFoto((prev) => !prev);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  function handleDeleteImage(index) {
    const newImages = [...ProductForm.product_images];
    newImages.splice(index, 1);
    setProductForm({
      ...ProductForm,
      product_images: newImages,
    });
  }

  const openImage = useRef(null);
  function handelOpenImage() {
    openImage.current.click();
  }
  return (
    <>
      {loading && <Loading />}

      <div className="container mt-5 mb-5">
        <h2>Edit Product</h2>

        {errorEditProducts && (
          <div className="errorregister">
            {Object.keys(errorEditProducts).map((key) =>
              errorEditProducts[key].map((error, index) => (
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
              value={ProductForm.product_name}
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
              onChange={handleChange}
              value={!ProductForm.category_id ? "" : ProductForm.category_id}
            >
              <option value="">No Parent</option>
              {categories.map((item, index) => {
                if (item.id === ProductForm.category_id) {
                  return (
                    <option selected key={index} value={item.id}>
                      {item.name}
                    </option>
                  );
                } else {
                  return (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={ProductForm.description}
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

            {ProductForm.product_image && (
              <img
                className="mb-1"
                src={`${imageurl}/${ProductForm.product_image}`}
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

          {ProductForm.product_images &&
            ProductForm.product_images.map((file, index) => (
              <div key={index} className="border p-2 w-100">
                <div className="d-flex align-items-center justify-content-start gap-2 border p-2 w-100 mb-2">
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
                    <span
                      onClick={() => handleDeleteImage(index)}
                      className="btn btn-danger"
                    >
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          {ProductFormImages &&
            ProductFormImages.map((file, index) => (
              <div key={index} className=" d-flex border p-2 w-100 ">
                <div className="d-flex align-items-center mb-1  justify-content-between gap-2 border p-2 w-100 mb-2">
                  <img
                    className="mb-1"
                    src={`${imageurl}/${file.image}`}
                    alt="Preview"
                    style={{ width: "100px", height: "100px" }}
                  />
                  <span
                    onClick={() => handelDeleteFoto(`${file.id}`)}
                    className="btn btn-danger"
                  >
                    Delete
                  </span>
                </div>
              </div>
            ))}
          <div className="form-group mb-3">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={ProductForm.stock}
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
              value={ProductForm.price || 0}
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
                  checked={ProductForm.status === "active"}
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
                  checked={ProductForm.status === "draft"}
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
                  checked={ProductForm.status === "archvied"}
                />
                <label className="form-check-label">archived</label>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Update Prodcut
          </button>
        </form>
      </div>
    </>
  );
}
