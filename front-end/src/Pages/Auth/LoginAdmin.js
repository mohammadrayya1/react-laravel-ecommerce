import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { LOGINADMIN, baseUrl } from "../../Api/Api";
import Loading from "../../components/Loading/Loading";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
export default function LoginAdmin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, Setloading] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();
  const focus = useRef();

  useEffect(() => {
    focus.current.focus();
  }, []);
  function changehandle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    const cookies = Cookie();
    const token = cookies.get("admin-token");
    setErrorLogin("");
    e.preventDefault();
    Setloading(true);
    if (!token) {
      try {
        var result = await axios.post(`${baseUrl}/${LOGINADMIN}`, form);
        console.log(result);

        const token = result.data.token;

        cookies.set("admin-token", token, { maxAge: 2700 });
        window.location.pathname = "/dashboard";
        Setloading(false);
      } catch (error) {
        console.log(error);
        Setloading(false);
        if (error.response.status === 422) {
          setErrorLogin(error.response.data.error);
        }
        if (error.response.status === 401) {
          setErrorLogin(error.response.data.message);
        }
      }
    } else {
      window.location.pathname = "dashboard";
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div
        className="container mt-5"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              className="form-control"
              name="email"
              onChange={changehandle}
              required
              ref={focus}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              name="password"
              onChange={changehandle}
              required
              minLength="8"
            />
            {errorLogin !== "" && (
              <span class="errorregister">{errorLogin}</span>
            )}
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Login Admin
          </button>
        </form>
      </div>
    </>
  );
}
