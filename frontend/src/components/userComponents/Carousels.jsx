import Carousel from "react-bootstrap/Carousel";
import React from "react";
import ExampleCarouselImage from "../../assets/kalkiposter.jpeg";
import ExampleCarouselImage1 from "../../assets/batman.jpg";
import ExampleCarouselImage2 from "../../assets/kali.jpg";

function Carousels({ banner }) {
  const banner1 = `https://bookitt.online/${banner.banner1}`;
  const banner2 = `https://bookitt.online/${banner.banner2}`;
  const banner3 = `https://bookitt.online/${banner.banner3}`;

  // Vignette overlay style for all four sides
  const vignetteStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent), linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent), linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent), linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent)",
    pointerEvents: "none", // Allow clicks to pass through
    zIndex: 1, // Ensure the vignette is above the image
  };

  return (
    <>
      <Carousel style={{ width: "100%", margin: 0, padding: 0, overflow: 'hidden' }}>
        <Carousel.Item>
          <div style={{ position: "relative" }}> {/* Wrapper for image and overlay */}
            <img
              className="d-block"
              src={banner1 || ExampleCarouselImage}
              alt="First slide"
              style={{
                height: "500px",
                objectFit: "cover",
                width: "100%",
                margin: 0,
                display: "block",
              }}
            />
            <div style={vignetteStyle} /> {/* Vignette overlay */}
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{ position: "relative" }}>
            <img
              className="d-block"
              src={banner2 || ExampleCarouselImage1}
              alt="Second slide"
              style={{
                height: "500px",
                objectFit: "cover",
                width: "100%",
                margin: 0,
                display: "block",
              }}
            />
            <div style={vignetteStyle} />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{ position: "relative" }}>
            <img
              className="d-block"
              src={banner3 || ExampleCarouselImage2}
              alt="Third slide"
              style={{
                height: "500px",
                objectFit: "cover",
                width: "100%",
                margin: 0,
                display: "block",
              }}
            />
            <div style={vignetteStyle} />
          </div>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default Carousels;
