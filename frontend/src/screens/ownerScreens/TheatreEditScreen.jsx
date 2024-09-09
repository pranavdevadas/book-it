import React, { useState, useEffect, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer";
import EditSeatSelection from "../../components/ownerComonents/EditSeatSEction";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTheatreByIdQuery,
  useOwnerEditTheatreMutation,
  useGetCitiesQuery,
} from "../../slice/ownerSlice/ownerApiSlice";
import SideBarOwner from "../../components/ownerComonents/SideBar";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Loader from "../../components/userComponents/Loader.jsx";
import { IoIosRemoveCircle } from "react-icons/io";
import Swal from "sweetalert2";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

function TheatreEditScreen() {
  const { id } = useParams();
  const [theatre, setTheatre] = useState(null);
  const [screens, setScreens] = useState([]);
  const [location, setLocation] = useState(null);

  let navigate = useNavigate();

  const { data, error, isLoading, refetch } = useGetTheatreByIdQuery(id);
  const [editTheatre] = useOwnerEditTheatreMutation();
  const { data: cities = [] } = useGetCitiesQuery();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (data) {
      setTheatre(data);
      setScreens(data.screens || []);
      refetch();
    }
  }, [data, refetch]);

  const handleSeatChange = (screenIndex, row, col) => {
    const updatedScreens = screens.map((screen) => ({
      ...screen,
      seats: screen.seats.map((seat) => ({ ...seat })),
    }));

    const seatIndex = row * 12 + col;
    const seat = updatedScreens[screenIndex].seats[seatIndex];

    if (seat) {
      seat.isAvailable = !seat.isAvailable;
      seat.isSelected = seat.isAvailable;
    }

    setScreens(updatedScreens);
  };

  const validateForm = () => {
    const namePattern = /^[A-Za-z\s]{3,}$/;
    const pricePattern = /^[0-9]{2,3}$/;

    if (!namePattern.test(theatre?.name || "")) {
      toast.error("Invalid theatre name.");
      return false;
    }
    if (!location) {
      toast.error("Invalid location link.");
      return false;
    }
    if (!theatre?.city) {
      toast.error("Select a city.");
      return false;
    }
    if (
      !pricePattern.test(theatre?.ticketPrice || "") ||
      parseInt(theatre?.ticketPrice, 10) < 99 ||
      parseInt(theatre?.ticketPrice, 10) > 700
    ) {
      toast.error("Invalid Ticket Price.");
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
        parseInt(screen.name, 10) < 1 ||
        parseInt(screen.name, 10) > 10
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
      const selectedSeats = screen.seats.filter(
        (seat) => seat.isSelected
      ).length;
      if (selectedSeats < 10) {
        toast.error("Select a minimum of 10 seats.");
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (theatre?.location) {
      setLocation({
        lat: theatre.location.lat,
        lng: theatre.location.lng,
      });
    }
  }, [theatre]);

  const onMapClick = useCallback((event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await editTheatre({
        id,
        formData: { ...theatre, location, screens },
      }).unwrap();
      toast.success("Theatre updated successfully");
      navigate("/owner/theatres");
    } catch (error) {
      toast.error("Failed to update theatre");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading theatre</p>;

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
          <h1>Edit Theatre</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Theatre Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter theatre name"
                value={theatre?.name || ""}
                onChange={(e) =>
                  setTheatre({ ...theatre, name: e.target.value })
                }
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
                    center={location || { lat: 10.8505, lng: 76.2711 }}
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
                value={theatre?.city || ""}
                onChange={(e) =>
                  setTheatre({ ...theatre, city: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select a city
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="ticketPrice">
              <Form.Label>Ticket Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter ticket price"
                value={theatre?.ticketPrice || ""}
                onChange={(e) =>
                  setTheatre({ ...theatre, ticketPrice: e.target.value })
                }
                required
              />
            </Form.Group>

            {screens.map((screen, screenIndex) => (
              <div key={screenIndex} className="mt-3">
                <Form.Group controlId={`screenName-${screenIndex}`}>
                  <Form.Label>Screen No.</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ width: "15%" }}
                    value={`${screenIndex + 1}`}
                    readOnly
                  />
                </Form.Group>
                <div
                  onClick={() => {
                    // Check if only one screen is left
                    if (screens.length <= 1) {
                      toast.error("At least one screen must be present.");
                      return;
                    }

                    // Show the SweetAlert confirmation
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
                        handleRemoveScreen(screenIndex); // Remove the screen if confirmed
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
                    <Form.Label>Show Time {showTimeIndex + 1} </Form.Label>
                    <Form.Control
                      type="time"
                      style={{ width: "22%" }}
                      value={showTime}
                      onChange={(e) => {
                        const newShowTime = e.target.value;
                        const selectedTime = new Date(
                          `1970-01-01T${newShowTime}:00`
                        );

                        const isValidTime = screen.showTimes.every(
                          (time, idx) => {
                            if (idx !== showTimeIndex && time) {
                              const existingTime = new Date(
                                `1970-01-01T${time}:00`
                              );
                              const timeDifference =
                                Math.abs(selectedTime - existingTime) /
                                (1000 * 60 * 60);

                              return timeDifference >= 4;
                            }
                            return true;
                          }
                        );

                        if (isValidTime) {
                          const updatedScreens = screens.map((screen, i) => {
                            if (i === screenIndex) {
                              return {
                                ...screen,
                                showTimes: screen.showTimes.map((time, idx) =>
                                  idx === showTimeIndex ? newShowTime : time
                                ),
                              };
                            }
                            return screen;
                          });
                          setScreens(updatedScreens);
                        } else {
                          toast.error(
                            "Showtimes must be at least 4 hours apart."
                          );
                        }
                      }}
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
                  onClick={() => {
                    const updatedScreens = screens.map((screen) => ({
                      ...screen,
                      showTimes: [...screen.showTimes],
                    }));
                    updatedScreens[screenIndex].showTimes.push("");
                    setScreens(updatedScreens);
                  }}
                  className="mb-3"
                  disabled={screen.showTimes.length >= 4}
                >
                  Add Show Time
                </Button>

                <br />
                <Form.Label className="mt-3">Seats</Form.Label>
                <EditSeatSelection
                  screenIndex={screenIndex}
                  seats={screen.seats}
                  handleSeatChange={handleSeatChange}
                />
              </div>
            ))}

            <Button type="submit" variant="primary" className="mt-3">
              Submit
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
}

export default TheatreEditScreen;
