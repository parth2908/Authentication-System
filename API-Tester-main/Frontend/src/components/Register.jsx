import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Link } from "react-router-dom";
const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    file: null,
  });

  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("password", form.password);
  if (form.file) {
    formData.append("profilePicture", form.file);
  }

  try {
    const res = await API.post("/users/register", formData);
    alert("Registered successfully. Please verify your email.");
    navigate("/users/verify-otp", { state: { email: res.data.email } });
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="mt-1 w-full text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-slate-500 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
  