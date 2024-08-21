import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
  
    let { adminInfo } = useSelector((state) => state.adminAuth)
  return (
    adminInfo ? <Outlet/> : <Navigate to='/admin/login' replace/>
  )
}

export default PrivateRoute
