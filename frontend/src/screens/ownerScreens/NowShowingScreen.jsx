import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Loader from "../../components/userComponents/Loader.jsx";
import { toast } from "react-toastify";
import { useGetNowShowingQuery } from "../../slice/ownerSlice/ownerApiSlice.js";
import NowShowingTable from "../../components/ownerComonents/NowShowingTable.jsx";

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
    </>
  );
}

export default NowShowingScreen;
