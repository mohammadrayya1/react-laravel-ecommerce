import {
  baseUrl,
  imageurl,
  ORDERSITEMS,
  DELETEORDERS,
} from "../../../Api/Api.js";
import LoadingTokenExpire from "../../../components/Loading/LoadingTokenExpire.js";

import {
  Loading,
  FontAwesomeIcon,
  faTrash,
  faMemoCircleInfo,
  useState,
  useEffect,
  Link,
  axios,
  configget,
  useNavigate,
  faCalendarDay,
} from "../Library/library.js";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
export default function OrderItems() {
  const [loading, setLoading] = useState(false);
  const [orderItems, setorderItems] = useState([]);
  const [deleteorders, setDeleteorders] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  
  async function fetchData() {
    const userId = id;

    try {
      const response = await axios.get(
        `${baseUrl}/${ORDERSITEMS}/${userId}`,
        configget
      );
      console.log(response);
      setorderItems(response.data.orderItems);
    } catch (error) {
      if (error.response && error.response.status === 422) {
      }
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [deleteorders]);

  async function handelDelete(id) {
    console.log(id);
    try {
      setLoading(true);
      var response = await axios.delete(
        `${baseUrl}/${DELETEORDERS}/${id}`,
        configget
      );
      if (response.status === 200) {
        setDeleteorders((prev) => !prev);
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
            <h1>Orders Items </h1>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">order_id</th>
              <th scope="col">product_id</th>
              <th scope="col">product_name</th>

              <th scope="col">price</th>
              <th scope="col">quantity</th>

              <th scope="col">total</th>

              <th scope="col">product_image</th>
            </tr>
          </thead>
          <tbody>
            {orderItems &&
              orderItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <th scope="row">{item.order_id}</th>
                  <th scope="row">{item.product_id}</th>
                  <th scope="row">{item.product_name}</th>
                  <th scope="row">{item.price}</th>
                  <th scope="row">{item.quantity}</th>
                  <th scope="row">{item.total}</th>
                  <th scope="row">
                    <img
                      src={`${imageurl}/${item.product_image}`}
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "1px solid black",
                      }}
                    />
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
