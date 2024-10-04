import Carousel from "react-bootstrap/Carousel";
import React, { useEffect } from "react";
import ExampleCarouselImage from "../../assets/kalkiposter.jpeg";
import ExampleCarouselImage1 from "../../assets/batman.jpg";
import ExampleCarouselImage2 from "../../assets/kali.jpg";

function Carousels({ banner, bannerRefetch }) {

  const banner1 = `https://bookitt.online/${banner.banner1}`
  const banner2 = `https://bookitt.online/${banner.banner2}`
  const banner3 = `https://bookitt.online/${banner.banner3}`

  return (
    <>
      <h2 className="text-center mt-3 fw-bold">Book Movies Now</h2>
      <Carousel className="d-flex justify-content-center mt-5">
        <Carousel.Item>
          <img
            className="d-block w-75 mx-auto"
            src={banner1 || ExampleCarouselImage}
            alt="First slide"
            style={{ height: "500px", objectFit: "cover" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-75 mx-auto"
            src={banner2 ||ExampleCarouselImage1}
            alt="Second slide"
            style={{ height: "500px", objectFit: "cover" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-75 mx-auto"
            src={banner3 || ExampleCarouselImage2}
            alt="Third slide"
            style={{ height: "500px", objectFit: "cover" }}
          />
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default Carousels;
