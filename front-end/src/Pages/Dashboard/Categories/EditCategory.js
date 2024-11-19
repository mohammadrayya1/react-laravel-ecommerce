import {
  baseUrl,
  CATEGORIES,
  ADDCATEGORY,
  EDITCATEGORYNEW,
  EDITCATEGORY,
  imageurl,
} from "../../../Api/Api";
import LoadingTokenExpire from "../../../components/Loading/LoadingTokenExpire.js";
import {
  Loading,
  useState,
  useEffect,
  axios,
  useNavigate,
  useParams,
  configget,
  configFile,
} from "../Library/library.js";
export default function CreateCategory() {
  const { id } = useParams();

  const [categories, setCategories] = useState([]);

  const [category, setCategoryById] = useState({
    name: "",
    status: "",
    category_id: "",
    description: "",
    imag: null,
    id: "",
  });

  const [categoryurlimage, setCategoryurlimage] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorEditCategory, seterrorEditCatefory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const categoryId = id;
    async function getcategories() {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/${CATEGORIES}`, configget);
        if (response) {
          setCategories(response.data.categories);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        seterrorEditCatefory(error.message);
      }
    }
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${baseUrl}/${EDITCATEGORY}/${categoryId}`,
          configget
        );
        if (response) {
          console.log(response.data.category);
          setCategoryById({
            name: response.data.category.name,
            status: response.data.category.status,
            category_id: response.data.category.category_id || "",
            description: response.data.category.description,
            id: response.data.category.id,
            imag: null,
          });
          setCategoryurlimage(response.data.category.imag);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        seterrorEditCatefory(error);
      }
    }
    getcategories();
    fetchData();
  }, []);

  function handleChange(e) {
    const { name, value, files, type } = e.target;
    setCategoryById((prevCategory) => ({
      ...prevCategory,
      [name]: type === "file" ? files[0] : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(category); // للتحقق من البيانات قبل إرسالها

    const formData = new FormData();
    Object.keys(category).forEach((key) => {
      const value = category[key] === null ? "" : category[key];
      formData.append(key, value);
    });

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/${EDITCATEGORYNEW}/${id}`,
        formData,
        configFile
      );
      if (response.data) {
        navigate("/dashboard/categories");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        <LoadingTokenExpire />;
        setTimeout(() => {
          navigate("/loginAdmin");
        }, 3000);
      }
      console.log(error);
      setLoading(false);
      seterrorEditCatefory(
        error.response ? error.response.data.errors : error.message
      );
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}

      <div className="container mt-5 mb-5">
        <h2>Edit Category</h2>

        {errorEditCategory && (
          <div className="errorregister">
            {Object.keys(errorEditCategory).map((key) =>
              errorEditCategory[key].map((error, index) => (
                <span key={`${key}-${index}`}>{error}</span>
              ))
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={category.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="category_id">Category Parent</label>
            <select
              name="category_id"
              className="form-control"
              value={category.category_id}
              onChange={handleChange}
            >
              <option value="">No Parent</option>
              {categories.map((item, index) => {
                if (item.id !== category.id) {
                  return (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  );
                }
                return null;
              })}
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={category.description || ""}
              onChange={handleChange}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="art_path">Image:</label>
            <input
              type="file"
              name="imag"
              id="image"
              onChange={handleChange}
              className="form-control"
            />
            <div>
              {categoryurlimage ? (
                <img
                  src={`${imageurl}${categoryurlimage}`}
                  alt={category.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "1px solid black",
                  }}
                />
              ) : (
                <span></span>
              )}
            </div>
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
                  checked={category.status === "active"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Active</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={category.status === "inactive"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Inactive</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            ADD
          </button>
        </form>
      </div>
    </>
  );
}
