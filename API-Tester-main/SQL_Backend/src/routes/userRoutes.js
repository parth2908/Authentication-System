const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const upload = require('../middleware/Upload');
const User = require('../models/User'); // Sequelize model

// Register Route with Image Upload
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { name, email, password } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture,
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Users
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'profilePicture']
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Delete User
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (result === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PATCH Update
router.patch("/update-profile/:id", async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;

    const [updated] = await User.update(
      { name, email, profilePicture },
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PUT Update (Full Replace)
router.put("/update-user/:id", async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const [updated] = await User.update(
      { name, email, password: hashedPassword, profilePicture },
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;
