import { gql, useMutation } from '@apollo/client';
import { ThumbUp, ThumbUpOutlined } from '@material-ui/icons';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';
import './like.css';

export default function Like({postID, alreadyLiked}) {
    const {user} = useContext(AuthContext);

    const LIKE_POST_MUTATION = gql`
    mutation likePost($user_id: ID!, $post_id: ID!){
    likePost(user_id:$user_id, post_id: $post_id){
        user_id
    }
    }
    `
    const GET_LIKES_COUNT = gql`
query getLikes($post_id: ID!) {
    getLikes(post_id: $post_id) {
        likes {
            user_id
          }
          dislikes {
            user_id
          }
  likeCount
    }
  }
`


    const [likePost] = useMutation(LIKE_POST_MUTATION,{variables: {
        user_id: user.user_id,
        post_id: postID
    }, 
    refetchQueries: [
      {
        query: GET_LIKES_COUNT,
        variables: { post_id: postID }
      }
    ]});

    

    return (
        <div>
        <ThumbUpOutlined className="likeButton" color={`${alreadyLiked == true ? 'primary' : 'disabled'}`} onClick={likePost} />
        </div> 
    )
}
