const { registerUser, loginUser } = require('../models/userModel');
const db = require('../config/db');
const { request } = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
// REGISTER
// const register = async(req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password)

//     return res.status(400).json({ message: 'All fields required' });

//     const profilePicture = req.file.path;
 
 
//   try {
//     // Hash password BEFORE calling the stored procedure
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
 
//     // Call the stored procedure using mysql2/promise connection
//     const [result] = await db.query(
//       "CALL InsertUser(?, ?, ?, ?)",
//       [name, email, hashedPassword, profilePicture]
//     );
 
//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ msg: err.message || "Server error" });
//   }
// };
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const profilePicture = req.file?.filename || 'default.jpg';

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.promise().query(
      "CALL InsertUser(?, ?, ?, ?)",
      [name, email, hashedPassword, profilePicture]
    );

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res .status(500).json({ msg: err.message || "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

    try {
        // Call stored procedure to get user by email
    const [users] = await db.promise().query('CALL LoginUser(?)', [email]);
 
    const user = users[0][0];
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
 
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
    const decoded = jwt.decode(token);
    const expiryTimeStamp = decoded?.exp;
 
    res.json({ token, expiryTimeStamp });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};


// const getProfile = async (req, res) => {
//   const userId = req.user?.userId; // or from token: req.user.id if using auth middleware

//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required' });
//   }

//   try {
//     const [row] = await db.promise().query("CALL getProfile(?)", [userId]);
//     const user = row[0][0]; // First result set, first row

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json(user);
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

const getProfile = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const [row] = await db.promise().query("CALL getProfile(?)", [userId]);
    const user = row[0][0];

    if (!user) return res.status(404).json({ message: 'User not found' });

   

    res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: err.message });
  }
};

const userList = async (req, res) => {
  try {
    const [results] = await db.promise().query('CALL getallUser()');
 
    const user = results?.[0];
    res.json(user);
    
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
 


module.exports = { register, login, getProfile, userList };
