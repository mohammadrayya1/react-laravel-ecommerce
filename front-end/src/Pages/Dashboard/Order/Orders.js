import { baseUrl, imageurl, ORDERS, DELETEORDERS } from "../../../Api/Api.js";
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
import { NavLink } from "react-router-dom";
export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [deleteorders, setDeleteorders] = useState(false);
  const navigate = useNavigate();



  async function fetchData() {
    try {
      const response = await axios.get(`${baseUrl}/${ORDERS}`, configget);
      console.log(response);
      setOrders(response.data.orders);
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
            <h1>Orders </h1>
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
