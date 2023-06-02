import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

export default function CommunityFeat({ community_id }) {
  const GET_COMMUNITY_QUERY = gql`
    query getCommunityById($id: ID!) {
      getCommunityById(id: $id) {
        name
        description
        profilepic
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_COMMUNITY_QUERY, {
    variables: { id: community_id }, // Replace 'YOUR_COMMUNITY_ID' with the actual ID
  });

  if (loading) return <p>Loading...</p>;
  if (error) return null;

  const community = data.getCommunityById;

  return (
    <div>
      <span>
        Skrevet i <a href={`forum/${community.name}`}>{community.name}</a>
      </span>
      <img
        src={community.profilepic}
        alt="Community Profile"
        className="ms-2 me-2"
        style={{ width: 30 }}
      />
    </div>
  );
}
