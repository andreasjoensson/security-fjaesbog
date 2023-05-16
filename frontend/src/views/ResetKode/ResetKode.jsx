import "./forgotpassword.css";
import logo from "../../assets/logo.png";
import { Lock } from "@material-ui/icons";
import { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import "./ResetKode.css";
import Spline from "@splinetool/react-spline";

const GLEMT_KODE_QUERY = gql`
  mutation ResetKode($token: String!, $password: String!) {
    resetKode(token: $token, password: $password) {
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

export default function ResetKode() {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { token } = useParams();

  const [resetKode] = useMutation(GLEMT_KODE_QUERY, {
    update(_, { data: { resetKode: userData } }) {
      console.log("user", userData);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();

    resetKode({
      variables: {
        token: token,
        password: password,
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
