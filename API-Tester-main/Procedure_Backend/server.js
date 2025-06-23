// const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();
// const app = express();
// const cors = require('cors');
// const multer = require('multer');
// const {startDailyCountCron,startUserDetailCron} = require('./cronjobs')
// const userRoutes = require('./routes/userRoutes');
 

// // const userRoutes = require('./routes/userRoutes');

// // Middlewares
// app.use(cors(
//    { origin : 'https://authentication-system-pink.vercel.app'}
// ));
// app.use(express.json()); // 



// // Routes
// app.use('/uploads' , express.static('uploads'))
// app.use('/api/users', userRoutes);
// startDailyCountCron();
// startUserDetailCron();

// app.listen(DB_PORT, () => console.log(`Server is running on port ${DB_PORT}`));


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

// CORS Setup
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);

// Start Cron Jobs
startDailyCountCron();
startUserDetailCron();

// ✅ Correct Server Port Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
