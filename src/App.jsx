// src/App.js
import React, { Suspense, lazy } from "react";
import Layout from "./Layout";
import Homepage from "./Homepage";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Login from "./Login";
import NotFound from "./NotFound";

// Lazy load route components
const BaseUnitsMap = lazy(() => import("./Map/BaseUnitsMap"));
const Geocoder = lazy(() => import("./Geocoder/Geocoder"));
const Mailer = lazy(() => import("./Mailer/Mailer"));
const Zoning = lazy(() => import("./Zoning/Zoning"));
const Ownership = lazy(() => import("./Ownership/Ownership"));
const About = lazy(() => import("./About"));
const BaseUnitPage = lazy(() => import("./BaseUnitPage"));
const PublicSafetyLookup = lazy(() => import("./PublicSafetyLookup/PublicSafetyLookup"));

// Protected route component
const ProtectedRoute = ({ path, children }) => {
  const { isAuthenticated, authChecked } = useAuth();
  const { pathname, search } = useLocation();
  if (!authChecked) return <div className="p-4">Loading...</div>;
  // next: the full address asked for, so links like /ownership?parcel=… survive the sign-in
  const next = encodeURIComponent(pathname + search);
  return isAuthenticated ? children : <Navigate to={`/login?app=${path.replace("/", "")}&next=${next}`} />;
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
                <Route path="/zoning" element={<ProtectedRoute path="/zoning"><Zoning /></ProtectedRoute>} />
                <Route path="/ownership" element={<ProtectedRoute path="/ownership"><Ownership /></ProtectedRoute>} />
                <Route path="/base-unit/:unit" element={<BaseUnitPage />} />
                <Route path="/public-safety-lookup" element={<PublicSafetyLookup />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
