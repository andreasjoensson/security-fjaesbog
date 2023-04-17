import { DeleteForeverOutlined } from '@material-ui/icons';
import './deletecomment.css';
import {gql, useMutation} from '@apollo/client';

const DELETE_COMMENT_QUERY = gql`
mutation deleteComment($comment_id: ID!){
deleteComment(comment_id: $comment_id){
    text
}
}
`

const GET_COMMENTS = gql`
query getComments($post_id: ID!){
    getComments(post_id: $post_id){
        text
        name
        profilepic
        id
        created_at
        user_id
    }
}
`



export default function DeleteComment({comment_id, post_id}) {

    const [deleteComment] = useMutation(DELETE_COMMENT_QUERY,{refetchQueries:
        [
        { query: GET_COMMENTS, variables:{post_id: post_id}} 
     ]
    });

    const submitDeleteComment = e => {
        e.preventDefault();
        deleteComment({variables: {
           comment_id: comment_id
        }})
    }

    return (
            <DeleteForeverOutlined className="deleteCommentBtn" onClick={(e) => submitDeleteComment(e)}/>
    )
}
