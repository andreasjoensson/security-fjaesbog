import { ArrowDownwardOutlined } from "@material-ui/icons";
import { ArrowDownward, ArrowUpwardOutlined } from "@material-ui/icons";
import "./comment.css";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import CommentDislike from "../Reactions/CommentDislike";
import Like from "../Reactions/Like";
import CommentLike from "../Reactions/CommentLike";
import moment from "moment";
import "moment/locale/da";
import DeleteComment from "../DeleteComment/DeleteComment";

export default function Comment({
  id,
  text,
  profilepic,
  name,
  createdAt,
  post_id,
}) {
  const [alreadyLiked, setLiked] = useState(false);
  const [alreadyDisliked, setDisliked] = useState(false);
  const { user } = useContext(AuthContext);
  moment.locale();

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
  `;

  const { data, loading } = useQuery(GET_LIKES_COUNT, {
    variables: {
      comment_id: id,
    },
  });

  useEffect(() => {
    setLiked(
      data?.getCommentLikes.likes.filter((e) => e.user_id == user.user_id)
        .length > 0
    );
    setDisliked(
      data?.getCommentLikes.dislikes.filter((e) => e.user_id == user.user_id)
        .length > 0
    );
  }, [data]);

  if (loading)
    return (
      <div class="lds-circle">
        <div></div>
      </div>
    );

  return (
    <div className="comment">
      <div className="profilePicComment">
        <img src={profilepic} className="userPicComment" />
      </div>

      <div className="commentContainer">
        <div className="commentBubble">
          <h3>{name}</h3>
          <p>{text}</p>
        </div>

        <div className="commentBottom">
          <div className="reactions">
            <CommentLike comment_id={id} alreadyLiked={alreadyLiked} />
            <CommentDislike comment_id={id} alreadyDisliked={alreadyDisliked} />
            <p className="commentLikes">{data?.getCommentLikes.likeCount}</p>
          </div>
        </div>
        {user.name == name ? (
          <DeleteComment comment_id={id} post_id={post_id} />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
