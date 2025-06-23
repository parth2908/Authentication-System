const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const multer = require('multer');
const {startDailyCountCron,startUserDetailCron} = require('./cronjobs')
const userRoutes = require('./routes/userRoutes');
 

// const userRoutes = require('./routes/userRoutes');

// Middlewares
app.use(cors(
   { origin : 'https://authentication-system-pink.vercel.app'}
));
app.use(express.json()); // 



// Routes
app.use('/uploads' , express.static('uploads'))
app.use('/api/users', userRoutes);
startDailyCountCron();
startUserDetailCron();

app.listen(51727, () => console.log('Server is running on port 51727'));
