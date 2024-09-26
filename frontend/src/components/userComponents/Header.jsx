import {
  Navbar,
  Nav,
  Container,
  Popover,
  OverlayTrigger,
  NavDropdown,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaRegBookmark } from "react-icons/fa";
import { RiProfileLine } from "react-icons/ri";
import { FaWallet } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
  useLogoutMutation,
  useGetSavedMoviesQuery,
  useRemoveSavedMovieMutation,
  useAddSavedMoviesMutation,
} from "../../slice/userSlice/userApiSlice";
import { clearCredentials } from "../../slice/userSlice/userAuthSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";

function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: initialMoviesList = { items: [] },
    isLoading,
    refetch,
  } = useGetSavedMoviesQuery();
  const [moviesList, setMoviesList] = useState(initialMoviesList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clearCredentialsApiCall] = useLogoutMutation();
  const [showPopover, setShowPopover] = useState(false);

  const [removesavedmovie] = useRemoveSavedMovieMutation();
  const [addsavedmovie] = useAddSavedMoviesMutation();

  useEffect(() => {
    if (moviesList.items.length !== initialMoviesList.items.length) {
      setMoviesList(initialMoviesList);
    }
  }, [initialMoviesList, moviesList.items.length]);

  const logoutHandler = async () => {
    try {
      await clearCredentialsApiCall().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
      toast.success("Logout Success");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const popover = (
    <Popover variant="dark" id="saved-movies-popover">
      <Popover.Body>
        {isLoading ? (
          <Loader />
        ) : (
          <div
            style={{ maxHeight: "300px", width: "250px", overflowY: "auto" }}
          >
            {moviesList.items.length > 0 ? (
              moviesList.items.map((item) => (
                <div
                  key={item.movie._id}
                  onClick={() => navigate(`/movie/${item.movie._id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    cursor: "pointer",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {item.movie.poster && (
                      <img
                        src={`http://localhost:5000/moviePoster/${item.movie.poster}`}
                        alt={item.movie.name}
                        style={{
                          width: "50px",
                          height: "75px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <span>{item.movie.name}</span>
                  </div>
                  <IoCloseSharp
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMovie(item.movie._id);
                    }}
                    style={{
                      cursor: "pointer",
                      color: "red",
                      marginLeft: "-120px",
                    }}
                  />
                </div>
              ))
            ) : (
              <div>No saved movies</div>
            )}
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  const handleRemoveMovie = async (movieId) => {
    try {
      await removesavedmovie(movieId).unwrap();
      toast.success("Movie removed Successfully");
      setMoviesList((prevList) => ({
        ...prevList,
        items: prevList.items.filter((item) => item.movie._id !== movieId),
      }));
    } catch (error) {
      toast.error("Failed to remove movie");
    }
  };

  const handleAddMovie = async (movieId) => {
    try {
      await addsavedmovie(movieId).unwrap();
      toast.success("Movie added Successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to add movie");
    }
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
              {userInfo && (
                <LinkContainer to="/ticket">
                  <Nav.Link>Ticket</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  
                  <OverlayTrigger
                    placement="bottom"
                    overlay={popover}
                    show={showPopover}
                    onToggle={() => setShowPopover(!showPopover)}
                  >
                    <Nav.Link>
                      <FaRegBookmark  /> Saved Movies
                    </Nav.Link>
                  </OverlayTrigger>
                  <LinkContainer to="/messages">
                    <Nav.Link>
                      <FaRegMessage /> 
                    </Nav.Link>
                  </LinkContainer> 
                  <NavDropdown title={userInfo.name} id="userName">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>
                        <RiProfileLine /> Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/wallet">
                      <NavDropdown.Item>
                        <FaWallet /> Wallet
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      <FaSignOutAlt /> Logout
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
