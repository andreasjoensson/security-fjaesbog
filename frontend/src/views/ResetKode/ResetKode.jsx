import logo from "../../assets/logo.png";
import { Lock } from "@material-ui/icons";
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./ResetKode.css";
import axios from "axios";

export default function ResetKode() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:1040/password/reset",
        { password, token }
      );
      console.log("response", response);
      setMessage(response.data.message); // assuming the API returns a message
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
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
            <h1>Reset din kode her?</h1>
            <p>Vælg en kode som er svær at bryde.</p>
          </div>

          <form className="loginForm mt-3 " onSubmit={handleSubmit}>
            <label>Ny kode</label>
            <div className="inputIcons">
              <input
                type="password"
                placeholder="Indtast dit password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="icon" />
            </div>

            <div className="inputIcons mt-3">
              <input
                type="password"
                placeholder="Indtast dit password igen"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Lock className="icon" />
            </div>

            <button type="submit" className="loginButton">
              Reset kode
            </button>
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
        <img
          className="spline-image"
          src={require("../../assets/jodebiden.png")}
        />
      </div>
    </div>
  );
}
