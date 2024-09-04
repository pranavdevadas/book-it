import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useOwnerLogoutMutation } from "../../slice/ownerSlice/ownerApiSlice";
import { clearOwnerCredentials } from "../../slice/ownerSlice/ownerAuthSlice";
import { toast } from "react-toastify";

function Header() {
  const { ownerInfo } = useSelector((state) => state.ownerAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [clearCredentialsApiCall] = useOwnerLogoutMutation();

  const logoutHandler = async () => {
    try {
      await clearCredentialsApiCall().unwrap();
      dispatch(clearOwnerCredentials());
      navigate("/owner/login");
      toast.success("Logged Out");
    } catch (err) {
      toast.error("Logout Failed");
    }
  };

  return (
    <header>
      <Navbar
        style={{ backgroundColor: "rgb(17, 24, 39)", height: "75px" }}
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/owner/home">
            <Navbar.Brand>THEATRE</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Navbar.Brand>THEATRE OWNER</Navbar.Brand>
            </Nav>
            <Nav className="ms-auto">
              {ownerInfo ? (
                <>
                  <NavDropdown title={ownerInfo.name} id="userName">
                    <LinkContainer to="/owner/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/owner/login">
                    <Nav.Link>
                      <FaSignInAlt /> Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/owner/register">
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
