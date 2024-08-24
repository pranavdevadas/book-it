import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import store from "./store.js";
import { Provider } from 'react-redux'
import HomeScreen from "./screens/userScreens/HomeScreen.jsx";
import LoginScreen from "./screens/userScreens/LoginScreen.jsx";
import RegisterScreen from "./screens/userScreens/RegisterScreen.jsx";
import MovieScreen from './screens/userScreens/MovieScreen.jsx'
import ProfileScreen from "./screens/userScreens/ProfileScreen.jsx";
import PrivateRoute from "./components/userComponents/PrivateRoute.jsx";
import AdminLoginScreen from './screens/adminScreens/LoginScreen.jsx'
import AdminHomeScreen from './screens/adminScreens/HomeScreen.jsx'
import AdminPrivateRoute from './components/adminComponents/PrivateRoute.jsx'
import OtpScreen from './screens/userScreens/OtpScreen.jsx'
import AdminMovieScreen from "./screens/adminScreens/MovieScreen.jsx";
import AdminCityScreen from './screens/adminScreens/CityScreen.jsx'
import AddCityScreen from './screens/adminScreens/CityAddScreen.jsx'

import OwnerLoginScreen from './screens/ownerScreens/LoginScreen.jsx'
import OwnerPrivateRoute from './components/ownerComonents/PrivateRoute.jsx'
import OwnerHomeScreen from './screens/ownerScreens/HomeScreen.jsx'
import OwnerRegister from './screens/ownerScreens/RegisterScreen.jsx'
import OwnerProfile from './screens/ownerScreens/ProfileScreen.jsx'
import OwnerOtpScreen from './screens/ownerScreens/OtpScreen.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      {/* User Routes */}
      <Route index path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/otp" element={<OtpScreen />} />
      <Route path="/movie" element={<MovieScreen />} />
      <Route path="" element={<PrivateRoute />} >
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path='/admin/login' element={<AdminLoginScreen />}/>
      <Route path="/admin" element={<AdminPrivateRoute/>}>
        <Route index path="home" element={<AdminHomeScreen/>} />
        <Route path="movies" element={<AdminMovieScreen />} />
        <Route path="cities" element={<AdminCityScreen />} />
        <Route path="add-city" element={<AddCityScreen />} />
      </Route>

      {/* Owner Routes */}
      <Route path="/owner/login" element={<OwnerLoginScreen />} />
      <Route path="/owner/register" element={<OwnerRegister />} />
      <Route path="/owner/otp" element={<OwnerOtpScreen />} />
      <Route path="/owner" element={<OwnerPrivateRoute />} >
        <Route index path="home" element={<OwnerHomeScreen />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>
      


    </Route>
  )
)

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={ router }/>
    </StrictMode>
  </Provider>
);
