import React, { useEffect } from "react";
import OwnerTable from '../../components/adminComponents/OwnerTable.jsx'
import { useGetOwnersQuery } from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";

function OwnerScreen() {
  const { data: owners = [], isLoading, error, refetch } = useGetOwnersQuery();

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
        <OwnerTable owners={owners} refetch={refetch} />
      )}
    </>
  );
}

export default OwnerScreen;
