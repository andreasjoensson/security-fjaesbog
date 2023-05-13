import "./comments.css";
import { gql, useQuery } from "@apollo/client";
import Comment from "../Comment/Comment";

export default function Comments({ post_id }) {
  const GET_COMMENTS_QUERY = gql`
    query getComments($post_id: ID!) {
      getComments(post_id: $post_id) {
        text
        name
        profilepic
        id
        created_at
        user_id
      }
    }
  `;

  const { data, loading } = useQuery(GET_COMMENTS_QUERY, {
    variables: { post_id: post_id },
  });

  if (loading)
    return (
      <div class="lds-circle">
        <div></div>
      </div>
    );

  return (
    <div>
      {data?.getComments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          post_id={post_id}
          text={comment.text}
          name={comment.name}
          profilepic={comment.profilepic}
          createdAt={comment.created_at}
        />
      ))}
    </div>
  );
}
