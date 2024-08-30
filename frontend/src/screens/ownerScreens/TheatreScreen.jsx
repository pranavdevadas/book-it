import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Loader from "../../components/userComponents/Loader.jsx";
import { toast } from "react-toastify";
import TheatreTable from '../../components/ownerComonents/TheatreTable.jsx'

function TheatreScreen() {
  return (
    <>
      <Link to="/owner/add-theatre">
        <Button
          variant="dark"
          style={{ marginTop: "-1089px", marginLeft: "1089px" }}
        >
          Add Theatre
        </Button>
      </Link>
      <TheatreTable/>
    </>
  )
}

export default TheatreScreen
