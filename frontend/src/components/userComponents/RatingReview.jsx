import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Card } from "react-bootstrap";
import ReactStars from "react-stars";
import {
  useAddRatingAndReviewMutation,
  useGetAllReviewsQuery,
} from "../../slice/userSlice/userApiSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";


function RatingForm({ movieId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [addRatingAndReview] = useAddRatingAndReviewMutation();

  const {
    data: reviews,
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllReviewsQuery({ movieId });

  useEffect(() => {
    refetch()
  },[refetch])

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = (event) => {
      if (scrollContainer) {
        event.preventDefault();
        scrollContainer.scrollLeft += event.deltaY;
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleScroll, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    toast.error(error?.data?.message || error.message);
    return null;
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (review.trim().split(/\s+/).length < 5) {
      toast.error("Review must be at least 5 words long.");
      return;
    }
    try {
      const response = await addRatingAndReview({
        movieId,
        rating,
        review,
      }).unwrap();
      toast.success(response.message);
      setRating(0);
      setReview("");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <div className="ms-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <ReactStars
            count={5}
            value={rating}
            onChange={handleRatingChange}
            size={24}
            color2={"#ffd700"}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Control
            style={{ width: "500px", height: "200px" }}
            as="textarea"
            rows={3}
            value={review}
            onChange={handleReviewChange}
            placeholder="Write your review here..."
          />
        </Form.Group>
        <Button type="submit" variant="warning" className="mt-3">
          Submit Review
        </Button>
      </Form>
      <br />
      <div
        ref={scrollContainerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: "1rem",
          gap: "1rem",
          paddingLeft: "1rem",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="scroll-container"
      >
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card
              key={review._id}
              className="mb-3 shadow"
              style={{ flex: "0 0 auto", width: "300px", height: "250px" }}
            >
              <Card.Body>
                <Card.Title className="fw-bold">{review.movie.name}</Card.Title>
                <br />
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={24}
                  color2={"#ffd700"}
                  edit={false}
                />
                <Card.Text>{review.review}</Card.Text>
                <div className="d-flex justify-content-between align-items-end mt-auto">
                  <Card.Text className="text-muted">
                    {new Date(review.date).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text className="text-muted">
                    - {review.user.name}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default RatingForm;
