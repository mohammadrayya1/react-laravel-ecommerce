import axios from "axios";
import Cookie from "cookie-universal";
import { LOGOUTUSER, baseUrl } from "../../Api/Api";
export default function LogoutUser() {
  const cookie = Cookie();
  const token = cookie.get("user-token");
  console.log(token);

  async function handlelogout() {
    try {
      const res = await axios.post(
        `${baseUrl}/${LOGOUTUSER}`,
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

  return <button onClick={handlelogout}> Logout User</button>;
}
