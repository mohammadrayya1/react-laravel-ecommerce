import { Outlet } from "react-router-dom";

import Topbar from "../../components/Dashboard/Topbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import { Menu } from "../../Context/MenuContext";
import "./dashboard.css";
export default function Dashboard() {
  return (
    <div className="">
      <Topbar />
      <div className="dashboard d-flex gap-1" style={{ marginTop: "70px" }}>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
