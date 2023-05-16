import "./dashboard.css";
import Feed from "../../components/Feed/Feed";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar currentPage={"dashboard"} />
        <Feed />
      </div>
    </div>
  );
}

export default Dashboard;
