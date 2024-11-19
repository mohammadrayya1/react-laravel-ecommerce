import { useEffect, useState } from "react";
import { USERS, baseUrl, DELETEUSER } from "../../Api/Api.js";
import Loading from "../../components/Loading/Loading.js";
import axios from "axios";
import Cookie from "cookie-universal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingTokenExpire from "../../components/Loading/LoadingTokenExpire.js";
export default function User() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteUser, setDeleteUsers] = useState(false);
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
      const response = await axios.get(`${baseUrl}/${USERS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 422) {
        <LoadingTokenExpire />;
        setTimeout(() => {
          navigate("/loginAdmin");
        }, 3000);
      } else {
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    fetchData();
  }, [deleteUser]);

  async function handelDelete(id) {
    try {
      setLoading(true);
      var response = await axios.delete(
        `${baseUrl}/${DELETEUSER}/${id}`,
        configget
      );
      if (response.status === 200) {
        setDeleteUsers((prev) => !prev);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <>
      {loading && <Loading />}
      <div className="bg-white  w-100 p-2">
        <h1>Users Page</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">userName</th>
              <th scope="col">email</th>
              <th scope="col">ِAction</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <th scope="row">{item.name}</th>
                  <td>{item.email}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Link to={`../userProfile/${item.id}`}>
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
