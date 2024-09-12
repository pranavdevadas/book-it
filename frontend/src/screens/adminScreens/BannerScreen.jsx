import React, { useState, useEffect } from "react";
import SideBarAdmin from "../../components/adminComponents/SideBar.jsx";
import FormContainer from "../../components/userComponents/FormContainer";
import { Form, Button, Container } from "react-bootstrap";
import {
  useBannerManagmentMutation,
  useGetBannerQuery,
} from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";

function BannerScreen() {
  const {
    data: banner,
    isLoading: isBannerLoading,
    error: bannerError,
  } = useGetBannerQuery();
  const [poster, setPoster] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
  });
  const [preview, setPreview] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
  });

  const [bannerManagment, { isLoading: isUpdating }] =
    useBannerManagmentMutation();

  useEffect(() => {
    if (banner) {
      setPreview({
        banner1: banner.banner1
          ? `http://localhost:5000/${banner.banner1}`
          : null,
        banner2: banner.banner2
          ? `http://localhost:5000/${banner.banner2}`
          : null,
        banner3: banner.banner3
          ? `http://localhost:5000/${banner.banner3}`
          : null,
      });
    }
  }, [banner]);

  const handleBannerChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setPoster((prev) => ({ ...prev, [name]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("banner1", poster.banner1);
    formData.append("banner2", poster.banner2);
    formData.append("banner3", poster.banner3);

    try {
      await bannerManagment(formData);
      toast.success("Banners updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <SideBarAdmin />
      <Container>
        <FormContainer>
          <h1>Banner Management</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="banner1" className="mb-3">
              <Form.Label>Banner 1</Form.Label>
              <Form.Control
                type="file"
                name="banner1"
                onChange={handleBannerChange}
              />
            </Form.Group>
            {preview.banner1 && (
              <div className="mb-3">
                <img
                  src={preview.banner1}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                  alt="Banner 1 Preview"
                />
              </div>
            )}

            <Form.Group controlId="banner2" className="mb-3">
              <Form.Label>Banner 2</Form.Label>
              <Form.Control
                type="file"
                name="banner2"
                onChange={handleBannerChange}
              />
            </Form.Group>
            {preview.banner2 && (
              <div className="mb-3">
                <img
                  src={preview.banner2}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                  alt="Banner 2 Preview"
                />
              </div>
            )}

            <Form.Group controlId="banner3" className="mb-3">
              <Form.Label>Banner 3</Form.Label>
              <Form.Control
                type="file"
                name="banner3"
                onChange={handleBannerChange}
              />
            </Form.Group>
            {preview.banner3 && (
              <div className="mb-3">
                <img
                  src={preview.banner3}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                  alt="Banner 3 Preview"
                />
              </div>
            )}

            <Button type="submit" variant="dark" disabled={isUpdating}>
              Submit
            </Button>
          </Form>
        </FormContainer>
      </Container>
    </>
  );
}

export default BannerScreen;
