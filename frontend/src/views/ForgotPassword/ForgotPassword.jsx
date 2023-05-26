import "./forgotpassword.css";
import logo from "../../assets/logo.png";
import { AccountCircleOutlined, MailOutline } from "@material-ui/icons";
import { useState } from "react";
import axios from "axios";
import joebiden from "../../assets/jodebiden.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:1040/password/forgot",
        { email }
      );
      setMessage(response.data.message); // assuming the API returns a message
    } catch (error) {
      setError(error.response?.data?.error || "Der er sket en fejl!");
    }
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

          <form className="loginForm mt-3 " onSubmit={handleSubmit}>
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
          {message && (
            <div class="alert alert-primary" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div class="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
      <div className="col-6 spline-scene">
        <img className="spline-image" src={joebiden} />
      </div>
    </div>
  );
}
