import {
  CATEGORIES,
  baseUrl,
  DELETECATEGORY,
  imageurl,
} from "../../../Api/Api.js";
import LoadingTokenExpire from "../../../components/Loading/LoadingTokenExpire.js";

import {
  Loading,
  FontAwesomeIcon,
  faPenToSquare,
  faTrash,
  useState,
  useEffect,
  Link,
  axios,
  Cookie,
  useNavigate,
} from "../Library/library.js";
import { NavLink } from "react-router-dom";

export default function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setcategories] = useState([]);
  const navigate = useNavigate();
  const [deleteCategory, setDeleteCategory] = useState(false);
  const cookie = Cookie();
  const token = cookie.get("admin-token");
  const configget = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.get(`${baseUrl}/${CATEGORIES}`, configget);
      console.log(response.data);
      setcategories(response.data.categories);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        <LoadingTokenExpire />;
        setTimeout(() => {
          navigate("/loginAdmin");
        }, 3000);
        console.log(error);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [deleteCategory]);

  async function handelDelete(id) {
    try {
      setLoading(true);
      var response = await axios.delete(
        `${baseUrl}/${DELETECATEGORY}/${id}`,
        configget
      );
      if (response.status === 200) {
        setDeleteCategory((prev) => !prev);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  console.log(imageurl);
  return (
    <>
      {loading && <Loading />}
      <div className="bg-white  w-100 p-2">
        <div className="bg-white w-100 p-2">
          <div className="d-flex justify-content-between  mb-4">
            <h1>Categories Page</h1>
            <NavLink
              to={"../Add-category"}
              className="d-flex align-items-center gab-2 "
            >
              <p className="btn btn-primary m-2">Add-Category</p>
            </NavLink>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Descriptions</th>
              <th scope="col">Parent</th>
              <th scope="col">Image</th>
              <th scope="col">ِAction</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <th scope="row">{item.name}</th>
                  <th scope="row">{item.description}</th>
                  <th scope="row">{item.parent.name}</th>
                  <th scope="row">
                    <img
                      src={
                        item.imagePath && item.imagePath !== "/"
                          ? `${imageurl}/${item.imagePath}`
                          : require("../../../assets/images/comingSoon.png")
                      }
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "1px solid black",
                      }}
                    />
                  </th>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Link to={`../editCategory/${item.id}`}>
                        <FontAwesomeIcon
                          fontSize={"19px"}
                          color="blue"
                          icon={faPenToSquare}
                        />
                      </Link>
                      <FontAwesomeIcon
                        fontSize={"19px"}
                        onClick={() => handelDelete(`${item.id}`)}
                        color="red"
                        cursor={"pointer"}
                        icon={faTrash}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
