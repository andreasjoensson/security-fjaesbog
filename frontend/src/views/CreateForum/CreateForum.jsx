import Sidebar from "../../components/Sidebar/Sidebar";
import "./createforum.css";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { uploadImage } from "../../firebase";
import { useHistory } from "react-router";

export default function CreateForum() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();
  const [coverPic, setCoverPic] = useState(
    "https://wallpaperstock.net/blue-abstract-background_wallpapers_41955_852x480.jpg"
  );
  const [profilePic, setProfilePic] = useState(
    "https://www.pudsprodukter.dk/wp-content/uploads/2016/08/facebook-default-no-profile-pic.jpg"
  );

  const CREATE_COMMUNITY_QUERY = gql`
    mutation createCommunity(
      $name: String!
      $description: String!
      $profilepic: String!
      $coverpic: String!
    ) {
      createCommunity(
        name: $name
        description: $description
        profilepic: $profilepic
        coverpic: $coverpic
      ) {
        description
      }
    }
  `;
  const submitCommunity = (e) => {
    e.preventDefault();
    createCommunity();
  };

  const [createCommunity] = useMutation(CREATE_COMMUNITY_QUERY, {
    variables: {
      name: name,
      description: description,
      profilepic: profilePic,
      coverpic: coverPic,
    },
    onCompleted() {
      history.push(`/forum/${name}`);
    },
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar currentPage={"opretforum"} />
        <div className="col-9">
          <div className="image-upload">
            <label htmlFor="file-input-cover" className="w-100">
              <img
                alt="Nyt coverbillede til oprettelse af forum"
                src={coverPic}
                className="profileCoverPic"
              />
            </label>
            <input
              id="file-input-cover"
              type="file"
              onChange={async (e) =>
                await setCoverPic(await uploadImage(e.target.files[0]))
              }
            />
            <div className="image-upload">
              <label htmlFor="file-input">
                <img
                  alt="Nyt profilbillede til oprettelse af forum"
                  src={profilePic}
                  className="profilePicturePic"
                />
              </label>
              <input
                id="file-input"
                type="file"
                onChange={async (e) =>
                  await setProfilePic(await uploadImage(e.target.files[0]))
                }
              />
            </div>
          </div>

          <div className="createForum mt-5">
            <form>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Navn til forum</label>
                <input
                  type="text"
                  placeholder="r/"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
                <small id="emailHelp" className="form-text text-muted">
                  Indtast et navn til dit forum, kan ikke fortrydes.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">
                  Beskrivelse af forum
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kort beskrivelse..."
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={submitCommunity}
              >
                Opret forum
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
