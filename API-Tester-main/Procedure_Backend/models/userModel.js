// const db = require('../db/db');

// // Register using stored procedure
// const registerUser = (name, email, password, profilePicture, callback) => {
//   const sql = 'CALL RegisterUser(?, ?, ?)';
//   db.query(sql, [name, email, password, profilePicture], (err, result) => {
//     if (err) return callback(err);
//     return callback(null, result);
//   });
// };

// // Login using stored procedure
// const loginUser = (email, password, callback) => {
//   const sql = 'CALL LoginUser(?, ?)';
//   db.query(sql, [email, password], (err, result) => {
//     if (err) return callback(err);
//     return callback(null, result[0][0]); // Get single user
//   });
// };

// module.exports = { registerUser, loginUser };
