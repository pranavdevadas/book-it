import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/ownerComonents/FormContainer";
import {
  useGetTheatresQuery,
  useGetAllMoviesQuery,
  useAddShowMutation,
} from "../../slice/ownerSlice/ownerApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SideBarOwner from "../../components/ownerComonents/SideBar";

function ShowAddScreen() {
  const [movie, setMovie] = useState("");
  const [language, setLanguage] = useState("");
  const [theatre, setTheatre] = useState("");
  const [screen, setScreen] = useState("");
  const [showTimes, setShowTimes] = useState([""]);
  const [availableShowTimes, setAvailableShowTimes] = useState([]);

  let navigate = useNavigate();

  const { data: movies } = useGetAllMoviesQuery();
  const { data: theatres } = useGetTheatresQuery();
  const [addShow, { isLoading, isError, error }] = useAddShowMutation();

  useEffect(() => {
    if (screen) {
      const selectedScreen = theatres
        .find((t) => t._id === theatre)
        ?.screens.find((s) => s.name === screen);

      setAvailableShowTimes(selectedScreen ? selectedScreen.showTimes : []);
    }
  }, [screen, theatre, theatres]);

  const handleMovieChange = (e) => {
    setMovie(e.target.value);
  };

  const handleTheatreChange = (e) => {
    setTheatre(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleShowTimeChange = (index, value) => {
    const newShowTimes = [...showTimes];
    newShowTimes[index] = value;
    setShowTimes(newShowTimes);
  };

  const addShowTimeField = () => {
    setShowTimes([...showTimes, ""]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (movie && language && theatre && screen && showTimes.length > 0) {
      try {
        await addShow({
          movie,
          language,
          theatre,
          screen,
          showtime: showTimes,
        }).unwrap();
        toast.success("Show added successfully!");
        navigate("/owner/now-showing");
      } catch (err) {
        console.error("Failed to add show:", err);
        toast.error("Failed to add show. Please try again.");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  return (
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <FormContainer>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="movie">
              <Form.Label>Movie</Form.Label>
              <Form.Control
                as="select"
                value={movie}
                onChange={handleMovieChange}
              >
                <option value="">Select Movie</option>
                {movies &&
                  movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Control
                as="select"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="">Select Language</option>
                {movie &&
                  movies
                    .find((m) => m._id === movie)
                    .language.map((lang, index) => (
                      <option key={index} value={lang}>
                        {lang}
                      </option>
                    ))}
              </Form.Control>
            </Form.Group>

            {/* Theatre Selection */}
            <Form.Group controlId="theatre">
              <Form.Label>Theatre</Form.Label>
              <Form.Control
                as="select"
                value={theatre}
                onChange={handleTheatreChange}
              >
                <option value="">Select Theatre</option>
                {theatres &&
                  theatres.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            {/* Screen Selection */}
            <Form.Group controlId="screen">
              <Form.Label>Screen</Form.Label>
              <Form.Control
                as="select"
                value={screen}
                onChange={(e) => setScreen(e.target.value)}
              >
                <option value="">Select Screen</option>
                {theatre &&
                  theatres
                    .find((t) => t._id === theatre)
                    ?.screens.map((s, index) => (
                      <option key={index} value={s.name}>
                        {s.name}
                      </option>
                    ))}
              </Form.Control>
            </Form.Group>

            <br />
            {/* Show Time Selection */}
            {showTimes.map((time, index) => {
              const currentAvailableShowTimes = availableShowTimes.filter(
                (st) => !showTimes.includes(st) || st === time
              );

              return (
                <Form.Group controlId={`showTime-${index}`} key={index}>
                  <Row>
                    <Col>
                      <Form.Label>Show Time {index + 1}</Form.Label>
                      <Form.Control
                        as="select"
                        value={time}
                        onChange={(e) =>
                          handleShowTimeChange(index, e.target.value)
                        }
                      >
                        <option value="">Select Show Time</option>
                        {currentAvailableShowTimes.map((st, idx) => (
                          <option
                            key={idx}
                            value={st}
                            disabled={showTimes.includes(st) && st !== time}
                          >
                            {st}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </Form.Group>
              );
            })}

            <br />
            {/* Add Show Time Button */}
            {showTimes[showTimes.length - 1] &&
              availableShowTimes.length > showTimes.length && (
                <Button variant="secondary" onClick={addShowTimeField}>
                  Add Show Time
                </Button>
              )}
            <br />
            <br />
            <Button
              type="submit"
              variant="dark"
              className="mt-3"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Show"}
            </Button>

            {isError && toast.error(error?.data?.message || error?.message)}
          </Form>
        </FormContainer>
      </div>
    </div>
  );
}

export default ShowAddScreen;
