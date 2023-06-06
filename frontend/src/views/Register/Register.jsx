import "./register.css";
import logo from "../../assets/logo.png";
import { useState } from "react";
import RegisterStepOne from "../../components/RegisterSteps/StepOne/RegisterStepOne";
import RegisterStepTwo from "../../components/RegisterSteps/StepTwo/RegisterStepTwo";
import RegisterStepThree from "../../components/RegisterSteps/StepThree/RegisterStepThree";
import RegisterStepFour from "../../components/RegisterSteps/StepFour/RegisterStepFour";
import RegisterStepFive from "../../components/RegisterSteps/StepFive/RegisterStepFive";
import RegisterStepper from "../../components/Stepper/RegisterStepper";

function RegisterMainComponent({ step, setUser, user }) {
  const changeAge = (e) => {
    setUser((prevState) => ({
      ...prevState,
      age: e.target.value ? e.target.value : "",
    }));
  };

  // Proceed to next step
  const nextStep = () => {
    const { step } = user;

    setUser((prevState) => ({
      ...prevState,
      step: step + 1,
    }));
  };

  // Go back to prev step
  const prevStep = () => {
    const { step } = user;
    setUser((prevState) => ({
      ...prevState,
      step: step - 1,
    }));
  };

  const chooseSchool = (school) => {
    console.log(school);
    setUser((prevState) => ({
      ...prevState,
      school: school,
    }));
  };

  const changeProfilePic = (pic) => {
    setUser((prevState) => ({
      ...prevState,
      profilePic: pic,
    }));
  };

  const changeProfileCover = (pic) => {
    setUser((prevState) => ({
      ...prevState,
      coverPic: pic,
    }));
  };

  // Handle fields change
  const handleChange = (input) => (e) => {
    setUser((prevState) => ({
      ...prevState,
      [input]: e.target.value,
    }));
  };

  switch (step) {
    case 1:
      return (
        <RegisterStepOne
          nextStep={nextStep}
          handleChange={handleChange}
          prevStep={prevStep}
          changeAge={changeAge}
          user={user}
          step={step}
        />
      );
    case 2:
      return (
        <RegisterStepTwo
          nextStep={nextStep}
          handleChange={handleChange}
          prevStep={prevStep}
          chooseSchool={chooseSchool}
          user={user}
          step={step}
        />
      );
    case 3:
      return (
        <RegisterStepThree
          nextStep={nextStep}
          changeProfilePic={changeProfilePic}
          changeProfileCover={changeProfileCover}
          prevStep={prevStep}
          user={user}
          step={step}
        />
      );
    case 4:
      return (
        <RegisterStepFour
          nextStep={nextStep}
          handleChange={handleChange}
          prevStep={prevStep}
          user={user}
          step={step}
        />
      );
    case 5:
      return (
        <RegisterStepFive
          nextStep={nextStep}
          handleChange={handleChange}
          prevStep={prevStep}
          user={user}
          step={step}
        />
      );
    default:
      console.log("This is a multi-step form built with React.");
  }
}

const Register = () => {
  const [user, setUser] = useState({
    step: 1,
    name: "",
    age: null,
    school: "",
    profilePic: "",
    coverPic: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { step } = user;

  return (
    <div className="register">
      <div className="container-fluid h-100">
        <div className="row register-container h-100">
          <div
            className="col-3 reg-steps h-100"
            style={{ background: "black" }}
          >
            <div className="logo logo-white">
              <img src={logo} alt="Logo af Fjæsbog" />
            </div>
            <RegisterStepper step={step} />
          </div>

          <div className="col-9 reg-comp h-100">
            <RegisterMainComponent step={step} setUser={setUser} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
