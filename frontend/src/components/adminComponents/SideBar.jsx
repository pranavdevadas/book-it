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
import { useDispatch } from "react-redux";
import { useAdminLogoutMutation } from "../../slice/adminSlice/adminApiSlice";
import { clearAdminCredentials } from "../../slice/adminSlice/adminAuthSlice";
import { toast } from "react-toastify";

function SideBarAdmin() {
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
    <div className="sidebar-container">
      <CDBSidebar>
        <CDBSidebarHeader>Book It</CDBSidebarHeader>
        <CDBSidebarContent className="d-flex flex-column">
          <Nav className="flex-fill">
            <CDBSidebarMenu>
              <CDBSidebarMenuItem>
                <LinkContainer to="/admin/home">
                  <Nav.Link>
                    <FaHome /> &nbsp;Homepage
                  </Nav.Link>
                </LinkContainer>
              </CDBSidebarMenuItem>

              <CDBSidebarMenuItem>
                <LinkContainer to="/admin/users">
                  <Nav.Link>
                    <FaRegUserCircle /> &nbsp;Users
                  </Nav.Link>
                </LinkContainer>
              </CDBSidebarMenuItem>

              <CDBSidebarMenuItem>
                <LinkContainer to="/admin/owners">
                  <Nav.Link>
                    <MdLocalMovies /> &nbsp;Owners
                  </Nav.Link>
                </LinkContainer>
              </CDBSidebarMenuItem>

              <CDBSidebarMenuItem>
                <LinkContainer to="/admin/cities">
                  <Nav.Link>
                    <FaCity /> &nbsp;City Management
                  </Nav.Link>
                </LinkContainer>
              </CDBSidebarMenuItem>

              <CDBSidebarMenuItem>
                <LinkContainer to="/admin/movies">
                  <Nav.Link>
                    <BiSolidMoviePlay /> &nbsp;Movies
                  </Nav.Link>
                </LinkContainer>
              </CDBSidebarMenuItem>

              <CDBSidebarMenuItem>
                <LinkContainer to="/admin/theatres">
                  <Nav.Link>
                    <MdOutlineTheaters /> &nbsp;Theatres
                  </Nav.Link>
                </LinkContainer>
              </CDBSidebarMenuItem>
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
  );
}

export default SideBarAdmin;
