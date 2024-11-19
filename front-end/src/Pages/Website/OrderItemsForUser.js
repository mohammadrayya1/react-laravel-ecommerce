import { baseUrl, imageurl, ORDERSITEMS, DELETEORDERS } from "../../Api/Api.js";

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
  faCcApplePay,
  configgetUser,
} from "../Dashboard/Library/library.js";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
export default function OrderItemsForUser() {
  const [loading, setLoading] = useState(false);
  const [orderItems, setorderItems] = useState([]);
  const [deleteorders, setDeleteorders] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  async function fetchData() {
    const order_id = id;

    try {
      const response = await axios.get(
        `${baseUrl}/OrderItemsforuser/${order_id}`,
        configgetUser
      );
      console.log(response);
      setorderItems(response.data.orderItems);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // <LoadingTokenExpire />;
        // setTimeout(() => {
        //   navigate("/loginAdmin");
        // }, 3000);
      }
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [deleteorders]);

  async function handelDelete(item_id, item_order_id) {
    console.log(item_id);
    // console.log(item_order_id);
    try {
      setLoading(true);
      var response = await axios.delete(
        `${baseUrl}/delete-order-item/${item_id}/${item_order_id}`,
        configgetUser
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
      <div
        className="bg-white  w-100    p-2 container"
        style={{ height: "100vh" }}
      >
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
              <th scope="col">ِAction</th>
            </tr>
          </thead>
          <tbody>
            {orderItems &&
              orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="table-cell-centered">{item.id}</td>
                  <th className="table-cell-centered" scope="row">
                    {item.order_id}
                  </th>
                  <th className="table-cell-centered" scope="row">
                    {item.product_id}
                  </th>
                  <th className="table-cell-centered" scope="row">
                    {item.product_name}
                  </th>
                  <th className="table-cell-centered" scope="row">
                    {item.price}
                  </th>
                  <th className="table-cell-centered" scope="row">
                    {item.quantity}
                  </th>
                  <th className="table-cell-centered" scope="row">
                    {item.total}
                  </th>
                  <th className="table-cell-centered" scope="row">
                    <img
                      src={`${imageurl}/${item.product_image}`}
                      alt={item.name}
                      style={{
                        maxWidth: "100px", // يضمن أن الصورة لن تتجاوز عرض الخلية
                        maxHeight: "100px", // يضمن أن الصورة لن تتجاوز ارتفاع الخلية
                      }}
                    />
                  </th>
                  <th className="table-cell-centered" scope="row">
                    <FontAwesomeIcon
                      fontSize="19px"
                      onClick={() => handelDelete(item.id, item.order_id)}
                      color="red"
                      cursor="pointer"
                      icon={faTrash}
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
