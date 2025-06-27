const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const multer = require('multer');
const { startDailyCountCron, startUserDetailCron } = require('./cronjobs');
const userRoutes = require('./routes/userRoutes');

// Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://authentication-system-pink.vercel.app'
];


app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);

startDailyCountCron();
startUserDetailCron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
