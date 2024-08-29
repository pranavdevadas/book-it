import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
  
    let { ownerInfo } = useSelector((state) => state.ownerAuth)
  return (
    ownerInfo ? <Outlet/> : <Navigate to='/owner/login' replace/>
  )
}

export default PrivateRoute

// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { clearOwnerCredentials, setOwnerCredentials } from "../../slice/ownerSlice/ownerAuthSlice.js";
// import { useEffect } from "react";
// import { fetchOwnerData } from "./fetchData.jsx";
// import {toast} from 'react-toastify'

// function PrivateRoute() {  
//   let { ownerInfo } = useSelector((state) => state.ownerAuth)
//   const dispatch = useDispatch();
  
//   useEffect(() => {
//     const checkOwnerStatus = async () => {
//       try {
//         const ownerData = await fetchOwnerData();
//         dispatch(setOwnerCredentials(ownerData));  

//         if (ownerData && ownerData.isBlocked) {
//           localStorage.removeItem("ownerInfo");  
//           dispatch(clearOwnerCredentials()); 
//         }
//       } catch (error) {
//         console.error("Failed to fetch owner data:", error);
//         toast.error("You are Blocked, Contact Admin for more info")
//         dispatch(clearOwnerCredentials());  
//         localStorage.removeItem("ownerInfo");  
//       }
//     };

//     checkOwnerStatus();
//   }, [dispatch]);

//   return ownerInfo && !ownerInfo.isBlocked ? ( <Outlet /> ) : (  <Navigate to='/owner/login' replace/> )
// }

// export default PrivateRoute;

