import React from "react";
import "./style.css";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { FaRegUserCircle, FaHome, FaCity } from "react-icons/fa";
import { MdLocalMovies, MdOutlineTheaters } from "react-icons/md";
import { BiSolidMoviePlay } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useOwnerLogoutMutation } from "../../slice/ownerSlice/ownerApiSlice";
import { clearOwnerCredentials } from "../../slice/ownerSlice/ownerAuthSlice";
import { toast } from "react-toastify";

function SideBarOwner() {
  const { ownerInfo } = useSelector((state) => state.ownerAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [clearCredentialsApiCall] = useOwnerLogoutMutation();

  const logoutHandler = async () => {
    try {
      await clearCredentialsApiCall().unwrap();
      dispatch(clearOwnerCredentials());
      navigate("/owner/login");
      toast.success("Logout Success");
    } catch (err) {
      toast.error("Logout Failed");
    }
  };

  return (
    <>
      <div className="sidebar-container">
        <CDBSidebar className="sidebar">
          {/* <CDBSidebarHeader prefix={<i className="fa fa-bars" />}> */}
          <CDBSidebarHeader>Book It</CDBSidebarHeader>
          <CDBSidebarContent className="d-flex flex-column">
            <Nav className="flex-fill">
              <CDBSidebarMenu>
                <CDBSidebarMenuItem>
                  <LinkContainer to="/owner/home">
                    <Nav.Link>
                      <FaHome /> &nbsp;Homepage
                    </Nav.Link>
                  </LinkContainer>
                </CDBSidebarMenuItem>

                <CDBSidebarMenuItem>
                  <LinkContainer to="/owner/theatres">
                    <Nav.Link>
                      <MdOutlineTheaters /> &nbsp;Theatres
                    </Nav.Link>
                  </LinkContainer>
                </CDBSidebarMenuItem>

                <CDBSidebarMenuItem>
                  <LinkContainer to="/owner/now-showing">
                    <Nav.Link>
                      <BiSolidMoviePlay /> &nbsp;Now Showing
                    </Nav.Link>
                  </LinkContainer>
                </CDBSidebarMenuItem>

                {/* <LinkContainer to="/owner/users">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <FaRegUserCircle /> &nbsp;Users
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer> */}

                {/* <LinkContainer to="/owner/owners">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <MdLocalMovies /> &nbsp;Owners
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer> */}

                {/* <LinkContainer to="/owner/city">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <FaCity /> &nbsp;City Managment
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer> */}
              </CDBSidebarMenu>
            </Nav>

            <div className="mt-auto">
              <CDBSidebarMenuItem>
                <Nav.Link onClick={logoutHandler}>
                  <LuLogOut /> &nbsp;Logout
                </Nav.Link>
              </CDBSidebarMenuItem>
            </div>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </>
  );
}

export default SideBarOwner;
