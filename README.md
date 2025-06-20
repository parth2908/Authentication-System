A full-stack application that tracks users and sends automated email reports using MERN STACK and MySQL.

---

## 📦 Features

- 👥 User registration and user listing (React frontend)
- 📬 Cron jobs (Node.js + node-cron):
  - Sends total registered user count (daily)
  - Sends detailed user list (daily)
- 💌 Email reports via Nodemailer
- 🗃️ MySQL backend for persistent user data
- 🧾 Stores cron job timestamps using stored procedures
- 🧑‍💻 Modular and scalable backend structure

---

## 🧱 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React.js, Axios   |
| Backend     | Node.js, Express  |
| Database    | MySQL, MongoDB    |
| Cron Jobs   | node-cron         |
| Email       | Nodemailer        |
| Styling     | Tailwind          |



 Backend Setup
1. Install Dependencies
cd backend
npm install

3. Configure .env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=cron_report

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourpassword
EMAIL_TO=recipient@example.com

3. Start Backend
npm start



 Frontend Setup
 
1. Navigate and Install:-
cd frontend
npm install

2. Start Development Server:-
npm run dev
