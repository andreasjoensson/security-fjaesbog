import "./adminbar.css";
import logo from "../../assets/logo.png";
import {
  AssessmentRounded,
  FaceOutlined,
  ForumOutlined,
  SchoolOutlined,
  SearchOutlined,
} from "@material-ui/icons";
import { gql, useQuery } from "@apollo/client";
import { CopyrightOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { AccountCircleOutlined } from "@material-ui/icons";
import { Redirect, useHistory } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";

function Adminbar({ currentPage }) {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  /*
  const GET_COMMUNITIES_QUERY = gql`
    query GetCommunitiesByUser {
      getCommunitiesByUser {
        id
        name
        profilepic
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_COMMUNITIES_QUERY);

  useEffect(() => {
    console.log("Loading:", loading);
    console.log("Data:", data);
    console.log("Error:", error);
  }, [loading, data, error]);

  if (loading)
    return (
      <div class="lds-circle">
        <div></div>
      </div>
    );

    */

  return (
    <div className="sidebar col-3">
      <div className="logo-container">
        <img src={logo} />
      </div>
      <nav>
        <ul className="sidebarNav">
          <Link to="/admin">
            <li
              className={`sidebarItem ${
                currentPage == "dashboard" ? "active" : ""
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
                currentPage == "adminusers" ? "active" : ""
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
