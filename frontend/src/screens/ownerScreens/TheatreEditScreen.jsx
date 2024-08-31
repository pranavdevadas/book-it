import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer";
import EditSeatSection from "../../components/ownerComonents/EditSeatSEction";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  useGetTheatreByIdQuery,
  useOwnerEditTheatreMutation,
  useGetCitiesQuery
} from "../../slice/ownerSlice/ownerApiSlice";

function TheatreEditScreen() {
  const { id } = useParams();
  const [theatre, setTheatre] = useState(null);
  const [screens, setScreens] = useState([]);

  const { data, error, isLoading } = useGetTheatreByIdQuery(id); 
  const [editTheatre] = useOwnerEditTheatreMutation();
  const { data: cities = [] } = useGetCitiesQuery();
  
  useEffect(() => {
    if (data) {
      setTheatre(data);
      const screensWithSeatsArray = (data.screens || []).map(screen => ({
        ...screen,
        seats: Array.isArray(screen.seats) ? screen.seats : Object.values(screen.seats)
      }));
      setScreens(screensWithSeatsArray);
    }
  }, [data]);  

  const handleSeatChange = (screenIndex, row, col) => {
    const updatedScreens = [...screens];
    const currentSeats = updatedScreens[screenIndex].seats || [];

    const seatIndex = currentSeats.findIndex(seat => seat.row === row && seat.col === col);

    if (seatIndex >= 0) {
      currentSeats[seatIndex].isAvailable = !currentSeats[seatIndex].isAvailable;
    } else {
      currentSeats.push({
        seatNumber: row * 12 + col + 1,
        isAvailable: true,
        isBooked: false,
        row,
        col
      });
    }

    updatedScreens[screenIndex].seats = currentSeats;
    setScreens(updatedScreens);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editTheatre({ id, formData: { ...theatre, screens } }).unwrap();
      toast.success('Theatre updated successfully');
    } catch (error) {
      toast.error('Failed to update theatre');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading theatre</p>;

  return (
    <FormContainer style={{ marginTop: "-611px", marginLeft: "200px" }}>
      <h1>Edit Theatre</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Theatre Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter theatre name"
            value={theatre?.name || ''}
            onChange={(e) => setTheatre({ ...theatre, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={theatre?.location || ''}
            onChange={(e) => setTheatre({ ...theatre, location: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            as="select"
            value={theatre?.city || ''}
            onChange={(e) => setTheatre({ ...theatre, city: e.target.value })}
            required
          >
            <option value="" disabled>Select a city</option>
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
            type="text"
            placeholder="Enter ticket price"
            value={theatre?.ticketPrice || ''}
            onChange={(e) => setTheatre({ ...theatre, ticketPrice: e.target.value })}
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
              <Form.Group controlId={`showTime-${screenIndex}-${showTimeIndex}`} key={showTimeIndex}>
                <Form.Label>Show Time</Form.Label>
                <Form.Control
                  type="time"
                  style={{ width: "22%" }}
                  value={showTime}
                  onChange={(e) => {
                    const updatedScreens = [...screens];
                    updatedScreens[screenIndex].showTimes[showTimeIndex] = e.target.value;
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
                updatedScreens[screenIndex].showTimes.push('');
                setScreens(updatedScreens);
              }}
              className="mb-3"
            >
              Add Show Time
            </Button>

            <br />
            <Form.Label className="mt-3">Seats</Form.Label>
            <EditSeatSection
              seats={screen.seats || []}
              handleSeatChange={(row, col) => handleSeatChange(screenIndex, row, col)}
            />
          </div>
        ))}

        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
}

export default TheatreEditScreen;
