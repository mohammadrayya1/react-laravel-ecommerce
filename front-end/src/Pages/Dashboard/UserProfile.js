import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, userProfile, editProfile, EDITPROFILEa } from "../../Api/Api";
import "../Auth/Auth.css";
import Loading from "../../components/Loading/Loading";
import { useParams } from "react-router-dom";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorRegister, setErrorRegister] = useState();
  const [errorUpdate, setErrorUpdate] = useState();
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
  const cookie = Cookie();
  const token = cookie.get("admin-token");

  const configget = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const userId = id;

    // Fetch user data when component mounts
    fetchUserData(userId);
  }, []);

  // Function to fetch user data
  async function fetchUserData(userId) {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/${userProfile}/${userId}`,
        configget
      );
      if (response.status === 200) {
        console.log("Prfile");
        console.log(response);

        const profileData =
          response.data.profile.length > 0 ? response.data.profile[0] : "";
        console.log(response.data.profile);
        const userData = response.data.user;
        const formData = {
          address: profileData.address ? profileData.address : "",
          birthday: profileData.birthday ? profileData.birthday : "",
          city: profileData.city ? profileData.city : "",
          country: profileData.country ? profileData.country.toUpperCase() : "",
          email: userData.email,
          first_name: profileData.first_name ? profileData.first_name : "",
          gender: profileData.gender ? profileData.gender : "",
          last_name: profileData.last_name ? profileData.last_name : "",
          postal_code: profileData.postal_code ? profileData.postal_code : "",
          state: profileData.state ? profileData.state : "",
          username: userData.name,
          phone: profileData.phone,
        };
        console.log(formData);
        setForm(formData);
        setDisable(false); // Enable form inputs after data is fetched
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorRegister("Failed to load user data");
    }
    setLoading(false);
  }

  // Function to handle form input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  }

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.put(
        `${baseUrl}/${EDITPROFILEa}/${id}`,
        JSON.stringify(form),
        configget
      );
      if (result.status === 200) {
        navigate("/dashboard/users");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      setLoading(false);
      setErrorUpdate(error.response.data.errors);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="container mt-5 mb-5">
        <h2>Profile Update </h2>
        {errorRegister && (
          <div className="errorregister">
            <span>{errorRegister}</span>
          </div>
        )}
        {errorUpdate && (
          <div className="errorregister">
            {Object.keys(errorUpdate).map((key) =>
              errorUpdate[key].map((error, index) => (
                <span key={`${key}-${index}`}>{error}</span>
              ))
            )}
          </div>
        )}
        <div className="form-container">
          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    required
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                className="form-control"
                onChange={handleChange}
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
                onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="form-control"
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
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    className="form-control"
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
                    onChange={handleChange}
                    className="form-control"
                    maxLength="2"
                  />
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="phone">Phone:</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="form-control"
                        maxLength="11"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              disable={disable}
              type="submit"
              className="btn btn-primary mt-3"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
