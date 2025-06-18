const db = require('../config/db');

const countUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS userCount FROM users';

    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error counting users:', err);
        return reject(err);
      }
      const count = result[0].userCount;
      resolve(count);
    });
  });
};

module.exports = countUsers;
