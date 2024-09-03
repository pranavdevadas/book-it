import React, { useEffect } from "react";
import OwnerTable from "../../components/adminComponents/OwnerTable.jsx";
import { useGetOwnersQuery } from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";
import SideBarAdmin from "../../components/adminComponents/SideBar.jsx";

function OwnerScreen() {
  const { data: owners = [], isLoading, error, refetch } = useGetOwnersQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      <div className="d-flex">
        <SideBarAdmin />
        <div className="content">
          <h1 className="text-center mb-3">Owner Managment</h1>
          {isLoading ? (
            <Loader />
          ) : error ? (
            toast.error(error.message)
          ) : (
            <OwnerTable owners={owners} refetch={refetch} />
          )}
        </div>
      </div>
    </>
  );
}

export default OwnerScreen;
