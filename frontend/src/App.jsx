import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/userComponents/Header.jsx";
import AdminHeader from "./components/adminComponents/Header.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OwnerHeader from './components/ownerComonents/Header.jsx'

function App() {
  let location = useLocation();
  let isAdminPage = location.pathname.startsWith("/admin");
  let isOwnerPage = location.pathname.startsWith("/owner");

  return (
    <>
      {isAdminPage ? (
        <AdminHeader />
      ) : isOwnerPage ? (
        <OwnerHeader />
        
      ) : (
        <Header />
      )}
      <ToastContainer />
     
        <Outlet />
     
    </>
  );
}

export default App;
