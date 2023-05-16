import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Redirect() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <div className="loginText mb-3">
        <h1>Log ind på din konto</h1>
        <p>Log ind for at få adgang til en commmunity af studerende!</p>
      </div>
      <button
        onClick={() => loginWithRedirect()}
        className="btn btn-primary w-100 mt-3"
      >
        Login
      </button>
      <button
        className="btn btn-primary w-100 mt-3"
        onClick={() => loginWithRedirect({ screen_hint: "signup" })}
      >
        Register
      </button>
    </div>
  );
}
