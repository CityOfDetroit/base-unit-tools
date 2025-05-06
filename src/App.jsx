// src/App.js
import React from "react";
import Layout from "./Layout";
import MapComponent from "./Map/Map";
import Homepage from "./Homepage";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  BrowserRouter,
  MemoryRouter,
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
import About from "./About";

// Protected route component
const ProtectedRoute = ({ path, children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={`/login?app=${path.replace("/", "")}`} />;
};


const App = ({ mode = 'standalone', basePath = '' }) => {
  // Choose router based on mode
  const Router = mode === 'standalone' ? BrowserRouter : MemoryRouter;

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<About />} />
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
