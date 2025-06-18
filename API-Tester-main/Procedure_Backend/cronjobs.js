// // crons/dailyCountCron.js 
const cron = require('node-cron');
const sendEmail = require('./utils/sendEmail');
const countUsers = require('./utils/countusers');
const db = require('./config/db');

//cron1
function startDailyCountCron() {
  cron.schedule('* * * * *', async () => {
    console.log('Cron: Sending user count report...');

    try {
      const count = await countUsers();

      const html = `
        <h2>Daily User Report</h2>
        <p>Total Registered Users: <strong>${count}</strong></p>
      `;

      await sendEmail('makwanaparth081@gmail.com', 'Daily User Report', html);
      console.log('Daily user report email sent.');

    } catch (error) {
      console.error('Failed to send user count email:', error.message);
    }
  });
}

//cron2
function startUserDetailCron() {
  cron.schedule('*/1 * * * *', async () => {
    console.log('Cron: Sending detailed user list...');

    try {
      const [users] = await db.promise().query('SELECT name, email FROM users');

      if (users.length === 0) {
        console.log('No users found.');
        return;
      }

      let html = `
        <h2>Registered Users</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
      `;

      users.forEach((user, index) => {
        html += `
          <tr>
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
          </tr>
        `;
      });

      html += `</tbody></table>`;

      await sendEmail('makwanaparth081@gmail.com', 'User Details', html);
      console.log('User details sent via email');

      // Update lastExecuted using stored procedure
      await db.promise().query('CALL UpdateCronJobTimestamp(?)', ['User Details Email']);

    } catch (error) {
      console.error('Failed to send user details:', error.message);
    }
  });
}
module.exports = {startUserDetailCron,startDailyCountCron};
