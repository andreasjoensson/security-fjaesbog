import "./forgotpassword.css";
import logo from "../../assets/logo.png";
import { AccountCircleOutlined, MailOutline } from "@material-ui/icons";
import { Lock } from "@material-ui/icons";
import { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/auth";
import { useHistory } from "react-router";
import "./ResetKode.css";
import Spline from "@splinetool/react-spline";

const GLEMT_KODE_QUERY = gql`
  mutation login($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      token
      user_id
      email
      password
      age
      profilepic
      profilecover
      name
    }
  }
`;

export default function ResetKode() {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [login] = useMutation(GLEMT_KODE_QUERY, {
    update(_, { data: { login: userData } }) {
      console.log("user", userData);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();

    login({
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
            <h1>Reset din kode her?</h1>
            <p>Vælg en kode som er svær at bryde.</p>
          </div>

          <form className="loginForm mt-3 " onSubmit={submitLogin}>
            <label>Ny kode</label>
            <div className="inputIcons">
              <input
                type="password"
                placeholder="Indtast dit password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="icon" />
            </div>

            <button type="submit" className="loginButton">
              Reset kode
            </button>
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
