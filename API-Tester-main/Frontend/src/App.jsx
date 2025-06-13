// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home';
// import Login from './components/Login';
// import Register from './components/Register';
// import Profile from './components/Profile'
// import UsersPage from './components/UsersPage';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/all-users" element={<UsersPage />} />
        

//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Home from "./components/Home"; // Optional Home Page
import UsersPage from "./components/UsersPage";
import Http from "./components/Http";

function App() {
  return (
    <Router>

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/all-users" element={<UsersPage />} />
          <Route path="/http" element={<Http />} />
          
        </Routes>
    
    </Router>
  );
}

export default App;
