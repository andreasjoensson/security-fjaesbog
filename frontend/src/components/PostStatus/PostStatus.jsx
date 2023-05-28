import React from "react";
import { useMutation, gql } from "@apollo/client";
const PostButtons = ({
  user_id,
  author_id,
  post_id,
  isPrivate,
  makePostPrivate,
  makePostPublic,
}) => {
  const handleMakePostPrivate = async () => {
    try {
      const { data } = await makePostPrivate({
        variables: { post_id: post_id },
      });
      console.log("Post made private:", data.makePostPrivate);
    } catch (error) {
      console.error("Error making post private:", error);
    }
  };

  const handleMakePostPublic = async () => {
    try {
      const { data } = await makePostPublic({
        variables: { post_id: post_id },
      });
      console.log("Post made public:", data.makePostPublic);
    } catch (error) {
      console.error("Error making post public:", error);
    }
  };

  if (parseInt(user_id) == parseInt(author_id)) {
    return (
      <div className="ms-2">
        {isPrivate ? (
          <button className="btn btn-primary" onClick={handleMakePostPublic}>
            Gør Offentligt
          </button>
        ) : (
          <button className="btn btn-danger" onClick={handleMakePostPrivate}>
            Gør Privat
          </button>
        )}
      </div>
    );
  }

  return null; // Or you can return an empty <div> if you want to preserve the component's position in the DOM
};

export default PostButtons;