import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl, REGISTER } from "../../Api/Api";
import "./Auth.css";
import Loading from "../../components/Loading/Loading";

export default function Register() {
  const [loading, Setloading] = useState(false);
  const [errorRegister, seterrorRegister] = useState("");
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    birthday: "",
    last_name: "",
    first_name: "",
    gender: "",
    address: "",
    state: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
  });
  const navigate = useNavigate();
  function changhandle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(e.target.value);
  }

  async function submithandle(e) {
    e.preventDefault();

    Setloading(true);
    seterrorRegister("");

    try {
      var result = await axios.post(`${baseUrl}/${REGISTER}`, form);
      if (result.status === 200) {
        Setloading(false);

        navigate("/home/loginUser", { replace: true });
      }
    } catch (error) {
      console.log(error);
      seterrorRegister(error.response.data.errors);
      Setloading(false);

      if (error.response.status === 400) {
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

      <div className="container mt-5 mb-5">
        <h2>Profile Registration</h2>

        {errorRegister && (
          <div className="errorregister">
            {Object.keys(errorRegister).map((key) =>
              errorRegister[key].map((error, index) => (
                <span key={`${key}-${index}`}>{error}</span> // Use a combined key to ensure uniqueness
              ))
            )}
          </div>
        )}

        <div className="form-container">
          <form className="needs-validation" onSubmit={submithandle}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={changhandle}
                    className="form-control"
                    required
                    ref={focus}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={changhandle}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={changhandle}
                    className="form-control"
                    required
                    minLength="8"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="first_name">First Name:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={form.first_name}
                    onChange={changhandle}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="last_name">Last Name:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={form.last_name}
                    onChange={changhandle}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="birthday">Birthday:</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={form.birthday}
                onChange={changhandle}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                className="form-control"
                value={form.gender}
                onChange={changhandle}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={changhandle}
                className="form-control"
              />
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={changhandle}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={changhandle}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="postal_code">Postal Code:</label>
                  <input
                    type="text"
                    id="postal_code"
                    value={form.postal_code}
                    name="postal_code"
                    onChange={changhandle}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="country">Country:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={changhandle}
                    className="form-control"
                    maxLength="2"
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={changhandle}
                    className="form-control"
                    maxLength="11"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
