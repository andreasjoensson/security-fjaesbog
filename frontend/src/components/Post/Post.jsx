import { gql, useMutation, useQuery } from "@apollo/client";
import { CommentOutlined, Send } from "@material-ui/icons";
import DOMPurify from "dompurify";
import moment from "moment";
import "moment/locale/da";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import Comments from "../Comments/Comments";
import CommunityFeat from "../CommunityFeat/CommunityFeat";
import DeletePost from "../DeletePost/DeletePost";
import PostButtons from "../PostStatus/PostStatus";
import Dislike from "../Reactions/Dislike";
import Like from "../Reactions/Like";
import "./post.css";

function Post({
  post_id,
  name,
  profilePic,
  createdAt,
  title,
  text,
  user_id,
  image,
  community_id,
  private_post,
  makePostPublic,
  makePostPrivate,
}) {
  const { user } = useContext(AuthContext);
  const [alreadyLiked, setLiked] = useState(false);
  const [alreadyDisliked, setDisliked] = useState(false);
  const [comment, setComment] = useState("");
  moment.locale();

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
  `;

  const SEND_MESSAGE_MUTATION = gql`
    mutation createComment($post_id: ID!, $text: String!) {
      createComment(post_id: $post_id, text: $text) {
        user_id
      }
    }
  `;
  const GET_COMMENTS_QUERY = gql`
    query getComments($post_id: ID!) {
      getComments(post_id: $post_id) {
        text
        name
        profilepic
        created_at
        user_id
      }
    }
  `;

  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    variables: {
      post_id: post_id,
      text: comment,
    },
    refetchQueries: [
      {
        query: GET_COMMENTS_QUERY,
        variables: { post_id: post_id },
      },
    ],
  });

  const { data, loading } = useQuery(GET_LIKES_COUNT, {
    variables: {
      post_id: post_id,
    },
  });

  useEffect(() => {
    setLiked(
      data?.getLikes.likes.filter((e) => e.user_id === user.user_id).length > 0
    );
    setDisliked(
      data?.getLikes.dislikes.filter((e) => e.user_id === user.user_id).length >
        0
    );
  }, [data]);

  if (loading)
    return (
      <div className="lds-circle">
        <div></div>
      </div>
    );

  return (
    <div className="post">
      <div className="post-top-bar">
        {!community_id || parseInt(community_id) <= 0 ? (
          "Postet på egen profil"
        ) : (
          <CommunityFeat community_id={community_id} />
        )}
      </div>
      <hr></hr>
      <div className="postUser">
        <div className="postUserImage">
          <img src={profilePic} alt="" className="postProfilePic" />
        </div>
        <div className="postUserInformation">
          <h3>{DOMPurify.sanitize(name)}</h3>
          <span>{moment(createdAt).fromNow()}</span>
        </div>

        {user.name === name ? <DeletePost id={post_id} /> : <p></p>}
        <PostButtons
          user_id={user.user_id}
          post_id={post_id}
          author_id={user_id}
          isPrivate={private_post}
          makePostPrivate={makePostPrivate}
          makePostPublic={makePostPublic}
        />
      </div>
      <div className="postContent">
        <h3>{DOMPurify.sanitize(title)}</h3>
        <p>{DOMPurify.sanitize(text)}</p>
        {image !== "" || "" ? (
          <img
            src={image}
            alt="Profilbillede til opslaget"
            className="postPicture"
          />
        ) : (
          <p></p>
        )}
      </div>

      <div className="postBottom">
        <div className="postComments">
          <CommentOutlined />
          <p>Kommentar</p>
        </div>

        <div className="postLikes">
          <Like postID={post_id} alreadyLiked={alreadyLiked} />
          <Dislike postID={post_id} alreadyDisliked={alreadyDisliked} />
          <p>{data?.getLikes.likeCount} Likes</p>
          <p></p>
        </div>
      </div>

      <div className="postComment">
        <img
          alt="Profilbillede til kommentar"
          src={
            user.profilepic.length > 0
              ? user.profilepic
              : "https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png"
          }
          className="postProfilePic"
        />
        <input
          type="text"
          placeholder="Skriv din kommentar"
          onChange={(e) => setComment(e.target.value)}
        />
        <Send className="sendComment" color="disabled" onClick={sendMessage} />
      </div>
      <Comments post_id={post_id} />
    </div>
  );
}

export default Post;
