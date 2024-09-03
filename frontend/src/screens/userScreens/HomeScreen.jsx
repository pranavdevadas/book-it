import React, { useEffect } from "react";
import Card from "../../components/userComponents/Card.jsx";
import { Container } from "react-bootstrap";
import Carousels from "../../components/userComponents/Carousels.jsx";

function HomeScreen() {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.go(1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      <Container>
        <Carousels />
        <Card />
      </Container>
    </>
  );
}

export default HomeScreen;
