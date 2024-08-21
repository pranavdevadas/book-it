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
      {/* Private Route */}
      <Route path="/admin" element={<AdminPrivateRoute/>}>
        <Route index path="home" element={<AdminHomeScreen/>} />
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
