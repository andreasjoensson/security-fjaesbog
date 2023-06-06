import "./registerstepfive.css";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth";
import { useState } from "react";
import validator from "validator";
import { Redirect } from "react-router-dom";

export default function RegisterStepFive({
  nextStep,
  prevStep,
  handleChange,
  user,
  step,
}) {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  //creating error state for validation
  const [error, setError] = useState(false);
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
      setLoggedIn(true); // Set loggedIn state to trigger the redirect
    },
  });

  if (loggedIn) {
    // Redirect to the protected route after successful login
    return <Redirect to="/dashboard" />;
  }

  // after form submit validating the form data using validator
  const submitFormData = (e) => {
    e.preventDefault();

    // checking if value of first name and last name is empty show error else take to step 2
    if (
      validator.isEmpty(user.password) ||
      validator.isEmpty(user.confirmPassword) ||
      user.password !== user.confirmPassword
    ) {
      console.log("fejl");
      setError(true);
    } else {
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
    }
  };

  return (
    <div className="regContainer h-100 align-items-center">
      <div className="registerContainer">
        <div className="formContainerRegister">
          <div className="registerText">
            <span className="step">Step {step}/5</span>
            <h1>Indtast en sikker adgangskode</h1>
            <p>Vælg en lang kode med .@ for at være sikker</p>

            <div className="line"></div>
          </div>

          <div className="registerInput">
            <label>Adgangskode</label>
            <input
              type="password"
              style={{ border: error ? "2px solid red" : "" }}
              className="register-input"
              placeholder="Indtast en kode"
              onChange={handleChange("password")}
            />

            <label>Bekræft adganskoden</label>
            <input
              type="password"
              style={{ border: error ? "2px solid red" : "" }}
              className="register-input"
              placeholder="Indtast en bekræftende kode"
              onChange={handleChange("confirmPassword")}
            />

            <div className="button-container d-flex justify-content-end">
              <button className="registerButton red" onClick={() => prevStep()}>
                Tilbage
              </button>

              {loading ? (
                <button
                  type="submit"
                  className="registerButton ms-3 d-flex justify-content-center"
                >
                  Opretter....{" "}
                  <div
                    className="spinner-grow spinner-grow-sm ms-3"
                    role="status"
                  ></div>
                </button>
              ) : (
                <button
                  className="registerButton ms-3"
                  onClick={submitFormData}
                >
                  Opret
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
