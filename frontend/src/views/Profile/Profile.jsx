import "./profile.css";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import schoolLogo from "../../assets/school.png";
import { useQuery, gql } from "@apollo/client";
import Post from "../../components/Post/Post";
import { useEffect } from "react";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";

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
    }
  `;

  const GET_USER_PROFILE = gql`
    query GetProfile($name: String!) {
      getProfile(name: $name) {
        user_id
        name
        password
        age
        school {
          name
          logo
        }
        email
        profilepic
        profilecover
        token
        created_at
        last_login
      }
    }
  `;

  const {
    data: userPostsData,
    loading: userPostsLoading,
    error: userPostsError,
  } = useQuery(GET_USER_POSTS, {
    variables: { name: id },
  });

  const {
    data: userProfileData,
    loading: userProfileLoading,
    error: userProfileError,
  } = useQuery(GET_USER_PROFILE, {
    variables: { name: id },
  });

  useEffect(() => {
    console.log("profil", userPostsData);
    console.log("error", userPostsError);
    console.log("userProfileData.", userProfileData);
    console.log("userProfileError", userProfileError);
  }, [userPostsData, userPostsError]);

  if (userPostsLoading || userProfileLoading)
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
              userProfileData?.getProfile.profilecover
                ? encodeURIComponent(userProfileData?.getProfile.profilecover)
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
                  userProfileData.getProfile.profilepic
                    ? encodeURIComponent(userProfileData.getProfile.profilepic)
                    : "https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png"
                }
                className="profilePic me-3"
              />
            </div>
            <div className="profile-name">
              <h4 className="profileName">{userProfileData.getProfile.name}</h4>
            </div>
          </div>
          <div className="profile-bar">
            <ul className="stats">
              <li className="stat">
                <img src={schoolLogo} className="schoolLogo mb-3"></img>
                <span>{userProfileData.getProfile.school.name}</span>
              </li>
              <li className="stat">
                <p className="statCount">
                  <span>{userProfileData.getProfile.age}</span>
                </p>
                <span>Alder</span>
              </li>
              <li className="stat">
                <p className="statCount">
                  <span>{userProfileData.getProfile.email}</span>
                </p>
                <span>E-mail</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="profile-posts">
          {userPostsData.getPostsFromUser.length === 0 ? (
            <div className="notFound d-flex justify-content-center">
              <CameraAltOutlinedIcon style={{ fontSize: 40 }} />
              <h5 className="mt-3">Ingen opslag endnu</h5>
            </div>
          ) : (
            <div>
              {userPostsData.getPostsFromUser.map((post) => (
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
