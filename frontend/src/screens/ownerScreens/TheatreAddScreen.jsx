import React, { useState, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import { IoIosRemoveCircle } from "react-icons/io";
import FormContainer from "../../components/userComponents/FormContainer";
import SeatSelection from "../../components/ownerComonents/SeatSelection";
import { toast } from "react-toastify";
import {
  useOwnerAddTheatreMutation,
  useGetCitiesQuery,
} from "../../slice/ownerSlice/ownerApiSlice";
import { useNavigate } from "react-router-dom";
import SideBarOwner from "../../components/ownerComonents/SideBar";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Loader from "../../components/userComponents/Loader.jsx";
import Swal from "sweetalert2";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 10.8505,
  lng: 76.2711,
};

function TheatreAddScreen() {
  const [screens, setScreens] = useState([]);
  const [theatreName, setTheatreName] = useState("");
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const [addTheatre] = useOwnerAddTheatreMutation();
  const { data: cities, error, isLoading } = useGetCitiesQuery();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleAddScreen = () => {
    const nextScreenNumber = screens.length + 1;
    setScreens([
      ...screens,
      { name: nextScreenNumber, showTimes: [], seats: {} },
    ]);
  };

  const handleAddShowTime = (screenIndex) => {
    const updatedScreens = [...screens];
    if (updatedScreens[screenIndex].showTimes.length < 4) {
      updatedScreens[screenIndex].showTimes.push("");
      setScreens(updatedScreens);
    }
  };

  const handleShowTimeChange = (screenIndex, showTimeIndex, value) => {
    const updatedScreens = [...screens];
    const selectedTime = new Date(`1970-01-01T${value}:00`);

    // Check if the time is at least 4 hours apart from other showtimes
    const isTimeValid = updatedScreens[screenIndex].showTimes.every(
      (showTime, idx) => {
        if (idx !== showTimeIndex && showTime) {
          const existingTime = new Date(`1970-01-01T${showTime}:00`);
          const timeDifference =
            Math.abs(selectedTime - existingTime) / (1000 * 60 * 60); // difference in hours

          return timeDifference >= 4;
        }
        return true;
      }
    );

    if (isTimeValid) {
      updatedScreens[screenIndex].showTimes[showTimeIndex] = value;
      setScreens(updatedScreens);
    } else {
      toast.error("Showtimes must be at least 4 hours apart.");
    }
  };

  const handleSeatChange = (screenIndex, row, col) => {
    const seatKey = `${row + 1}-${col + 1}`;
    const updatedScreens = [...screens];
    const currentSeats = updatedScreens[screenIndex].seats;

    if (currentSeats[seatKey]) {
      delete currentSeats[seatKey];
    } else {
      currentSeats[seatKey] = {
        seatNumber: parseInt(seatKey.replace("-", ""), 10),
        isSelected: true,
      };
    }

    updatedScreens[screenIndex].seats = currentSeats;
    setScreens(updatedScreens);
  };

  const validateForm = () => {
    const namePattern = /^[A-Za-z\s]{3,}$/;
    const pricePattern = /^[1-9][0-9]*$/;

    if (!namePattern.test(theatreName)) {
      toast.error("Invalid theatre name.");
      return false;
    }
    if (!location) {
      toast.error("Please select location.");
      return false;
    }
    if (!city) {
      toast.error("Select at least one city.");
      return false;
    }
    if (
      !pricePattern.test(ticketPrice) ||
      ticketPrice < 99 ||
      ticketPrice > 700
    ) {
      toast.error("Invalid Ticket Price");
      return false;
    }
    if (screens.length === 0) {
      toast.error("Select at least one screen.");
      return false;
    }
    for (let screen of screens) {
      if (
        !screen.name ||
        isNaN(screen.name) ||
        screen.name < 1 ||
        screen.name > 10
      ) {
        toast.error("Screen number must be between 1 and 10.");
        return false;
      }
      if (screen.showTimes.length === 0) {
        toast.error("Select at least one show time.");
        return false;
      }
      if (screen.showTimes.length > 4) {
        toast.error("Maximum 4 show times can be added.");
        return false;
      }
      const selectedSeats = Object.keys(screen.seats).length;
      if (selectedSeats < 10) {
        toast.error("Select a minimum of 10 seats.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const processedScreens = screens.map((screen) => {
      const seatObjects = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 12; col++) {
          const seatKey = `${row + 1}-${col + 1}`;
          const seat = screen.seats[seatKey] || {
            seatNumber: parseInt(seatKey.replace("-", ""), 10),
            isSelected: false,
          };
          seatObjects.push(seat);
        }
      }

      return {
        ...screen,
        seats: seatObjects,
      };
    });

    try {
      await addTheatre({
        name: theatreName,
        city,
        location,
        ticketPrice,
        screens: processedScreens,
      }).unwrap();

      toast.success("Theatre added successfully");
      navigate("/owner/theatres");
    } catch (error) {
      toast.error("Thatre already exist");
      console.error(error);
    }
  };

  const onMapClick = useCallback((event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleRemoveShowTime = (screenIndex, showTimeIndex) => {
    const updatedScreens = screens.map((screen, i) => {
      if (i === screenIndex) {
        return {
          ...screen,
          showTimes: screen.showTimes.filter((_, idx) => idx !== showTimeIndex),
        };
      }
      return screen;
    });
    setScreens(updatedScreens);
  };

  const handleRemoveScreen = (screenIndex) => {
    if (screens.length <= 1) {
      toast.error("At least one screen must be present.");
      return;
    }
    setScreens(screens.filter((_, index) => index !== screenIndex));
  };

  return (
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <FormContainer>
          <h1>Add Theatre</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Theatre Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter theatre name"
                value={theatreName}
                onChange={(e) => setTheatreName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <div style={{ marginBottom: "10px" }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={10}
                    center={center}
                    onClick={onMapClick}
                  >
                    {location && (
                      <Marker
                        position={{ lat: location.lat, lng: location.lng }}
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <Loader />
                )}
              </div>
            </Form.Group>

            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a city
                </option>
                {isLoading && <Loader />}
                {error && <option>Error loading cities</option>}
                {cities &&
                  cities.map((city) => (
                    <option key={city._id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="ticketPrice">
              <Form.Label>Ticket Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ticket price"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                required
              />
            </Form.Group>

            {screens.map((screen, screenIndex) => (
              <div key={screenIndex} className="mt-3">
                <p>Screen No: {screen.name}</p>
                <div
                  onClick={() => {
                    if (screens.length <= 1) {
                      toast.error("At least one screen must be present.");
                      return;
                    }

                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, remove it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleRemoveScreen(screenIndex);
                        Swal.fire({
                          title: "Removed!",
                          text: "The screen has been removed.",
                          icon: "success",
                        });
                      }
                    });
                  }}
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginLeft: "290px",
                  }}
                >
                  <IoIosRemoveCircle />
                  Remove Screen
                </div>

                {screen.showTimes.map((showTime, showTimeIndex) => (
                  <Form.Group
                    controlId={`showTime-${screenIndex}-${showTimeIndex}`}
                    key={showTimeIndex}
                  >
                    <Form.Label>Show Time</Form.Label>
                    <Form.Control
                      type="time"
                      style={{ width: "22%" }}
                      value={showTime}
                      onChange={(e) =>
                        handleShowTimeChange(
                          screenIndex,
                          showTimeIndex,
                          e.target.value
                        )
                      }
                      required
                    />
                    <IoIosRemoveCircle
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() =>
                        handleRemoveShowTime(screenIndex, showTimeIndex)
                      }
                    />
                  </Form.Group>
                ))}
                <br />

                <Button
                  variant="dark"
                  onClick={() => handleAddShowTime(screenIndex)}
                  className="mb-3"
                  disabled={screen.showTimes.length >= 4}
                >
                  Add Show Time
                </Button>

                <br />
                <Form.Label className="mt-3">Seats</Form.Label>
                <SeatSelection
                  seats={screen.seats}
                  handleSeatChange={(row, col) =>
                    handleSeatChange(screenIndex, row, col)
                  }
                />
              </div>
            ))}

            <Button variant="dark" onClick={handleAddScreen} className="mt-3">
              Add Screen
            </Button>
            <br />
            <br />
            <br />
            <Button type="submit" variant="primary" className="mt-3">
              Submit
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
}

export default TheatreAddScreen;
