import {
  baseUrl,
  imageurl,
  PRODUCTS,
  DELETEPRODUCTS,
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
  configget,
  useNavigate,
} from "../Library/library.js";
import { NavLink } from "react-router-dom";
export default function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [deleteProducts, setDeleteProducts] = useState(false);
  const navigate = useNavigate();


  
  async function fetchData() {
    try {
      const response = await axios.get(`${baseUrl}/${PRODUCTS}`, configget);
      console.log(response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        <LoadingTokenExpire />;
        setTimeout(() => {
          navigate("/loginAdmin");
        }, 3000);
      }
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [deleteProducts]);

  async function handelDelete(id) {
    try {
      setLoading(true);
      var response = await axios.delete(
        `${baseUrl}/${DELETEPRODUCTS}/${id}`,
        configget
      );
      if (response.status === 200) {
        setDeleteProducts((prev) => !prev);
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      console.log("not deleted");
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="bg-white  w-100 p-2">
        <div className="bg-white w-100 p-2">
          <div className="d-flex justify-content-between  mb-4">
            <h1>Products </h1>
            <NavLink
              to={"../Add-products"}
              className="d-flex align-items-center gab-2 "
            >
              <p className="btn btn-primary m-2">Add-Product</p>
            </NavLink>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Image</th>
              <th scope="col">ِAction</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <th scope="row">{item.product_name}</th>
                  <th scope="row">
                    {item.category ? item.category.name : "---"}
                  </th>

                  <th scope="row">
                    <img
                      src={
                        item.product_image
                          ? `${imageurl}/${item.product_image}`
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
                      <Link to={`../product-edit/${item.id}`}>
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
