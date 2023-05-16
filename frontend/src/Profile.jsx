import "./profile.css";
import { useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import schoolLogo from "../src/assets/school.png";
import { useQuery, gql } from "@apollo/client";
import Post from "./components/Post/Post";
import { useEffect } from "react";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import CreatePost from "./components/createPost/CreatePost";

export default function Profile() {
  let { id } = useParams();

  const GET_USER_POSTS = gql`
    query getPostsFromUser($name: String!) {
      getPostsFromUser(name: $name) {
        text
        image
        post_id
        title
        user_id
        profilepic
        name
        created_at
      }
      getProfile(name: $name) {
        user_id
        name
        age
        email
        profilepic
        school {
          logo
          name
        }
        profilecover
        created_at
      }
    }
  `;

  const { data, loading } = useQuery(GET_USER_POSTS, {
    variables: { name: id },
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  if (loading)
    return (
      <div class="lds-circle">
        <div></div>
      </div>
    );

  return (
    <div className="profilePage">
      <Sidebar currentPage={"profile"} />
      <div className="profile-container">
        <div className="profile-cover">
          <img
            src={
              data?.getProfile.profilecover
                ? data?.getProfile.profilecover
                : "https://kea.dk/slir/w585-c100x50/images/DA/Om-KEA/KEA_Okt_17_136_Hi-Res.jpg"
            }
            className="profileCover"
          />
        </div>

        <div className="profile-section">
          <div className="profile-stats">
            <div className="profile-pic">
              <img
                src={
                  data?.getProfile.profilepic
                    ? data?.getProfile.profilepic
                    : "https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png"
                }
                className="profilePic me-3"
              />
            </div>
            <div className="profile-name">
              <h4 className="profileName">{data?.getProfile.name}</h4>
            </div>
          </div>
          <div className="profile-bar">
            <ul className="stats">
              <li className="stat">
                <img src={schoolLogo} className="schoolLogo mb-3"></img>
                <span>{data?.getProfile.school.name}</span>
              </li>
              <li className="stat">
                <p className="statCount">
                  <span>{data?.getProfile.age}</span>
                </p>
                <span>Alder</span>
              </li>
              <li className="stat">
                <p className="statCount">
                  <span>{data?.getProfile.email}</span>
                </p>
                <span>E-mail</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="profile-posts">
          {data?.getPostsFromUser.length === 0 ? (
            <div className="notFound d-flex justify-content-center">
              <CameraAltOutlinedIcon style={{ fontSize: 40 }} />
              <h5 className="mt-3">Ingen opslag endnu</h5>
            </div>
          ) : (
            <div>
              {data?.getPostsFromUser.map((post) => (
                <Post
                  key={post.post_id}
                  post_id={post.post_id}
                  createdAt={post.created_at}
                  name={post.name}
                  profilePic={post.profilepic}
                  title={post.title}
                  text={post.text}
                  image={post?.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
