import React from "react";
import "./adminusers.css";
import { useQuery, gql } from "@apollo/client";
import Adminbar from "../../components/AdminBar/Adminbar";
import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useMutation } from "@apollo/client";

const GET_USERS_QUERY = gql`
  query GetUsers {
    getUsers {
      user_id
      name
      profilepic
      banned
      reason
    }
  }
`;

const UNBAN_USER_MUTATION = gql`
  mutation UnbanUser($user_id: Int!) {
    unbanUser(user_id: $user_id) {
      created_at
    }
  }
`;

const BAN_USER_MUTATION = gql`
  mutation BanUser($user_id: Int!, $reason: String!) {
    banUser(user_id: $user_id, reason: $reason) {
      banned
    }
  }
`;

export default function AdminUsers() {
  const { loading, error, data, refetch } = useQuery(GET_USERS_QUERY);
  const [unbanUser] = useMutation(UNBAN_USER_MUTATION);
  const [banUser] = useMutation(BAN_USER_MUTATION);
  const [userIdToBan, setUserIdToBan] = useState(null);
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleUnban = (userId) => {
    unbanUser({ variables: { user_id: userId } })
      .then(() => {
        // Handle successful unban
        console.log("bruger unbanned");
        refetch(); // Refetch the getUsers query to update the user list
      })
      .catch((error) => {
        console.error("Error unbaning user:", error);
      });
  };

  const handleBan = (userId) => {
    console.log("ban user", userId);
    setUserIdToBan(parseInt(userId));
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setReason("");
    setUserIdToBan(null);
  };

  const handleBanConfirm = () => {
    if (userIdToBan && reason) {
      banUser({ variables: { user_id: userIdToBan, reason } })
        .then(() => {
          // Handle successful ban
          refetch(); // Refetch the getUsers query to update the user list
          handleModalClose();
        })
        .catch((error) => {
          console.error("Error banning user:", error);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Adminbar currentPage={"adminusers"} />
        <div className="communityContainer col-9">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-left">Brugere</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> Bruger </th>
                        <th> Grund </th>
                        <th> Status </th>
                        <th> Aktion </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.getUsers.map((user) => (
                        <tr key={user.user_id}>
                          <td>
                            <img
                              src={
                                user.profilepic
                                  ? user.profilepic
                                  : "https://www.w3schools.com/howto/img_avatar.png"
                              }
                              className="mr-2 me-3"
                              alt="face"
                            />
                            {user.name}
                          </td>
                          <td>{user.reason ? user.reason : "Ikke banned"}</td>
                          <td>{user.banned ? "Banned" : "Not Banned"}</td>
                          <td>
                            {user.banned ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUnban(parseInt(user.user_id))
                                }
                                className="btn btn-primary"
                              >
                                Unban
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleBan(user.user_id)}
                                className="btn btn-danger"
                              >
                                Ban
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ban User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason:</Form.Label>
            <Form.Control
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleBanConfirm}>
            Ban User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
