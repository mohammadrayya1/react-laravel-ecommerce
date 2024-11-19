import { baseUrl, ORDERFORUSER } from "../../Api/Api.js";

import {
  Loading,
  FontAwesomeIcon,
  useState,
  useEffect,
  Link,
  axios,
  faPaypal,
  configget,
  configgetUser,
  useNavigate,
  faCalendarDay,
  faTrash,
} from "../../../src/Pages/Dashboard/Library/library.js";
import Cookie from "cookie-universal";
import { faCcApplePay } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";
export default function OrderForUser() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [deleteorders, setDeleteorders] = useState(false);
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const response = await axios.get(
        `${baseUrl}/${ORDERFORUSER}`,
        configgetUser
      );
      console.log(response);
      if (response.data.order.length > 0) {
        setOrders(response.data.order);
      }
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
  const cookie = Cookie();

  const tokenUser = cookie.get("user-token");
  async function handelDelete(id) {
    try {
      setLoading(true);
      var response = await axios.delete(
        `${baseUrl}/delete-order-foruser/${id}`,
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
  async function submitOrder(id) {
    console.log(configgetUser);

    try {
      const response = await axios.post(
        `${baseUrl}/kaufen/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenUser}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.success && response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      }
    } catch (error) {
      console.log(error.toJSON());
    }
  }
  return (
    <>
      {loading && <Loading />}
      <div
        className="bg-white  w-100 p-2 container"
        style={{ height: "100vh" }}
      >
        <div className="bg-white w-100 p-2">
          <div className="d-flex justify-content-between  mb-4">
            <h1>My Orders</h1>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">user_id</th>
              <th scope="col">username</th>
              <th scope="col">email</th>

              <th scope="col">adress</th>
              <th scope="col">phone</th>
              <th scope="col">city</th>
              <th scope="col">postal_code</th>
              <th scope="col">total</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              Array.isArray(orders) &&
              orders.length > 0 &&
              orders.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <th scope="row">{item.user_id}</th>
                  <th scope="row">{item.username}</th>
                  <th scope="row">{item.email}</th>
                  <th scope="row">{item.address}</th>
                  <th scope="row">{item.phone}</th>
                  <th scope="row">{item.city}</th>
                  <th scope="row">{item.postal_code}</th>
                  <th scope="row">{item.total}</th>
                  <th scope="row">{item.status}</th>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Link to={`../orderItems/${item.id}`}>
                        <FontAwesomeIcon
                          fontSize={"19px"}
                          color="blue"
                          icon={faCalendarDay}
                        />
                      </Link>
                      <FontAwesomeIcon
                        fontSize={"19px"}
                        onClick={() => handelDelete(`${item.id}`)}
                        color="red"
                        cursor={"pointer"}
                        icon={faTrash}
                      />
                      <FontAwesomeIcon
                        icon={faCcApplePay}
                        fontSize={"30px"}
                        cursor={"pointer"}
                        onClick={() => submitOrder(`${item.id}`)}
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
