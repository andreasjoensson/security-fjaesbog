import { ArrowUpwardOutlined } from '@material-ui/icons'
import { useContext } from 'react'
import { AuthContext } from '../../context/auth'
import {gql, useMutation} from '@apollo/client'
import './commentlike.css'

export default function CommentLike({comment_id, alreadyLiked}) {
    const {user} = useContext(AuthContext);

    const LIKE_COMMENT_MUTATION = gql`
    mutation likeComment($user_id: ID!, $comment_id: ID!){
    likeComment(user_id:$user_id, comment_id: $comment_id){
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


    const [likeComment] = useMutation(LIKE_COMMENT_MUTATION,{variables: {
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
        <div className="like">
        <ArrowUpwardOutlined color={`${alreadyLiked == true ? 'primary' : 'disabled'}`} onClick={likeComment}/>
        </div>   
    )
}
