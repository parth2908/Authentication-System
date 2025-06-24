
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import API from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
//  const server_url = "https://authentication-system-5-1shs.onrender.com";
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      alert("Unauthorized");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-white px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
          Your Profile
        </h2>

        {user ? (
          <>
            <div className="flex justify-center mb-6">
              <Avatar
                alt={user.name}
                src={
                  user.profilePicture
                    ? `${user.profilePicture}`
                    : "/default-profile.png"
                }
                sx={{
                  width: 140,
                  height: 140,
                  border: "3px solid #3b82f6",
                  boxShadow: "0 4px 10px rgb(59 130 246 / 0.3)",
                }}
              />
            </div>

            <div className="space-y-5">
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                <p className="text-lg font-semibold text-blue-800">
                  Name{" "}
                  <span className="text-gray-500 text-sm ml-2">:</span>
                </p>
                <p className="text-gray-700 text-xl mt-1 relative inline-block pr-8">
                  {user.name}
                  
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                <p className="text-lg font-semibold text-blue-800">
                  Email <span className="text-gray-500 text-sm ml-2">:</span>
                </p>
                <p className="text-gray-700 text-lg mt-1 break-all">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
