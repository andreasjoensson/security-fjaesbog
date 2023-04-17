import './sidebar.css';
import logo from '../../logo.png';
import { AssessmentRounded, FaceOutlined, ForumOutlined, SchoolOutlined, SearchOutlined } from '@material-ui/icons';
import {useState} from 'react';
import { ExpandMoreOutlined } from '@material-ui/icons';
import { TimelineOutlined } from '@material-ui/icons';
import { WorkOffOutlined } from '@material-ui/icons';
import { CopyrightOutlined } from '@material-ui/icons';
import { FitnessCenterOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { AccountCircleOutlined } from '@material-ui/icons';
import { Redirect, useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';
function Sidebar({currentPage}) {
const {user} = useContext(AuthContext);
const history = useHistory();




    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src={logo}/>
            </div>
        <nav>
           <ul className="sidebarNav">
               
               <Link to='/dashboard'>
                <li className={`sidebarItem ${currentPage == 'dashboard' ? 'active' : ''}`}> 
               <div className="active-line"> 
               </div>
               <AssessmentRounded className="sidebarLogo"/>
               <p>Dashboard</p>
               </li>
               </Link>
              
               
               <Link to={`/profile/${user.name}`}>
                <li className={`sidebarItem ${currentPage == 'profile' ? 'active' : ''}`}> 
               <div className="active-line"> 
               </div>
               <AccountCircleOutlined className="sidebarLogo"/>
               <p>Min Profil</p>
               </li>
               </Link>
              
               
               <Link to="/search">
               <li className={`sidebarItem ${currentPage == 'search' ? 'active' : ''}`}> 
               <div className="active-line"> 
               </div>
               <SearchOutlined className="sidebarLogo"/>
               <p>Søg</p>
               </li>
               </Link>
               
           </ul> 
        </nav>


        <nav>
            <p className="undertitles">Forum</p>
           <ul className="sidebarNav">

<Link to='/opretforum'>
<li className={`sidebarItem ${currentPage == 'opretforum' ? 'active' : ''}`}> 
               <div className="active-line"> 
               </div>
               <ForumOutlined className="sidebarLogo"/>
               <p>Opret forum</p>
               </li>
</Link>
           
              
              <Link to='/forum/Skole'>
             <li className={`sidebarItem ${currentPage == 'Skole' ? 'active' : ''}`}> 
               <div className="active-line"> 
               </div>
               <SchoolOutlined className="sidebarLogo"/>
               <p>Skole</p>
               </li>  
              </Link>
              

<Link to='/forum/Arbejde'>
  <li className={`sidebarItem ${currentPage == 'arbejde' ? 'active' : ''}`}> 
               <div className="active-line"> 
               </div>
               <WorkOffOutlined className="sidebarLogo"/>
               <p>Arbejde</p>
               </li>
</Link>               
             

<Link to='/forum/Fitness'>
  <li className={`sidebarItem ${currentPage == 'fitness' ? 'active' : ''}`}> 
               <div className="active-line"> 
               </div>
               <FitnessCenterOutlined className="sidebarLogo"/>
               <p>Fitness</p>
               </li>
</Link>
             


           </ul> 
        </nav>

<div className="copyright">
<h2><CopyrightOutlined className="copyrightLogo"/> Fjæsbog. 2021</h2> 
</div>

        </div>
    )
}

export default Sidebar
