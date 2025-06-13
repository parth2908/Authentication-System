const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const multer = require('multer');
 

// const userRoutes = require('./routes/userRoutes');

// ✅ Middlewares
app.use(cors(
   { origin : 'http://localhost:5173'}
));
app.use(express.json()); // 👈 Required for req.body

// ✅ Routes
app.use('/uploads' , express.static('uploads'))
app.use('/api/users', require('./routes/userRoutes'));

app.listen(5000, () => console.log('✅ Server is running on port 5000'));
