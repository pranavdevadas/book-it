import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer.jsx";
import { useAddCityMutation } from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";

function CityAddScreen() {
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const [addCity, { isLoading }] = useAddCityMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    const cityRegex = /^[A-Za-z\s]{3,}$/;
    if (!cityRegex.test(name)) {
      toast.error("Invalid city name");
      return;
    }
    try {
      await addCity({ name }).unwrap();

      navigate("/admin/cities");
      toast.success("City Added Successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer style={{ marginTop: "-611px", marginLeft: "200px" }}>
      <h1>Add City</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="city">
          <Form.Label>City Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {isLoading && <Loader />}
        <Button type="submit" variant="primary" className="mt-3">
          Add
        </Button>
      </Form>
    </FormContainer>
  );
}

export default CityAddScreen;
