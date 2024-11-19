import "./bars.css";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import { AdminAuth, baseUrl, LOGOUTADMIN } from "../../Api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "../../Context/MenuContext";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
export default function Topbar() {
  const [userExict, setUser] = useState();
  const [id, setId] = useState();
  const menu = useContext(Menu);
  const setIsopen = menu.setIsopen;
  const cookie = Cookie();
  const token = cookie.get("admin-token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        var response = await axios.post(
          `${baseUrl}/${AdminAuth}`,
          JSON.stringify(token),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data.admin.name);
          setUser(response.data.admin.name);
          setId(response.data.admin.id);
        } else if (response.status === 401) {
          navigate("/loginAdmin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        navigate("/loginAdmin", { replace: true });
      }
    };

    fetchData();
  }, []);

  async function handelLogout(id) {
    try {
      var response = await axios.post(
        `${baseUrl}/${LOGOUTADMIN}`,
        JSON.stringify(token),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        cookie.remove("admin-token");
        setUser("");
        setId("");
        navigate("/loginAdmin", { replace: true });
      } else if (response.status === 401) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      navigate("/loginAdmin", { replace: true });
    }
  }
  return (
    <div className="top-bar ">
      <div className="d-flex align-items-center justify-content-between h-100">
        <div className="d-flex align-items-center gap-5">
          <h3> E-commerce</h3>
          <FontAwesomeIcon
            onClick={() => setIsopen((prev) => !prev)}
            cursor={"pointer"}
            icon={faBars}
          />
        </div>

        <div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {userExict ? userExict : ""}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handelLogout(`${id}`)}>
                Log-out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
