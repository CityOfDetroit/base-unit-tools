// src/App.js
import React from "react";
import Layout from "./Layout";
import MapComponent from "./Map/Map";
import Homepage from "./Homepage";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Login from "./Login";
import BaseUnitsMap from "./Map/BaseUnitsMap";
import Geocoder from "./Geocoder/Geocoder";
import Mailer from "./Mailer/Mailer";
import About from "./About";
import BaseUnitPage from "./BaseUnitPage";

// Protected route component
const ProtectedRoute = ({ path, children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={`/login?app=${path.replace("/", "")}`} />;
};


const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/map" element={<BaseUnitsMap />} />
              <Route path="/geocoder" element={<Geocoder />} />
              <Route path="/mailer" element={<ProtectedRoute path="/mailer"><Mailer /></ProtectedRoute>} />
              <Route path="/base-unit/:unit" element={<BaseUnitPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
