// src/App.js
import React, { Suspense, lazy } from "react";
import Layout from "./Layout";
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

// Lazy load route components
const BaseUnitsMap = lazy(() => import("./Map/BaseUnitsMap"));
const Geocoder = lazy(() => import("./Geocoder/Geocoder"));
const Mailer = lazy(() => import("./Mailer/Mailer"));
const About = lazy(() => import("./About"));
const BaseUnitPage = lazy(() => import("./BaseUnitPage"));

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
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/map" element={<BaseUnitsMap />} />
                <Route path="/geocoder" element={<Geocoder />} />
                <Route path="/mailer" element={<ProtectedRoute path="/mailer"><Mailer /></ProtectedRoute>} />
                <Route path="/base-unit/:unit" element={<BaseUnitPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
