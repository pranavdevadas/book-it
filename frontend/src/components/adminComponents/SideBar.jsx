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
import { useAdminLogoutMutation } from "../../slice/adminSlice/adminApiSlice";
import { clearAdminCredentials } from "../../slice/adminSlice/adminAuthSlice";
import { toast } from "react-toastify";

function SideBarAdmin() {
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
    <>
      <div className="sidebar-container">
        <CDBSidebar className="sidebar">
          <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
            Admin
          </CDBSidebarHeader>
          <CDBSidebarContent>
            <Nav>
              <CDBSidebarMenu>
                <LinkContainer to="/admin/home">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <FaHome /> &nbsp;Homepage
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer>

                <LinkContainer to="/admin/users">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <FaRegUserCircle /> &nbsp;Users
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer>

                <LinkContainer to="/admin/owners">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <MdLocalMovies /> &nbsp;Owners
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer>

                <LinkContainer to="/admin/owners">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <FaCity /> &nbsp;City Managment
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer>

                <LinkContainer to="/admin/movies">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <BiSolidMoviePlay /> &nbsp;Movies
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer>

                <LinkContainer to="/admin/theatres">
                  <CDBSidebarMenuItem>
                    <Nav.Link>
                      <MdOutlineTheaters /> &nbsp;Theatres
                    </Nav.Link>
                  </CDBSidebarMenuItem>
                </LinkContainer>
                <CDBSidebarMenuItem>
                  <Nav.Link onClick={logoutHandler}>
                    <LuLogOut /> &nbsp;Logout
                  </Nav.Link>
                </CDBSidebarMenuItem>
              </CDBSidebarMenu>
            </Nav>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </>
  );
}

export default SideBarAdmin;
