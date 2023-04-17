import Topbar from './components/Topbar/Topbar';
import './dashboard.css';
import Feed from './components/Feed/Feed';
import Sidebar from './components/Sidebar/Sidebar.jsx';

function Dashboard() {
    return (
        <div className="container">
            <Sidebar currentPage={'dashboard'}/>
            <Feed/>
        </div>
    )
}

export default Dashboard
