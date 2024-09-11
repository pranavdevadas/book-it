import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useLogoutMutation } from "../../slice/userSlice/userApiSlice";
import { clearCredentials } from "../../slice/userSlice/userAuthSlice";
import { useGetCitiesQuery } from "../../slice/adminSlice/adminApiSlice";
import { toast } from "react-toastify";
import { FaRegBookmark } from "react-icons/fa6";

function Header() {
  let { userInfo } = useSelector((state) => state.auth);
  const { data: cities = [], isLoading, error, refetch } = useGetCitiesQuery();

  const [selectedCity, setSelectedCity] = useState("Select city");

  useEffect(() => {
    refetch();
  }, [refetch]);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  let [clearCredentialsApiCall] = useLogoutMutation();

  let logoutHandler = async () => {
    try {
      await clearCredentialsApiCall().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
      toast.success("Logout Success");
    } catch (error) {}
  };

  return (
    <header>
      <Navbar
        style={{ backgroundColor: "rgb(17, 24, 39)" }}
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Book it</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/movie">
                <Nav.Link>Movie</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  <LinkContainer to="/saved-movies">
                    <Nav.Link>
                      <FaRegBookmark variant="light" /> Saved Movies
                    </Nav.Link>
                  </LinkContainer>
                  <NavDropdown title={userInfo.name} id="userName">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt /> Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaSignOutAlt /> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
