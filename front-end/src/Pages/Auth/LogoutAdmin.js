import axios from "axios";
import Cookie from "cookie-universal";
import { LOGOUTADMIN, baseUrl } from "../../Api/Api";
export default function LogoutAdmin() {
  const cookie = Cookie();
  const token = cookie.get("admin-token");
  console.log(token);

  async function handlelogout() {
    try {
      const res = await axios.post(
        `${baseUrl}/${LOGOUTADMIN}`,
        JSON.stringify(token),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return <button onClick={handlelogout}> Logout</button>;
}
