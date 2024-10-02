import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetMovieByIdQuery,
  useEditMovieMutation,
} from "../../slice/adminSlice/adminApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";
import FormContainer from "../../components/userComponents/FormContainer.jsx";
import { Form, Button } from "react-bootstrap";
import SideBarAdmin from "../../components/adminComponents/SideBar.jsx";

const categoriesOptions = ["Action", "Comedy", "Drama", "Horror", "Romance"];
const languagesOptions = ["English", "Malayalam", "Hindi", "Telugu", "Tamil"];
function MovieEditScreen() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading: loadingMovie,
    refetch,
  } = useGetMovieByIdQuery(movieId);
  const [editMovie, { isLoading: loadingEdit }] = useEditMovieMutation();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [categories, setCategories] = useState([]);
  const [language, setLanguage] = useState([]);
  const [cast, setCast] = useState("");
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (movie) {
      setName(movie.name);
      setDuration(movie.duration);
      setCategories(movie.categories);
      setLanguage(movie.language);
      setCast(movie.cast.join(", "));
      setPreview(`https://bookitt.online/moviePoster/${movie.poster}`);
      refetch();
    }
  }, [movie, refetch]);

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

  const handleCategoriesChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setCategories(selectedCategories);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguages = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setLanguage(selectedLanguages);
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
    formData.append("categories", JSON.stringify(categories));
    formData.append("language", JSON.stringify(language));
    formData.append(
      "cast",
      cast.split(",").map((actor) => actor.trim())
    );
    if (poster) {
      formData.append("poster", poster);
    }

    try {
      await editMovie({ id: movieId, formData }).unwrap();
      toast.success("Movie updated successfully");
      navigate("/admin/movies");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update movie");
    }
  };

  return (
    <div className="d-flex">
      <SideBarAdmin />
      <div className="content">
        <FormContainer>
          <h1>Edit Movie</h1>
          {loadingMovie || loadingEdit ? (
            <Loader />
          ) : (
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
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter duration (HH:MM)"
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
                  onChange={handleCategoriesChange}
                  required
                >
                  {categoriesOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="language" className="mb-3">
                <Form.Label>Language</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={language}
                  onChange={handleLanguageChange}
                  required
                >
                  {languagesOptions.map((lang) => (
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
                  placeholder="Enter cast (comma separated)"
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
                Update Movie
              </Button>
            </Form>
          )}
        </FormContainer>
      </div>
    </div>
  );
}

export default MovieEditScreen;
