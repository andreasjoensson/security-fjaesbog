import { AccountCircleOutlined } from "@material-ui/icons";
import axios from "axios";
import { useState } from "react";
import joebiden from "../../assets/jodebiden.png";
import logo from "../../assets/logo.png";
import "./forgotpassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://20.228.199.140:1040/password/forgot",
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
          <img src={logo} alt="Fjæsbog logo" />
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
            <div className="alert alert-primary" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
      <div className="col-6 spline-scene">
        <img
          className="spline-image"
          src={joebiden}
          alt="Glemt adgangskode Joe Biden"
        />
      </div>
    </div>
  );
}
