import './deletepost.css'
import {useMutation,gql} from '@apollo/client';
import {Delete} from '@material-ui/icons';

export default function DeletePost({id}) {
const DELETE_POST_MUTATION = gql`
mutation deletePost($post_id: ID!){
deletePost(post_id: $post_id){
text
}
}
`

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

const [deletePost] = useMutation(DELETE_POST_MUTATION,
    {variables: 
        {post_id:id}
    },{refetchQueries:
    [
    { query: FETCH_POSTS} 
 ]
})

    return (
        <div className="postDelete">
        <Delete className="deletePostBtn" onClick={() => deletePost()}/> 
       </div>
    )

}
