import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import ReactStars from "react-stars";
import { useAddRatingAndReviewMutation } from "../../slice/userSlice/userApiSlice";
import { toast } from "react-toastify";

function RatingForm({ movieId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [addRatingAndReview] = useAddRatingAndReviewMutation();

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
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
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
  );
}

export default RatingForm;
