import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import { Button, Container, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { useBlockUnblockOwnerMutation } from "../../slice/adminSlice/adminApiSlice";
import Search from "../../components/userComponents/Search.jsx";
import Swal from "sweetalert2";

function OwnerTable({ owners, refetch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = owners.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedOwners = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [blockUnblockOwner] = useBlockUnblockOwnerMutation();
  useEffect(() => {}, [refetch]);

  const handleBlockUnblock = async (id, isBlocked) => {
    const action = isBlocked ? "unblock" : "block";

    Swal.fire({
      title: `Are you sure you want to ${action} this owner?`,
      text: `This owner will be ${isBlocked ? "unblocked" : "blocked"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await blockUnblockOwner(id).unwrap();
          Swal.fire({
            title: isBlocked ? "Unblocked!" : "Blocked!",
            text: `Owner has been ${isBlocked ? "unblocked" : "blocked"}.`,
            icon: "success",
          });
          toast.success(isBlocked ? "Owner Unblocked" : "Owner Blocked");
          refetch();
        } catch (error) {
          console.log(error);
          toast.error("Failed to update owner status");
        }
      }
    });
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
          {paginatedOwners.length > 0 ? (
            paginatedOwners.map((owner, index) => (
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
              <td colSpan="2" className="text-center">
                No Users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={currentPage === page + 1}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </Container>
  );
}

export default OwnerTable;
