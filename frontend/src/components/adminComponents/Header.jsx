import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useAdminLogoutMutation } from "../../slice/adminSlice/adminApiSlice";
import { clearAdminCredentials } from "../../slice/adminSlice/adminAuthSlice";
import { toast } from "react-toastify";

function Header() {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [clearCredentialsApiCall] = useAdminLogoutMutation();

  const logoutHandler = async () => {
    try {
      await clearCredentialsApiCall().unwrap();
      dispatch(clearAdminCredentials());
      navigate("/admin/login");
      toast.success("Logout Success");
    } catch (err) {
      toast.error("Logout Failed");
    }
  };

  return (
    <header>
      <Navbar style={{backgroundColor:'rgb(17, 24, 39)'}} variant="dark" expand="lg" collapseOnSelect >
        <Container style={{height:'59px'}}>
          <LinkContainer to="/admin/home">
            <Navbar.Brand>Book it</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <LinkContainer to="/admin/home">
                <Nav.Link>ADMIN</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              {adminInfo ? (
                <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
              ) : (
                <LinkContainer to="/admin/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
