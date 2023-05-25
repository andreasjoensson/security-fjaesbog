import React from "react";
import "./Admin.css";
import Adminbar from "../../components/AdminBar/Adminbar";
import AdminDashboard from "../AdminDashboard/AdminDashboard";

export default function Admin() {
  return (
    <div className="container-fluid">
      <div className="row">
        <Adminbar currentPage={"dashboard"} />
        <div className="communityContainer col-9">
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}
