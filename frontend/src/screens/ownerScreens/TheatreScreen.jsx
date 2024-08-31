import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Loader from "../../components/userComponents/Loader.jsx";
import { toast } from "react-toastify";
import { useGetTheatresQuery } from '../../slice/ownerSlice/ownerApiSlice.js';
import TheatreTable from '../../components/ownerComonents/TheatreTable.jsx'


function TheatreScreen() {
  const {data : theatres = [], isLoading, error, refetch} = useGetTheatresQuery()
  console.log(theatres);
  
  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <>
      <Link to="/owner/add-theatre">
        <Button
          variant="dark"
          style={{ marginTop: "-1200px", marginLeft: "1089px" }}
        >
          Add Theatre
        </Button>
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        toast.error(error.message)
      ) : (
        <TheatreTable theatres={ theatres } refetch ={ refetch }/>
      )}
    </>
  )
}

export default TheatreScreen
