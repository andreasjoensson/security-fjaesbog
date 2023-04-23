import "./registerstepfive.css";
import RegisterStepper from "./RegisterStepper";
import { gql, useMutation } from "@apollo/client";
import logo from "../logo.png";
import { useHistory } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/auth";

export default function RegisterStepFive({
  nextStep,
  prevStep,
  handleChange,
  user,
  step,
}) {
  const history = useHistory();
  const context = useContext(AuthContext);
  const CREATE_USER_MUTATION = gql`
    mutation CreateUserMutation(
      $createUserName: String!
      $createUserEmail: String!
      $createUserPassword: String!
      $createUserConfirmPassword: String!
      $createUserSchool: SchoolInput!
      $createUserProfilePicture: String!
      $createUserProfileCover: String!
      $createUserAge: String!
    ) {
      createUser(
        name: $createUserName
        email: $createUserEmail
        password: $createUserPassword
        confirmPassword: $createUserConfirmPassword
        school: $createUserSchool
        profilePic: $createUserProfilePicture
        profileCover: $createUserProfileCover
        age: $createUserAge
      ) {
        email
        age
        user_id
        profilepic
        name
        token
      }
    }
  `;

  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION, {
    update(_, { data: { createUser: userData } }) {
      console.log("user", userData);
      context.login(userData);
      history.push("/dashboard");
    },
  });

  const submitUser = (e) => {
    e.preventDefault();

    createUser({
      variables: {
        createUserName: user.name,
        createUserPassword: user.password,
        createUserEmail: user.email,
        createUserConfirmPassword: user.confirmPassword,
        createUserProfileCover: user.coverPic,
        createUserAge: user.age,
        createUserSchool: user.school,
        createUserProfilePicture: user.profilePic,
      },
    });
  };

  if (loading) return "Loading...";

  return (
    <div className="register">
      <div className="register-intro">
        <img src={logo} />
      </div>
      <div className="regContainer">
        <RegisterStepper step={step} />
        <div className="registerContainer">
          <div className="formContainerRegister">
            <div className="registerText">
              <span className="step">Step 1/5</span>
              <h1>Indtast en sikker adgangskode</h1>
              <p>Vælg en lang kode med .@ for at være sikker</p>

              <div className="line"></div>
            </div>

            <div className="registerInput">
              <label>Adgangskode</label>
              <input
                type="password"
                className="register-input"
                placeholder="Indtast en kode"
                onChange={handleChange("password")}
              />

              <label>Bekræft adganskoden</label>
              <input
                type="password"
                className="register-input"
                placeholder="Indtast en bekræftende kode"
                onChange={handleChange("confirmPassword")}
              />

              <button className="registerButton red" onClick={() => prevStep()}>
                Tilbage
              </button>
              <button className="registerButton" onClick={submitUser}>
                Opret
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
