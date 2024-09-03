import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import CityTable from "../../components/adminComponents/CityTable.jsx";
import { useGetCitiesQuery } from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";
import SideBarAdmin from "../../components/adminComponents/SideBar.jsx";
import { Container } from "react-bootstrap";

function CityScreen() {
  const { data: cities = [], isLoading, error, refetch } = useGetCitiesQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      <div className="d-flex">
        <SideBarAdmin />
        <div className="content">
          <h1 className="text-center mb-3">City Managment</h1>
          <Container>
            <Link to="/admin/add-city">
              <Button
                variant="dark"
                style={{ marginLeft: "946px" }}
                className="mb-3 me-3"
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
          </Container>
        </div>
      </div>
    </>
  );
}

export default CityScreen;
