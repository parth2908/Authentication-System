// const { registerUser, loginUser } = require('../models/userModel');
const db = require('../config/db');
const { request } = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const XLSX = require("xlsx");
const fs = require("fs");

const register = async (req, res) => {
  const { name, email, password } = req.body;
const profilePicture = req.file ? req.file.path : null;


  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Insert user into 'users' table
    const [userResult] = await db.promise().query(
      'INSERT INTO users (name, email, password, profilePicture, is_verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, profilePicture, 0]
    );

    const newUserId = userResult.insertId;

    // Step 2: Generate OTP and expiry timestamp
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const otp_expiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute from now

await db.promise().query(
  'INSERT INTO otp (user_id, email, otp, otp_expiry) VALUES (?, ?, ?, ?)',
  [newUserId, email, otp, otp_expiry]
);


    console.log("Generated OTP:", otp);

    // Step 4: Send OTP via email
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

    res.status(201).json({
      email,
      message: 'Registration successful. Please verify your email with the OTP sent.',
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ msg: err.message });
  }
};




const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [records] = await db.promise().query(
      "SELECT * FROM otp WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (!records.length) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
      

    const record = records[0];
    const now = new Date();

    if (record.otp_expiry && new Date(record.otp_expiry) < now) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark user as verified
    await db.promise().query("UPDATE users SET is_verified = 1 WHERE email = ?", [email]);

    // Optional: Delete the OTP after success
    // await db.promise().query("DELETE FROM otp WHERE email = ?", [email]);

    res.json({ message: "Account verified successfully!" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: err.message });
  }
};


const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ msg: "Email is already verified" });
    }

    // 2. Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 1 * 60 * 1000); // valid for 1 minute

    // 3. Check if OTP record exists
    const [existingOtp] = await db.promise().query("SELECT * FROM otp WHERE email = ?", [email]);

    if (existingOtp.length > 0) {
      // 4. Update existing OTP
      await db.promise().query(
        "UPDATE otp SET otp = ?, otp_expiry = ? WHERE email = ?",
        [otp, otp_expiry, email]
      );
    } else {
      // 5. Insert new OTP
      await db.promise().query(
        "INSERT INTO otp (user_id, email, otp, otp_expiry) VALUES (?, ?, ?, ?)",
        [user.id, email, otp, otp_expiry]
      );
    }

    // 6. Send Email
    await sendEmail(
      email,
      "Resend OTP - Email Verification",
      `<p>Hello ${user.name},</p>
       <p>Your new OTP is: <strong>${otp}</strong></p>
       <p>This OTP is valid for 1 minute.</p>`
    );

    res.status(200).json({ msg: "OTP resent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const [users] = await db.promise().query('CALL LoginUser(?)', [email]);
    const user = users[0][0];
        console.log(user);

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

   if (parseInt(user.is_verified) !== 1) {
  return res.status(403).json({ msg: "Please verify your email before logging in." });
}

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
         await sendEmail(
        email,
        'Login Attempt Failed',
        `
          <h2>Hello,</h2>
          <p>There was a failed login attempt on your account using this email address: <strong>${email}</strong>.</p>
          // <p>If this was you and you forgot your password, please use the "Forgot Password" option.</p>
          <p>If this wasn't you, we recommend updating your password to keep your account secure.</p>
          <br/>
          <p>Best regards,<br/>200Ok Solutions Team</p>
        `
      );
           return res.status(400).json({ msg: "Invalid credentials" });

    }
 

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
    const decoded = jwt.decode(token);
    const expiryTimeStamp = decoded?.exp;

    res.json({ token, expiryTimeStamp });
   await sendEmail(
  email,
  'Login Successful',
  `
    <h2>Welcome back, ${user.name}!</h2>
    <p>You have successfully logged in to your account.</p>
    <p>If this wasn't you, please secure your account immediately.</p>
    <br/>
    <p>Best regards,<br/>200Ok Solutions Team</p>
  `
);
   
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
    
  }
};



const getProfile = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const [row] = await db.promise().query("CALL getProfile(?)", [userId]);
    const user = row[0][0];
    // console.log(user);
    
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


// const bulkRegister = async (req, res) => {
//   if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

//   try {
//     const workbook = XLSX.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const users = XLSX.utils.sheet_to_json(sheet);

//     const importResults = [];

//     for (let i = 0; i < users.length; i++) {
//       const Name = users[i]["Name"]?.trim();
//       const Email = users[i]["Email"]?.trim().toLowerCase();
//       const Password = users[i]["Password"]?.trim();
//       const ProfilePicture = users[i]["profilePicture"]?.trim() || null;

//       if (!Name || !Email || !Password) {
//         importResults.push({ Email: Email || "Unknown", status: "Missing required fields" });
//         continue;
//       }

//       try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(Password, salt);

//         const [result] = await db.promise().query("CALL InsertUser(?, ?, ?, ?)", [
//           Name,
//           Email,
//           hashedPassword,
//           ProfilePicture,
//         ]);

//         const insertedUser = result?.[0]?.[0];
//         if (!insertedUser) {
//           importResults.push({ Email, status: "Failed to register" });
//         } else {
//           importResults.push({ Email, status: "Imported" });
//         }
//       } catch (error) {
//         console.error("Import user error:", error);

//         if (error.sqlMessage === "User already exists") {
//           importResults.push({ Email, status: "Already registered" });
//         } else {
//           importResults.push({ Email, status: "Error occurred" });
//         }
//       }
//     }

//     fs.unlink(req.file.path, (err) => {
//       if (err) console.error("Failed to delete uploaded file:", err);
//     });

//     // Always send 200 status to keep frontend in "success" state
//     res.status(200).json({ msg: "Import completed", importResults });
//   } catch (err) {
//     console.error("Import error:", err);

//     // Even if overall failure happens, send 200 so frontend stays in success state
//     res.status(200).json({ msg: "Import completed with errors", importResults: [] });
//   }
// };
const bulkRegister = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const users = XLSX.utils.sheet_to_json(sheet);

    const importResults = [];

    for (let i = 0; i < users.length; i++) {
      const Name = users[i]["Name"]?.trim();
      const Email = users[i]["Email"]?.trim().toLowerCase();
      const Password = users[i]["Password"]?.trim();
      const ProfilePicture = users[i]["profilePicture"]?.trim() || null;

      const missingFields = [];
      if (!Name) missingFields.push("Name");
      if (!Email) missingFields.push("Email");
      if (!Password) missingFields.push("Password");

      if (missingFields.length > 0) {
        importResults.push({
          Email: Email || "Unknown",
          status: `Missing ${missingFields.join(", ")}`
        });
        continue;
      }

      try {
        // Check for duplicate user
        const [existing] = await db.promise().query(
          "SELECT * FROM users WHERE email = ?",
          [Email]
        );

        if (existing.length > 0) {
          importResults.push({ Email, status: "Already registered" });
          continue;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const [result] = await db.promise().query("CALL InsertUser(?, ?, ?, ?)", [
          Name,
          Email,
          hashedPassword,
          ProfilePicture,
        ]);

        const insertedUser = result?.[0]?.[0];
        if (!insertedUser) {
          importResults.push({ Email, status: "Failed to register" });
        } else {
          importResults.push({ Email, status: "Imported" });
        }
      } catch (error) {
        console.error("Error inserting user:", error);
        importResults.push({
          Email,
          status: error.sqlMessage || "Error occurred"
        });
      }
    }

    // Delete file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });

    res.status(200).json({ msg: "Import completed", importResults });

  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ msg: "Failed to import users" });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  userList,
  verifyOtp, 
  resendOtp,
  bulkRegister,
};
