import {gql, useMutation} from '@apollo/client'
import {useState} from 'react';
import { Image } from '@material-ui/icons';
import { Send } from '@material-ui/icons';
import './createPost.css'
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';
import { uploadImage } from '../../firebase';

function CreatePost({personal, community_id,community}) {
    const [title,setTitle] = useState('');
    const {user} = useContext(AuthContext);
    const [text,setText] = useState('');
    const [image,setImage] = useState("");
    const FETCH_POSTS = gql`
    query getPosts{
      getPosts {
      text
    image
    title
    user_id
    created_at  
      }
    }
    `
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
    
    
    const CREATE_POST_MUTATION = gql`
    mutation createPost($title: String!, $text: String!, $image: String, $community_id: ID!){
    createPost(title: $title, text: $text, image: $image, community_id: $community_id){
    text
    title
    user_id
    }
    }
    `

    const [createPost] = useMutation(CREATE_POST_MUTATION, {refetchQueries:
        [
        { query: FETCH_POSTS}, {query: GET_COMMUNITY_QUERY,
          variables: {name: community}}
      ]
    });
    
    
    const submitPost = e => {
        e.preventDefault();
        createPost({variables: {
            title: title,
            text:text,
            image:image,
            community_id: personal ? 0 : community_id
        }})
    }



    return (
        <div className="createPost">
        <h3>Lav opslag</h3>
        <div className="line"></div>
        <div className="createPostInput">
        <img src={user?.profilepic} className="inputProfilePic"/>
        <div className="input-post">
          <div className="titel-input">
        <input type="text" placeholder="Titel" className="postInput" onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="text-input">
         <input type="text" placeholder="Hvad har du i tankerne..." className="postInput" onChange={(e) => setText(e.target.value)}/>
        <Send className="sendIcon" onClick={submitPost}/>

        <div class="image-upload">
  <label for="file-input-cover">
 <Image className="imageIcon"/>
  </label>
  <input id="file-input-cover" type="file" onChange={async(e) => await setImage(await uploadImage(e.target.files[0]))}/>
</div>
          
        </div>
        </div>
        
       
        </div>
    </div>
    
    )
}

export default CreatePost
