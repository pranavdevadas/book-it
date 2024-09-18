import React, { useState, useEffect } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/userComponents/Loader";
import {
  useMoveDetailsByIdQuery,
  useGetAvailableShowsQuery,
} from "../../slice/userSlice/userApiSlice";
import { format } from "date-fns";
import "./style.css";
import Search from "../../components/userComponents/Search";
import RatingForm from "../../components/userComponents/RatingReview";

function MovieDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const navigate = useNavigate();

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

  if (movieError) {
    console.log("Movie Error:", movieError);
  }

  if (showsError) {
    console.log("Shows Error:", showsError);
  }

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

  const poster = `http://localhost:5000/moviePoster/${movie.poster}`;

  const today = new Date();
  const currentTime = format(today, "HH:mm");

  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const isToday = selectedDate === format(today, "yyyy-MM-dd");

  const filteredTheatres = shows
    ? shows.filter((show) => {
        const searchLower = searchTerm.toLowerCase();
        return show.theatre.name.toLowerCase().includes(searchLower);
      })
    : [];

  const handleBooking = (theatreId, screen, date, time) => {
    navigate(`/select-seats/${theatreId}/${screen}`, {
      state: {
        selectedDate: date,
        selectedTime: time,
        screen,
        theatreId,
        movieId: movie._id,
      },
    });
  };

  return (
    <>
      <div className="posterBackground">
        <div className="backgroundOverlay">
          <img src={poster} className="backgroundPoster" alt="Movie Poster" />
        </div>
        <div className="movie-details">
          <img src={poster} className="posterImage" alt="Movie Poster" />
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
              {dates.map((date, index) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                const isSelected = formattedDate === selectedDate;

                return (
                  <Button
                    key={index}
                    variant={isSelected ? "danger" : "dark"}
                    onClick={() => setSelectedDate(formattedDate)}
                    style={
                      isSelected
                        ? { backgroundColor: "red", borderColor: "red" }
                        : {}
                    }
                  >
                    {format(date, "dd")}
                    <br />
                    {format(date, "MMM")}
                  </Button>
                );
              })}
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
                {show.showtime
                  .filter((time) => {
                    if (isToday) {
                      return time > currentTime;
                    }
                    return true;
                  })
                  .map((time, idx) => (
                    <Button
                      key={idx}
                      variant="secondary"
                      onClick={() =>
                        handleBooking(
                          show.theatre._id,
                          show.screen,
                          selectedDate,
                          time
                        )
                      }
                      disabled={!selectedDate}
                    >
                      {time}
                    </Button>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No nearby theatres available</p>
        )}
        <h2
          className="fw-bold text-center mt-3 mb-4"
          style={{ color: "orange" }}
        >
          Add Your Rating & Review
        </h2>
        <RatingForm movieId={movie._id} />
      </Container>
    </>
  );
}

export default MovieDetails;
