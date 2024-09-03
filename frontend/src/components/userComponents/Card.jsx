import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import cardPic from "../../assets/cardSample.jpeg";

function UserCard() {
  return (
    <>
      <h1 className="mt-4 text-center fw-bold">Trending Movies</h1>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <Card style={{ width: "75%" }}>
              <Card.Img
                variant="top"
                src={cardPic}
                className="img-fluid"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card style={{ width: "75%" }}>
              {" "}
              <Card.Img
                variant="top"
                src={cardPic}
                className="img-fluid"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card style={{ width: "75%" }}>
              <Card.Img
                variant="top"
                src={cardPic}
                className="img-fluid"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <Card style={{ width: "75%" }}>
              <Card.Img
                variant="top"
                src={cardPic}
                className="img-fluid"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card style={{ width: "75%" }}>
              <Card.Img
                variant="top"
                src={cardPic}
                className="img-fluid"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserCard;
