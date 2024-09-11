import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/userComponents/Header.jsx";
import AdminHeader from "./components/adminComponents/Header.jsx";
import OwnerHeader from "./components/ownerComonents/Header.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import Footer from "./components/userComponents/Footer.jsx";

function App() {
  let location = useLocation();
  let isAdminPage = location.pathname.startsWith("/admin");
  let isOwnerPage = location.pathname.startsWith("/owner");

  let isAdminLoginPage = location.pathname === "/admin/login";
  let isOwnerAuthPage = ["/owner/login", "/owner/register", "/owner/otp"].includes(location.pathname);

  let containerClass = !isAdminPage && !isOwnerPage ? 'user-page-background' : 'admin-owner-background'; 

  return (
    <>
      {!isAdminLoginPage && !isOwnerAuthPage && (
        <>
          {isAdminPage ? (
            <>
              <AdminHeader />
            </>
          ) : isOwnerPage ? (
            <>
              <OwnerHeader />
            </>
          ) : (
            <Header />
          )}
        </>
      )}
      <ToastContainer />
      <Outlet className={containerClass} />
      {!isAdminPage && !isOwnerPage && <Footer/>}
    </>
  );
}

export default App;
