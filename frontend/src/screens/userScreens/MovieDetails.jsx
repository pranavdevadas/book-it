import React, { useState, useEffect } from "react";
import { Container, Alert, Button, NavDropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/userComponents/Loader";
import {
  useMoveDetailsByIdQuery,
  useGetAvailableShowsQuery,
} from "../../slice/userSlice/userApiSlice";
import { format } from "date-fns";
import "./style.css";
import Search from "../../components/userComponents/Search";

function MovieDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate()

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useMoveDetailsByIdQuery(id);

  const {
    data: shows,
    isLoading: showsLoading,
    error: showsError,
  } = useGetAvailableShowsQuery(
    { id, lat: location.lat, lng: location.lng },
    {
      skip: !location.lat || !location.lng,
    }
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setLocationError(
          "Unable to retrieve location. Please enable location services."
        );
      }
    );
  }, []);

  if (movieLoading || showsLoading) {
    return <Loader />;
  }

  if (movieError || showsError) {
    return <Alert variant="danger">Failed to load data.</Alert>;
  }

  const poster = `http://localhost:5000/moviePoster/${movie.poster}`;

  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const filteredTheatres = shows
    ? shows.filter((show) => {
        const searchLower = searchTerm.toLowerCase();
        return show.theatre.name.toLowerCase().includes(searchLower);
      })
    : [];

    const handleBooking = (id) => {
      navigate(`/theatre/select-seat/${id}`);
    };

  return (
    <>
      <div className="posterBackground">
        <div className="backgroundOverlay">
          <img src={poster} className="backgroundPoster" />
        </div>
        <div className="movie-details">
          <img src={poster} className="posterImage" />
          <div className="movie-info">
            <h2 className="shadow">
              <b>{movie.name}</b>
            </h2>
            <h4 className="shadow">{movie.categories.join(", ")}</h4>
            <h5 className="shadow">{movie.language.join(", ")}</h5>
            <h5 className="shadow">{movie.cast.join(", ")}</h5>
          </div>
        </div>
      </div>
      <Container>
        <h2 className="text-center mt-5 mb-4 fw-bold">Select Date</h2>
        <div className="d-flex justify-content-center mb-4">
          <div style={{ width: "40%" }}>
            <div className="d-flex justify-content-between align-items-center">
              {dates.map((date, index) => (
                <Button key={index} variant="dark">
                  {format(date, "dd")}
                  <br />
                  {format(date, "MMM")}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <h2 className="text-center mt-5 mb-4 fw-bold">Select Theatres</h2>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {locationError && <Alert variant="danger">{locationError}</Alert>}
        {filteredTheatres && filteredTheatres.length > 0 ? (
          filteredTheatres.map((show, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center mt-4"
            >
              <h5 className="fw-bold">
                {show.theatre.name} Screen {show.screen} ({show.theatre.city})
              </h5>
              <div className="d-flex gap-4">
                {show.showtime.map((time, idx) => (
                  <Button key={idx} variant="secondary">
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No nearby theatres available</p>
        )}
      </Container>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="d-flex justify-content-center">
        <Button variant="dark" onClick={() => handleBooking(show.theatre._id)}>Continue</Button>
      </div>
      <br />
      <br />
      <br />
    </>
  );
}

export default MovieDetails;
