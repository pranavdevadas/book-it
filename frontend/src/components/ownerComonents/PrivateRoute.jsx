import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
  
    let { ownerInfo } = useSelector((state) => state.ownerAuth)
  return (
    ownerInfo ? <Outlet/> : <Navigate to='/owner/login' replace/>
  )
}

export default PrivateRoute
