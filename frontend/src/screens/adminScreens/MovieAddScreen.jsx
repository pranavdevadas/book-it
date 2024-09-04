import React, { useState } from "react";
import { useAddMovieMutation } from "../../slice/adminSlice/adminApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";
import FormContainer from "../../components/userComponents/FormContainer.jsx";
import { Form, Button } from "react-bootstrap";
import SideBarAdmin from "../../components/adminComponents/SideBar.jsx";
import { useNavigate } from "react-router-dom";

function MovieAddScreen() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("00:00");
  const [categories, setCategories] = useState([]);
  const [language, setLanguage] = useState([]);
  const [cast, setCast] = useState("");
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState(null);

  const [addMovie, { isLoading }] = useAddMovieMutation();

  const navigate = useNavigate()

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    setPoster(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      toast.error("Invalid movie name");
      isValid = false;
    }

    const [hours, minutes] = duration.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 60 || totalMinutes > 240) {
      toast.error("Invalid duration");
      isValid = false;
    }

    if (categories.length === 0) {
      toast.error("Categories cannot be empty");
      isValid = false;
    }

    if (language.length === 0) {
      toast.error("Languages cannot be empty");
      isValid = false;
    }

    if (cast.trim() === "") {
      toast.error("Cast cannot be empty");
      isValid = false;
    }

    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("duration", duration);
    formData.append("categories", categories);
    formData.append("language", language);
    formData.append(
      "cast",
      cast.split(",").map((actor) => actor.trim())
    );
    formData.append("poster", poster);

    try {
      await addMovie(formData).unwrap();
      toast.success("Movie added successfully");
      navigate('/admin/movies')
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add movie");
    }
  };

  const predefinedCategories = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
  ];
  const predefinedLanguages = [
    "English",
    "Malayalam",
    "Hindi",
    "Telugu",
    "Tamil",
  ];

  return (
    <div className="d-flex">
      <SideBarAdmin />
      <div className="content">
        <FormContainer>
          <h1>Add Movie</h1>
          {isLoading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Movie Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter movie name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="duration" className="mb-3">
              <Form.Label>Duration In Hour</Form.Label>
              <Form.Control
                type="time"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="categories" className="mb-3">
              <Form.Label>Categories</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={categories}
                onChange={(e) =>
                  setCategories(
                    [...e.target.selectedOptions].map((option) => option.value)
                  )
                }
                required
              >
                {predefinedCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="language" className="mb-3">
              <Form.Label>Languages</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={language}
                onChange={(e) =>
                  setLanguage(
                    [...e.target.selectedOptions].map((option) => option.value)
                  )
                }
                required
              >
                {predefinedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="cast" className="mb-3">
              <Form.Label>Cast</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter cast"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="poster" className="mb-3">
              <Form.Label>Movie Poster</Form.Label>
              <Form.Control
                type="file"
                onChange={handlePosterChange}
                required
              ></Form.Control>
            </Form.Group>

            {preview && (
              <div className="mb-3">
                <img
                  src={preview}
                  alt="Movie Poster Preview"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <Button type="submit" variant="dark">
              Add Movie
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
}

export default MovieAddScreen;
