import "./login.css";
import logo from "./logo.png";
import { AccountCircleOutlined, MailOutline } from "@material-ui/icons";
import { Lock } from "@material-ui/icons";
import { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "./context/auth";
import { useHistory } from "react-router";

const LOGIN_QUERY = gql`
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

export default function Login() {
  const context = useContext(AuthContext);
  const [name, setName] = useState("");
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [login] = useMutation(LOGIN_QUERY, {
    update(_, { data: { login: userData } }) {
      console.log("user", userData);
      context.login(userData);
      history.push("/dashboard");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();

    login({
      variables: {
        name: name,
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
          <div className="loginText">
            <h1>Log ind på din konto</h1>
            <p>Log ind for at få adgang til en commmunity af studerende!</p>
          </div>

          <form className="loginForm" onSubmit={submitLogin}>
            <label>Brugernavn</label>
            <div className="inputIcons">
              <input
                type="text"
                placeholder="Indtast et navn"
                onChange={(e) => setName(e.target.value)}
              />
              <AccountCircleOutlined className="icon" />
            </div>

            <label>Password</label>
            <div className="inputIcons">
              <input
                type="password"
                placeholder="Indtast dit password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="icon" />
            </div>

            <div className="bottomLogin mb-3">
              <div className="checkbox align-items-center">
                <input type="checkbox" name="vehicle1" value="Bike" />
                <label className="ms-3">Log mig ikke ud.</label>
              </div>

              <a className="forgotPassword">Glemt password?</a>
            </div>

            <button type="submit" className="loginButton">
              Login
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

      <div className="login-showcase"></div>
    </div>
  );
}
