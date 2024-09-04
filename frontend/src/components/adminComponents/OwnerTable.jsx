import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useBlockUnblockOwnerMutation } from "../../slice/adminSlice/adminApiSlice";
import Search from "../../components/userComponents/Search.jsx";

function OwnerTable({ owners, refetch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = owners.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [blockUnblockOwner] = useBlockUnblockOwnerMutation();
  useEffect(() => {}, [refetch]);

  const handleBlockUnblock = async (id, isBlocked) => {
    try {
      await blockUnblockOwner(id).unwrap();
      if (isBlocked) {
        toast.success("Owner Unblocked");
      } else {
        toast.success("Owner Blocked");
      }
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update owner status");
    }
  };

  return (
    <Container>
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
            filteredItems.map((owner, index) => (
              <tr key={owner._id}>
                <td>{index + 1}</td>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{owner.isVerified.toString()}</td>
                <td>
                  <Button
                    variant={!owner.isBlocked ? "danger" : "success"}
                    onClick={() =>
                      handleBlockUnblock(owner._id, owner.isBlocked)
                    }
                  >
                    {!owner.isBlocked ? "Block" : "Unblock"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">No Users found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default OwnerTable;
