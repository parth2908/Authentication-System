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

// import React from "react";
// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center overflow-hidden">
//       {/* Subtle Professional Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center opacity-20"
//         style={{
//           backgroundImage: "url('/backgrounds/professional-bg.jpg')",
//         }}
//       ></div>

//       <div className="relative bg-white/80 backdrop-blur-lg p-11 rounded-3xl shadow-2xl max-w-2xl w-full text-center border border-gray-200">
//         <h1 className="text-5xl font-extrabold mb-4 tracking-wide bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
//           Welcome to Authify
//         </h1>

//         <p className="text-gray-700 text-lg mb-8 leading-relaxed">
//           Fast, secure & modern authentication for your digital presence. Sign
//           in or create your account to get started.
//         </p>

//         <div className="flex justify-center gap-6">
//           <Link to="/login">
//             <button className="bg-gradient-to-r from-blue-400 to-slate-500 text-white px-7 py-3 rounded-xl font-semibold hover:bg-blue-800 shadow-md transition">
//               Login
//             </button>
//           </Link>
//           <Link to="/users/register">
//             <button className="bg-gray-100 text-blue-700 px-7 py-3 rounded-xl font-semibold hover:bg-gray-200 shadow-md transition">
//               Register
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
