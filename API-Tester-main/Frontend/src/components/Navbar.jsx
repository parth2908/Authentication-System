import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName"); // Save name on login

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-300 to-slate-400 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        200Ok Solutions
      </Link>

      <div className="flex space-x-4 items-center">
        {!token ? (
          <>
            <Link to="/user/register" className="hover:text-gray-200 font-medium">
              Register
            </Link>
            <Link to="/login" className="hover:text-gray-200 font-medium">
              Login
            </Link>
            <Link to="/http" className="hover:text-gray-200 font-medium">
              Http
            </Link>
             

          </>
        ) : (
          <>
            <span className="text-white font-semibold hidden sm:block">
              Welcome, {name}
            </span>
            <Link to="/profile" className="hover:text-gray-200 font-medium">
              Profile
            </Link>
            <Link to="/all-users" className="hover:text-gray-200 font-medium">
              Users
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
