import { gql, useMutation } from '@apollo/client';
import { ThumbDown, ThumbDownOutlined } from '@material-ui/icons';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';
import './dislike.css';

export default function Dislike({postID,alreadyDisliked}) {
    const {user} = useContext(AuthContext);

    const DISLIKE_POST_MUTATION = gql`
    mutation dislikePost($user_id: ID!, $post_id: ID!){
    dislikePost(user_id:$user_id, post_id: $post_id){
        user_id
        id
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
 
 
 
    const [dislikePost] = useMutation(DISLIKE_POST_MUTATION, {variables: {
        user_id: user.user_id,
        post_id: postID
    },  refetchQueries: [
        {
          query: GET_LIKES_COUNT,
          variables: { post_id: postID }
        }
      ]});

    return (
        <>
        <ThumbDownOutlined className="dislikeButton" color={`${alreadyDisliked == true ? 'error' : 'disabled'}`} onClick={dislikePost}/>
        </>
    )
    }
    