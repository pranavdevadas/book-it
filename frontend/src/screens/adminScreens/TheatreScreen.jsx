import React, { useEffect } from "react";
import { useGetTheatressQuery } from "../../slice/adminSlice/adminApiSlice";
import Loader from "../../components/userComponents/Loader";
import TheatreTable from "../../components/adminComponents/TheatreTable";
import SideBarAdmin from "../../components/adminComponents/SideBar";
import { toast } from "react-toastify";

function TheatreScreen() {
  const {
    data: theatres = [],
    isLoading,
    error,
    refetch,
  } = useGetTheatressQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="d-flex">
      <SideBarAdmin />
      <div className="content">
        <h1 className="text-center mb-3">Movie Managment</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          toast.error(error.message)
        ) : (
          <TheatreTable theatres={theatres} refetch={refetch} />
        )}
      </div>
    </div>
  );
}

export default TheatreScreen;
