import './registerstepthree.css'
import RegisterStepper from './RegisterStepper'
import logo from '../logo.png';
import { uploadImage } from '../firebase';
import { AccountCircle, Photo } from '@material-ui/icons';
import {useState} from 'react';

export default function RegisterStepThree({nextStep,prevStep,user,changeProfilePic,changeProfileCover,step}) {
const [profilePic, setProfilePic] = useState("https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png");
const [coverPic, setCoverPic] = useState("https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png");

const addProfilePic = async e =>{
const image = await uploadImage(e.target.files[0])
changeProfilePic(image);
setProfilePic(image)    
}

const addProfileCover = async e => {
const image = await uploadImage(e.target.files[0])
changeProfileCover(image);
setCoverPic(image)    
}


    return (
        <div className="register">
        <div className="register-intro">
            <img src={logo}/>
        </div>
    <div className="regContainer">
        <RegisterStepper step={step}/>
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
  <label for="file-input-cover">
  <img src={coverPic} className="profileCoverPic"/>
  </label>
  <input id="file-input-cover" type="file" onChange={(e) => addProfileCover(e)}/>
</div>
  <div className="profilePicture">
  <div class="image-upload">
  <label for="file-input">
  <img src={profilePic} className="profilePicturePic"/>
  </label>
  <input id="file-input" type="file" onChange={(e) => addProfilePic(e)}/>
</div>
</div>
<div className="profile-name-register">
<h4>{user.name}</h4>
</div>
</div>



</div>

    <div className="registerInput">

    <button className="registerButton red" onClick={() => prevStep()}>Tilbage</button>
    <button className="registerButton" onClick={() => nextStep()}>Næste skridt</button>
    </div>
    
    </div>
            </div>
            </div>
            </div>
    )
}
