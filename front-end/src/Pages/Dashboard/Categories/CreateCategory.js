import { baseUrl, CATEGORIES, ADDCATEGORY } from "../../../Api/Api";
import LoadingTokenExpire from "../../../components/Loading/LoadingTokenExpire.js";
import {
  Loading,
  useState,
  useEffect,
  axios,
  useNavigate,
  configget,
  configFile,
} from "../Library/library.js";
export default function CreateCategory() {
  const [form, setForm] = useState({
    name: "",
    status: "",
    category_id: "",
    description: "",
    imag: null, // تغيير القيمة الافتراضية إلى null للملف
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorcreateCategory, seterrorCatefory] = useState("");
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
        seterrorCatefory(error.message);
      }
    }

    fetchData();
  }, []);

  function handleChange(e) {
    const { name, type, value, files } = e.target;
    if (type === "file") {
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
      if (key === "imag" && !form[key]) {
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
        `${baseUrl}/${ADDCATEGORY}`,
        formData,
        configFile
      );
      if (response.data) {
        setForm({
          name: "",
          status: "",
          category_id: "",
          description: "",
          imag: null,
        });
        navigate("/dashboard/categories");
      }
      setLoading(false);
    } catch (error) {
      console.log(form);
      console.log(error);
      setLoading(false);
      seterrorCatefory(error.response.data.data);
    }
  }

  return (
    <>
      {loading && <Loading />}

      <div className="container mt-5 mb-5">
        <h2>Add Category</h2>

        {errorcreateCategory && (
          <div className="errorregister">
            {Object.keys(errorcreateCategory).map((key) =>
              errorcreateCategory[key].map((error, index) => (
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
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
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
              value={form.description || ""}
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
                  value="inactive"
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
