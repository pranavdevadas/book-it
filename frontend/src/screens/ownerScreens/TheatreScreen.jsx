import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Loader from "../../components/userComponents/Loader.jsx";
import { toast } from "react-toastify";
import { useGetTheatresQuery } from "../../slice/ownerSlice/ownerApiSlice.js";
import TheatreTable from "../../components/ownerComonents/TheatreTable.jsx";
import SideBarOwner from "../../components/ownerComonents/SideBar.jsx";

function TheatreScreen() {
  const {
    data: theatres = [],
    isLoading,
    error,
    refetch,
  } = useGetTheatresQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <div className="d-flex">
        <SideBarOwner />
        <div className="content">
          <h1 className="text-center">Theatre Managment</h1>
          <Link to="/owner/add-theatre">
            <Button
              variant="dark"
              style={{  marginLeft: "900px" }}
            >
              Add Theatre
            </Button>
          </Link>
          {isLoading ? (
            <Loader />
          ) : error ? (
            toast.error(error.message)
          ) : (
            <TheatreTable theatres={theatres} refetch={refetch} />
          )}
        </div>
      </div>
    </>
  );
}

export default TheatreScreen;
