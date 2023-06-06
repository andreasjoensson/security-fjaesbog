import {
  AccountCircleOutlined,
  AssessmentRounded,
  CopyrightOutlined,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./adminbar.css";

function Adminbar({ currentPage }) {
  return (
    <div className="sidebar col-3">
      <div className="logo-container">
        <img alt="Fjæsbogo logo" src={logo} />
      </div>
      <nav>
        <ul className="sidebarNav">
          <Link to="/admin">
            <li
              className={`sidebarItem ${
                currentPage === "dashboard" ? "active" : ""
              }`}
            >
              <div className="active-line"></div>
              <AssessmentRounded className="sidebarLogo" />
              <p>Dashboard</p>
            </li>
          </Link>

          <Link to={`/adminusers`}>
            <li
              className={`sidebarItem ${
                currentPage === "adminusers" ? "active" : ""
              }`}
            >
              <div className="active-line"></div>
              <AccountCircleOutlined className="sidebarLogo" />
              <p>Brugere</p>
            </li>
          </Link>
        </ul>
      </nav>

      <div className="copyright">
        <h2>
          <CopyrightOutlined className="copyrightLogo" /> Fjæsbog. 2023
        </h2>
      </div>
    </div>
  );
}

export default Adminbar;
