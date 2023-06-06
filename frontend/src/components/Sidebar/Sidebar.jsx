import "./sidebar.css";
import logo from "../../assets/logo.png";
import {
  AssessmentRounded,
  ForumOutlined,
  SearchOutlined,
} from "@material-ui/icons";
import { gql, useQuery } from "@apollo/client";
import { CopyrightOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { AccountCircleOutlined } from "@material-ui/icons";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import DOMPurify from "dompurify";

function Sidebar({ currentPage }) {
  const { user } = useContext(AuthContext);

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

  if (loading)
    return (
      <div className="lds-circle">
        <div></div>
      </div>
    );

  return (
    <div className="sidebar col-3">
      <div className="logo-container">
        <img src={logo} />
      </div>
      <nav>
        <ul className="sidebarNav">
          <Link to="/dashboard">
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

          <Link to={`/profile/${user.name}`}>
            <li
              className={`sidebarItem ${
                currentPage == "profile" ? "active" : ""
              }`}
            >
              <div className="active-line"></div>
              <AccountCircleOutlined className="sidebarLogo" />
              <p>Min Profil</p>
            </li>
          </Link>

          <Link to="/search">
            <li
              className={`sidebarItem ${
                currentPage == "search" ? "active" : ""
              }`}
            >
              <div className="active-line"></div>
              <SearchOutlined className="sidebarLogo" />
              <p>Søg</p>
            </li>
          </Link>
        </ul>
      </nav>

      <nav>
        <p className="undertitles">Forum</p>
        <ul className="sidebarNav">
          <Link to="/opretforum">
            <li
              className={`sidebarItem ${
                currentPage == "opretforum" ? "active" : ""
              }`}
            >
              <div className="active-line"></div>
              <ForumOutlined className="sidebarLogo" />
              <p>Opret forum</p>
            </li>
          </Link>
          {data?.getCommunitiesByUser.map((community, i) => (
            <Link key={i} to={`/forum/${DOMPurify.sanitize(community.name)}`}>
              <li
                className={`sidebarItem ${
                  currentPage == DOMPurify.sanitize(community.name)
                    ? "active"
                    : ""
                }`}
              >
                <div className="active-line"></div>
                <img
                  className="sidebarIcon"
                  src={DOMPurify.sanitize(community.profilepic)}
                />
                <p>{DOMPurify.sanitize(community.name)}</p>
              </li>
            </Link>
          ))}
          ;
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

export default Sidebar;
