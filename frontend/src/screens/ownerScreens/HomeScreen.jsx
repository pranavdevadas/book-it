import React from 'react'
import SideBarOwner from '../../components/ownerComonents/Sidebar'
import { Container } from "react-bootstrap";
import "./style.css";

function HomeScreen() {
  return (
    <div className="admin-home-screen">
      <SideBarOwner />
      <Container className="content-container">
        <h1>Owner HomeScreen</h1>
      </Container>
    </div>
  )
}

export default HomeScreen
