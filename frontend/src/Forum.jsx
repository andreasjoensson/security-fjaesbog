import './forum.css';
import { useParams } from 'react-router';
import {gql, useQuery, useMutation} from '@apollo/client'
import Post from './components/Post/Post';
import Sidebar from './components/Sidebar/Sidebar';
import {useState} from 'react';
import { useContext, useEffect} from 'react';
import { AuthContext } from './context/auth';
import CreatePost from './components/createPost/CreatePost';
import { Accessibility } from '@material-ui/icons';

export default function Forum() {
    let {id} = useParams();
    const [alreadyMember,setAlreadyMember] = useState(false);
    const {user} = useContext(AuthContext);

    const GET_COMMUNITY_QUERY = gql`
    query getCommunity($name: String!){
        getCommunity(name: $name){
            name
            id
            description
            created_at
            members
            profilepic
            coverpic
        }
        getCommunityPosts(name: $name){
            text
            image
            post_id
            title
            user_id
            profilepic
            name
            created_at  
        }
        getCommunityMembers(name: $name){
            users_id
        }
    }
    `

    const JOIN_COMMUNITY_MUTATION = gql`
    mutation addMember($community_id: ID!){
        addMember(community_id: $community_id){
            users_id
            community_id
        }
    }
    `


    const {data,loading} = useQuery(GET_COMMUNITY_QUERY, {variables: {
        name: id
    }})

 const [joinCommunity] = useMutation(JOIN_COMMUNITY_MUTATION, {refetchQueries:
    [
    { query: GET_COMMUNITY_QUERY,
      variables: {name: id}
    },
    
  ]
});

useEffect(() => {
    setAlreadyMember(data?.getCommunityMembers.filter(member => member.users_id == user.user_id).length > 0)
}, [data])


    return (
        <div className="container">
<Sidebar currentPage={id}/>
            <div className="communityContainer">
<div className="communityCover">
 <img src={data?.getCommunity.coverpic} className="communityCoverImg"/>   
</div>
<div className="communityBar">

    <div className="communityInfo">
      <div className="communityProfilePic">
        <img src={data?.getCommunity.profilepic} className="communityProfilePicImg"/>
    </div>
    <div className="communityJoin">
    <h2>{data?.getCommunity.name}</h2>    
    {alreadyMember ?  <button className="joinCommunity leave" onClick={() => joinCommunity({variables: {
        community_id: data?.getCommunity.id
    }})}>Forlad</button>
        : <button className="joinCommunity" onClick={() => joinCommunity({variables: {
            community_id: data?.getCommunity.id
        }})}>Join</button> }
    
    </div>
    <div className="communityMembers">
    <Accessibility fontSize="large"/>
<span>{data?.getCommunity.members} medlemmer</span>
    </div>
    </div>
    <div className="communityDescription">
     <p>{data?.getCommunity.description}</p>    
    </div>
   

</div>
          
<div className="communityFlexContainer">

{alreadyMember ? 
<>
<div className="communityPostContainer">
<CreatePost personal={false} community_id={data?.getCommunity.id} community={id}/>
{data?.getCommunityPosts.map(post => (
    <Post key={post.post_id} post_id={post.post_id} createdAt={post.created_at} name={post.name} profilePic={post.profilepic} title={post.title} text={post.text} image={post?.image}/>
  ))}        
</div> 
</>
: <div> <h2 className="noaccess">Join den her community, før du kan oprette og se opslag....</h2> </div>}

  


</div>


    </div>

        </div>
    )
}
