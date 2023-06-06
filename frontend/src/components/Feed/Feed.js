import { ExitToApp, ExpandMoreOutlined, Search } from "@material-ui/icons";
import "./feed.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import Post from "../Post/Post";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/auth";
import CreatePost from "../createPost/CreatePost";
import DOMPurify from "dompurify";

function Feed() {
  const { logout, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const history = useHistory();

  const FETCH_POSTS = gql`
    query getPosts {
      getPosts {
        text
        image
        post_id
        community_id
        title
        user_id
        profilepic
        name
        created_at
        isprivate
      }
    }
  `;

  const MAKE_POST_PRIVATE = gql`
    mutation MakePostPrivate($post_id: ID!) {
      makePostPrivate(post_id: $post_id) {
        user_id
      }
    }
  `;

  const MAKE_POST_PUBLIC = gql`
    mutation MakePostPublic($post_id: ID!) {
      makePostPublic(post_id: $post_id) {
        user_id
      }
    }
  `;

  const [makePostPrivate] = useMutation(MAKE_POST_PRIVATE, {
    refetchQueries: [{ query: FETCH_POSTS }], // Refetch the GET_POSTS query after making a post public
  });
  const [makePostPublic] = useMutation(MAKE_POST_PUBLIC, {
    refetchQueries: [{ query: FETCH_POSTS }], // Refetch the GET_POSTS query after making a post public
  });

  const logoutFunc = (e) => {
    e.preventDefault();
    logout();
    history.push("/");
  };

  const { data, loading } = useQuery(FETCH_POSTS);

  useEffect(() => {
    // Reverse the order of the list
    if (data) {
      console.log(data.getPosts);
      const reversedPosts = [...data?.getPosts].reverse();
      setPosts(reversedPosts);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <div className="lds-circle">
          <div></div>
        </div>
      ) : (
        <div className="feed col-9">
          <div className="topbar">
            <div className="currentUser">
              <div className="currentUserContainer">
                <div className="userImage">
                  <img
                    src={
                      user.profilepic.length > 0
                        ? user.profilepic
                        : "https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png"
                    }
                    alt=""
                  />
                </div>
                <div className="userInformation ms-3 me-3">
                  <h4>{user.name}</h4>
                  <span>{user.age}</span>
                </div>
              </div>

              <a className="logout" onClick={logoutFunc}>
                <ExitToApp />
              </a>
            </div>
          </div>

          <div className="postContainer">
            <CreatePost personal={true} />
            {posts.map((post) => (
              <Post
                key={DOMPurify.sanitize(post.post_id)}
                post_id={DOMPurify.sanitize(post.post_id)}
                createdAt={DOMPurify.sanitize(post.created_at)}
                name={DOMPurify.sanitize(post.name)}
                profilePic={DOMPurify.sanitize(post.profilepic)}
                title={DOMPurify.sanitize(post.title)}
                user_id={DOMPurify.sanitize(post.user_id)}
                text={DOMPurify.sanitize(post.text)}
                community_id={DOMPurify.sanitize(post.community_id)}
                private_post={DOMPurify.sanitize(post.isprivate)}
                image={DOMPurify.sanitize(post?.image)}
                makePostPublic={makePostPublic}
                makePostPrivate={makePostPrivate}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Feed;
