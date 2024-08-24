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

function MovieEditScreen() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const { data: movie, isLoading: loadingMovie, refetch } = useGetMovieByIdQuery(movieId);
  const [editMovie, { isLoading: loadingEdit }] = useEditMovieMutation();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [categories, setCategories] = useState("");
  const [language, setLanguage] = useState("");
  const [cast, setCast] = useState("");
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (movie) {
      setName(movie.name);
      setDuration(movie.duration);
      setCategories(movie.categories.join(", "));
      setLanguage(movie.language.join(", "));
      setCast(movie.cast.join(", "));
      setPreview(`http://localhost:5000/moviePoster/${movie.poster}`)
      refetch()
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

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("duration", duration);
    formData.append("categories", categories);
    formData.append(
      "language",
      language.split(",").map((lang) => lang.trim())
    );
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
    <FormContainer style={{ marginTop: "-611px", marginLeft: "200px" }}>
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
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="categories" className="mb-3">
            <Form.Label>Categories</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="language" className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            ></Form.Control>
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
  );
}

export default MovieEditScreen;
