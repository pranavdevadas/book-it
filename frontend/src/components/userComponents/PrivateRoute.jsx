import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials, setCredentials } from "../../slice/userSlice/userAuthSlice.js";
import { useEffect } from "react";
import { fetchUserData } from "./fetchData.jsx";
import {toast} from 'react-toastify'

function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userData = await fetchUserData();
        dispatch(setCredentials(userData));  

        if (userData && userData.isBlocked) {
          localStorage.removeItem("userInfo");  
          dispatch(clearCredentials()); 
        }
      } catch (error) {
        console.log('errordddddd',error)
        console.error("Failed to fetch user data:", error);
        toast.error("You are Blocked, Contact Admin for more info")
        dispatch(clearCredentials());  
        localStorage.removeItem("userInfo");  
      }
    };

    checkUserStatus();
  }, [dispatch]);

  return userInfo && !userInfo.isBlocked ? ( <Outlet /> ) : ( <Navigate to="/login" replace /> )
}

export default PrivateRoute;

