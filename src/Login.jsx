import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

const Login = ({ sendTo }) => {
  const { isAuthenticated, username, handleSignIn, handleSignOut } = useAuth();

  const [params, setParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${params.get("app")}`);
    }
  }, [isAuthenticated]);

  return (
    <div>
      {/* ... (authentication buttons) */}
      {isAuthenticated ? (
        <p>Hey</p>
      ) : (
        <button
          className="text-xs font-semibold opacity-70 hover:opacity-100 hover:bg-blue-300 w-20"
          onClick={handleSignIn}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Login;
