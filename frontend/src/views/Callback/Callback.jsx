import { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useApolloClient, gql } from "@apollo/client";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";

const Callback = () => {
  const location = useLocation();
  const history = useHistory();
  const client = useApolloClient();
  const [loggedIn, setLoggedIn] = useState(false);
  const context = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    const fetchAccessToken = async () => {
      try {
        const mutation = gql`
          mutation Callback($code: String!) {
            callback(code: $code) {
              user_id
              name
              password
              age
              email
              profilepic
              profilecover
              token
              created_at
              last_login
              reason
              banned
              role
            }
          }
        `;

        const response = await client.mutate({
          mutation,
          variables: {
            code: code,
          },
        });

        const user = response.data.callback;
        console.log("user: ", user);
        if (user) {
          context.login(user);
          setLoggedIn(true);
        } else {
          history.push("/");
        }

        //history.push("/dashboard");
      } catch (error) {
        // Handle error scenarios
        console.error("Error occurred during access token retrieval:", error);
        // Redirect the user to an error page or login page
        history.push("/");
      }
    };

    fetchAccessToken();
  }, [client, history, location.search]);

  if (loggedIn) {
    // Redirect to the protected route after successful login
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <h2>Logger ind med github...</h2>
    </div>
  );
};

export default Callback;
