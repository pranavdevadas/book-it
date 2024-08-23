import React from 'react';
import { Container } from "react-bootstrap";
import SideBar from '../../components/adminComponents/SideBar';
import './style.css'


function HomeScreen() {
  return (
    <div className="admin-home-screen">
      <SideBar />
      <Container className="content-container">
        <h1>Admin HomeScreen</h1>
      </Container>
    </div>
  );
}

export default HomeScreen;
