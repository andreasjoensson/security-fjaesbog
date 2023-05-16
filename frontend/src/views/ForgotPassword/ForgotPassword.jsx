import "./forgotpassword.css";
import logo from "../../assets/logo.png";
import { AccountCircleOutlined, MailOutline } from "@material-ui/icons";
import { Lock } from "@material-ui/icons";
import { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/auth";
import { useHistory } from "react-router";
import Spline from "@splinetool/react-spline";

const GLEMT_KODE_QUERY = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const [forgotPassword] = useMutation(GLEMT_KODE_QUERY, {
    update(_, { data: { ForgotPassword: userData } }) {
      console.log("user", userData);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();

    forgotPassword({
      variables: {
        email: email,
      },
    });
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="logo">
          <img src={logo} />
        </div>

        <div className="loginContainer">
          <div className="loginText mb-3">
            <h1>Har du glemt din kode?</h1>
            <p>Bare skriv din e-mail hernede så sender jeg en ny kode ASAP</p>
          </div>

          <form className="loginForm mt-3 " onSubmit={submitLogin}>
            <label>E-mail</label>
            <div className="inputIcons">
              <input
                type="text"
                value={email}
                placeholder="Indtast din e-mail"
                onChange={(e) => setEmail(e.target.value)}
              />
              <AccountCircleOutlined className="icon" />
            </div>

            <button type="submit" className="loginButton">
              Send Email
            </button>

            <a href="/register" className="registerA">
              Har du ikke lavet en konto endnu? Registrer her.
            </a>
          </form>

          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Spline scene="https://prod.spline.design/EGL1Gl-a6rBSjdC8/scene.splinecode" />
    </div>
  );
}
