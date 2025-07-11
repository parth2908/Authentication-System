import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-white flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl w-full text-center mt-[-150px]">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Welcome to Authify</h1>
        <p className="text-gray-600 text-lg mb-6">
          Fast, secure & modern authentication for your digital presence. Sign
          in or create your account to get started.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-gradient-to-r from-blue-400 to-slate-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
          <Link to="/users/register">
            <button className="bg-gray-200 text-blue-600 px-6 py-2 rounded-xl font-medium hover:bg-gray-300 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

