import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Home from "./components/Home"; // Optional Home Page
import UsersPage from "./components/UsersPage";
// import Http from "./components/Http";
import VerifyOtp from "./components/verifyotp";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <Router>

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/users/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/all-users" element={<UsersPage />} />
          
          {/* <Route path="/http" element={<Http />} /> */}
          
        </Routes>
    
    </Router>
);
}
<Toaster position="top-center" reverseOrder={false} />

export default App;
