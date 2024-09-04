import React from "react";
import { Container } from "react-bootstrap";
import SideBarOwner from "../../components/ownerComonents/SideBar";
// import "./style.css";

function HomeScreen() {
  return (
    <div className="d-flex">
      <SideBarOwner/>
      <div className="content">
        <Container>
          <h1>HomeScreen</h1>
        </Container>
      </div>
    </div>
  );
}

export default HomeScreen;
