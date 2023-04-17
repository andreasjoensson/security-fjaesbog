import './commentdislike.css'
import { ArrowDownwardOutlined } from '@material-ui/icons'
import {gql, useMutation} from '@apollo/client'; 
import { AuthContext } from '../../context/auth';
import {useContext} from 'react';

export default function CommentDislike({comment_id, alreadyDisliked}) {
    const {user} = useContext(AuthContext)    
    const LIKE_COMMENT_MUTATION = gql`
    mutation dislikeComment($user_id: ID!, $comment_id: ID!){
    dislikeComment(user_id:$user_id, comment_id: $comment_id){
        user_id
    }
    }
    `
    const GET_LIKES_COUNT = gql`
query getCommentLikes($comment_id: ID!) {
    getCommentLikes(comment_id: $comment_id) {
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


    const [dislikeComment] = useMutation(LIKE_COMMENT_MUTATION,{variables: {
        user_id: user.user_id,
        comment_id: comment_id
    }, 
    refetchQueries: [
      {
        query: GET_LIKES_COUNT,
        variables: { comment_id: comment_id }
      }
    ]});

    

    return (
        <div className="dislike">
        <ArrowDownwardOutlined color={`${alreadyDisliked == true ? 'error' : 'disabled'}`} onClick={dislikeComment}/>
       </div>
    )
}
