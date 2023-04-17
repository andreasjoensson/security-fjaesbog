import './profile.css';
import { useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { useQuery,gql} from '@apollo/client';
import Post from './components/Post/Post';

export default function Profile() {
let {id} = useParams();

const GET_USER_POSTS = gql`
query getPostsFromUser($name: String!){
    getPostsFromUser(name:$name){
        text
        image
        post_id
        title
        user_id
        profilepic
        name
        created_at  
    }
    getProfile(name:$name){
        user_id
        name
        age
        email
        profilepic
        school{
            logo
            name
        }
        profilecover
        created_at
    }
}
`

const {data,loading} = useQuery(GET_USER_POSTS, {variables: {name: id}});

if(loading) return 'loading...'

    return (
        <div className="profilePage">
            <Sidebar currentPage={'profile'}/>
            <div className="profile-container">
                <div className="profile-cover">
                    <img src={data?.getProfile.profilecover} className="profileCover"/> 
                         <div className="profile-pic">
                    <img src={data?.getProfile.profilepic} className="profilePic"/>
                </div>   
                <div className="profile-name">
                    <h4 className="profileName">{data?.getProfile.name}</h4>
                </div>
                </div>
                <div className="profile-stats">

                   <div className="profile-bar">

                   <ul className="stats">
                  <li className="stat"> 
                  <img src={data?.getProfile.school.logo} className="schoolLogo"></img>
                  <span>{data?.getProfile.school.name}</span> 
                  </li>  
                  <li className="stat"> 
                  <p className="statCount"><span>{data?.getProfile.age}</span></p>
                     <span>Alder</span> 
                  </li>  
                  <li className="stat"> 
                  <p className="statCount"><span>{data?.getProfile.email}</span></p>
                     <span>E-mail</span> 
                  </li>  
                </ul> 
                   </div>
<div className="profile-info">

<div className="profile-place">

</div>


</div>
                   
                </div>
     

     <div className="profile-posts">         
{data?.getPostsFromUser.map(post => (
    <Post key={post.post_id} post_id={post.post_id} createdAt={post.created_at} name={post.name} profilePic={post.profilepic} title={post.title} text={post.text} image={post?.image}/>
))}
     </div>
            </div>
        
        </div>
    )
}
