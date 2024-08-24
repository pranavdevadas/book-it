import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import CityTable from "../../components/adminComponents/CityTable.jsx";
import { useGetCitiesQuery } from "../../slice/adminSlice/adminApiSlice.js";
import Loader from "../../components/userComponents/Loader.jsx";

function CityScreen() {
  const { data: cities = [], isLoading, error, refetch } = useGetCitiesQuery();

  useEffect(() => {
    refetch()
  }, [refetch])
  return (
    <>
      <Link to="/admin/add-city">
        <Button
          variant="dark"
          style={{ marginTop: "-1089px", marginLeft: "1089px" }}
          to="/admin/add-city"
        >
          Add City
        </Button>
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        toast.error(error.message)
      ) : (
        <CityTable cities={cities} />
      )}
    </>
  );
}

export default CityScreen;
