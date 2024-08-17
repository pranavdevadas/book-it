import { Navbar, Nav, Container, NavDropdown, Badge, Toast } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useLogoutMutation } from "../../slice/userSlice/userApiSlice";
import { clearCredentials } from '../../slice/userSlice/userAuthSlice'
import { toast } from 'react-toastify'

function Header() {
  let { userInfo } = useSelector((state) => state.auth);
  
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let [ clearCredentialsApiCall ] = useLogoutMutation()


  let logoutHandler = async () => {
    try {
      await clearCredentialsApiCall().unwrap()
      dispatch(clearCredentials())
      navigate('/login')
      toast.success('Logout Success')
    } catch (error) {
      
    }
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
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
                  <NavDropdown title={userInfo.name} id="userName">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={ logoutHandler }>Logout</NavDropdown.Item>
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
