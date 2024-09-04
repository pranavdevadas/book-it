import Table from "react-bootstrap/Table";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useBlockUnblockUserMutation } from "../../slice/adminSlice/adminApiSlice";
import { useEffect, useState } from "react";
import SideBarAdmin from "./SideBar";
import Search from "../userComponents/Search";

function UserTable({ users, refetch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = users.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [blockUnblockUser] = useBlockUnblockUserMutation();
  useEffect(() => {}, [refetch]);

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
    <div className="d-flex">
      <SideBarAdmin />
      <div className="content">
        <Container>
          <h1 className="text-center mb-3">User Managment</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Table
            striped
            bordered
            hover
            variant="dark"
            className="rounded overflow-hidden"
          >
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
              {filteredItems.length > 0 ? (
                filteredItems.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isVerified.toString()}</td>
                    <td>
                      <Button
                        variant={!user.isBlocked ? "danger" : "success"}
                        onClick={() =>
                          handleBlockUnblock(user._id, user.isBlocked)
                        }
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
        </Container>
      </div>
    </div>
  );
}

export default UserTable;
