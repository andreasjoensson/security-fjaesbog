import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

const CLIENT_ID = "cee4f57a36b40c930bd7";
const CLIENT_SECRET = "84f7d4bdb97697843185f36c23b87fc5c5ee86e3";
const REDIRECT_URI = "https://zucc.dk/callback";

const Callback = () => {
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          "https://github.com/login/oauth/access_token",
          {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI,
          },
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log("response", response);

        const accessToken = response.data.access_token;
        // Use the access token to make further requests or authenticate the user in your backend

        // Redirect the user to the desired route in your application
        history.push("/dashboard");
      } catch (error) {
        // Handle error scenarios
        console.error("Error occurred during access token retrieval:", error);
        // Redirect the user to an error page or login page
        history.push("/error");
      }
    };

    fetchAccessToken();
  }, [history, location.search]);

  return (
    <div>
      <h2>Logger ind med github...</h2>
    </div>
  );
};

export default Callback;
