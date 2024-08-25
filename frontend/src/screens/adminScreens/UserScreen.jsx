import React, { useEffect } from "react";
import UserTable from "../../components/adminComponents/UserTable.jsx";
import { useGetUsersQuery } from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";

function UserScreen() {
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();

  useEffect(() => {
    refetch()
  }, [refetch])
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        toast.error(error.message)
      ) : (
        <UserTable users={users} refetch={refetch} />
      )}
    </>
  );
}

export default UserScreen;
