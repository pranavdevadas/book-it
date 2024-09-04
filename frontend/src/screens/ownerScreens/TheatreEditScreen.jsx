import React, { useState, useEffect } from "react";
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

function TheatreEditScreen() {
  const { id } = useParams();
  const [theatre, setTheatre] = useState(null);
  const [screens, setScreens] = useState([]);

  let navigate = useNavigate();

  const { data, error, isLoading, refetch } = useGetTheatreByIdQuery(id);
  const [editTheatre] = useOwnerEditTheatreMutation();
  const { data: cities = [] } = useGetCitiesQuery();

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
    const locationPattern =
      /^https:\/\/maps\.app\.goo\.gl\/|^maps\.app\.goo\.gl\//;
    const pricePattern = /^[0-9]{2,3}$/;

    if (!namePattern.test(theatre?.name || "")) {
      toast.error("Invalid theatre name.");
      return false;
    }
    if (!locationPattern.test(theatre?.location || "")) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await editTheatre({ id, formData: { ...theatre, screens } }).unwrap();
      toast.success("Theatre updated successfully");
      navigate("/owner/theatres");
    } catch (error) {
      toast.error("Failed to update theatre");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading theatre</p>;

  return (
    <div className="d-flex">
      <SideBarOwner />  
      <div className="content">
        <FormContainer >
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
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={theatre?.location || ""}
                onChange={(e) =>
                  setTheatre({ ...theatre, location: e.target.value })
                }
                required
              />
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
                    value={screen.name}
                    onChange={(e) => {
                      const updatedScreens = [...screens];
                      updatedScreens[screenIndex].name = e.target.value;
                      setScreens(updatedScreens);
                    }}
                    required
                  />
                </Form.Group>

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
                      onChange={(e) => {
                        const updatedScreens = [...screens];
                        updatedScreens[screenIndex].showTimes[showTimeIndex] =
                          e.target.value;
                        setScreens(updatedScreens);
                      }}
                      required
                    />
                  </Form.Group>
                ))}
                <br />
                <Button
                  variant="dark"
                  onClick={() => {
                    const updatedScreens = [...screens];
                    updatedScreens[screenIndex].showTimes.push("");
                    setScreens(updatedScreens);
                  }}
                  className="mb-3"
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
