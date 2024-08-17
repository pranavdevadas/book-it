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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/movie" element={<MovieScreen />} />

      {/* Private Route */}
      <Route path="" element={<PrivateRoute />} >
        <Route path="/profile" element={<ProfileScreen />} />
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
