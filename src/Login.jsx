import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const Login = () => {
  const { isAuthenticated, username, handleSignIn, handleSignOut } = useAuth();

  return (
    <div>
      {/* ... (authentication buttons) */}
      {isAuthenticated ? (
        <div className="text-xs flex gap-1 text-gray-600 items-center">
          <span className="flex flex-col">
            <b>{username}</b>
          </span>
          <button
            className="text-xs font-semibold opacity-70 hover:opacity-100 hover:bg-red-300 w-20"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
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
