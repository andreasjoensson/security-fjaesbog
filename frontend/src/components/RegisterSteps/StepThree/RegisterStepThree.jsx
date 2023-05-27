import "./registerstepthree.css";
import { uploadImage } from "../../../firebase";
import { useState } from "react";

export default function RegisterStepThree({
  nextStep,
  prevStep,
  user,
  changeProfilePic,
  changeProfileCover,
  step,
}) {
  const [profilePic, setProfilePic] = useState(
    "https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png"
  );
  const [coverPic, setCoverPic] = useState(
    "https://9cover.com/images/ccovers/1465154898raining-numbers-simple.jpg"
  );

  const addProfilePic = async (e) => {
    const image = await uploadImage(e.target.files[0]);
    console.log("image", image);
    changeProfilePic(image);
    setProfilePic(image);
  };

  const addProfileCover = async (e) => {
    const image = await uploadImage(e.target.files[0]);
    changeProfileCover(image);
    setCoverPic(image);
  };

  return (
    <div className="regContainer h-100 align-items-center">
      <div className="registerContainer">
        <div className="formContainerRegister">
          <div className="registerText">
            <span className="step">Step {step}/5</span>
            <h1>Lad os se dig</h1>
            <p>Upload dit profilbillede og coverbillede</p>

            <div className="line"></div>
          </div>

          <div className="profileContainer">
            <div className="profileCover">
              <div class="image-upload">
                <label for="file-input-cover" className="w-100">
                  <img src={coverPic} className="profileCoverPic" />
                </label>
                <input
                  id="file-input-cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => addProfileCover(e)}
                />
              </div>
              <div className="profilePicture">
                <div class="image-upload">
                  <label for="file-input">
                    <img src={profilePic} className="profilePicturePic" />
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => addProfilePic(e)}
                  />
                </div>
              </div>
              <div className="profile-name-register">
                <h4>{user.name}</h4>
              </div>
            </div>
          </div>

          <div className="button-container mt-5 d-flex justify-content-end">
            <button className="registerButton red" onClick={() => prevStep()}>
              Tilbage
            </button>
            <button className="registerButton ms-3" onClick={() => nextStep()}>
              Videre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
