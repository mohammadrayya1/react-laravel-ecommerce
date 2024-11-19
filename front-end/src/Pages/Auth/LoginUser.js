import React, { useEffect, useRef, useState } from "react";
import "./Auth.css";
import axios from "axios";
import { LOGINUSER, baseUrl } from "../../Api/Api";
import Loading from "../../components/Loading/Loading";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";

export default function LoginUser() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorLogin, setErrorLogin] = useState("");
  const [loading, Setloading] = useState(false);

  function changehandle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorLogin("");
    Setloading(true);
    try {
      var result = await axios.post(`${baseUrl}/${LOGINUSER}`, form);

      if (result.status === 200) {
        console.log(result);
        const cookies = Cookie();
        const token = result.data.token;

        cookies.set("user-token", token, { maxAge: 7200 });
        cookies.set("username", result.data.user.name, { maxAge: 7200 });
        cookies.set("user_id", result.data.user.id, { maxAge: 7200 });

        window.location.pathname = "/home";

        Setloading(false);
      }
    } catch (error) {
      Setloading(false);
      if (error.response.status === 422) {
        setErrorLogin(error.response.data.message);
      }
      if (error.response.status === 401) {
        setErrorLogin(error.response.data.message);
      }
    }
  }
  const focus = useRef();

  useEffect(() => {
    focus.current.focus();
  }, []);
  return (
    <>
      {loading && <Loading />}
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2>Sign in User </h2>
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
          <div className="form-group">
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
            Login
          </button>
        </form>
      </div>
    </>
  );
}
