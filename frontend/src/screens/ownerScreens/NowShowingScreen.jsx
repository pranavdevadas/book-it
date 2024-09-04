import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Loader from "../../components/userComponents/Loader.jsx";
import { toast } from "react-toastify";
import { useGetNowShowingQuery } from "../../slice/ownerSlice/ownerApiSlice.js";
import NowShowingTable from "../../components/ownerComonents/NowShowingTable.jsx";
import SideBarOwner from "../../components/ownerComonents/SideBar.jsx";

function NowShowingScreen() {
  const {
    data: nowShowing = [],
    isLoading,
    error,
    refetch,
  } = useGetNowShowingQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <div className="d-flex">
        <SideBarOwner />
        <div className="content">
          <h1 className="text-center">Theatre Managment</h1>

          <Link to="/owner/add-show">
            <Button
              variant="dark"
              style={{ marginTop: "-1200px", marginLeft: "1089px" }}
            >
              Add Show
            </Button>
          </Link>
          {isLoading ? (
            <Loader />
          ) : error ? (
            toast.error(error.message)
          ) : (
            <NowShowingTable nowShowing={nowShowing} refetch={refetch} />
          )}
        </div>
      </div>
    </>
  );
}

export default NowShowingScreen;
