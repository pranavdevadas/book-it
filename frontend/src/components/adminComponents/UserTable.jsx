import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useBlockUnblockUserMutation } from "../../slice/adminSlice/adminApiSlice";
import { useEffect } from "react";

function UserTable({ users, refetch }) {
  const tableStyle = {
    width: "1000px",
    marginLeft: "310px",
    marginTop: "-484px",
  };

  const [blockUnblockUser] = useBlockUnblockUserMutation();
  useEffect(() => {
  },[refetch])

  const handleBlockUnblock = async (id, isBlocked) => {
    try {
      await blockUnblockUser(id).unwrap();
      if (isBlocked) {
        toast.success("User Unblocked");
      } else {
        toast.success("User Blocked");
      }
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user status");
    }
  };

  return (
    <Table striped bordered hover variant="dark" style={tableStyle}>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Verification Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isVerified.toString()}</td>
              <td>
                <Button
                  variant={!user.isBlocked ? "danger" : "success"}
                  onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                >
                  {!user.isBlocked ? "Block" : "Unblock"}
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2">No Users found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default UserTable;
