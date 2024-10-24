// src/App.js
import React from "react";
import Layout from "./Layout";
import MapComponent from "./Map/Map";
import Homepage from "./Homepage";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Login from "./Login";
import BaseUnitsMap from "./Map/BaseUnitsMap";
import Geocoder from "./Geocoder/Geocoder";
import Mailer from "./Mailer/Mailer";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/map" element={<BaseUnitsMap />} />
              <Route path="/geocoder" element={<Geocoder />} />
              <Route path="/mailer" element={<ProtectedRoute path="/mailer"><Mailer /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
