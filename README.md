# ✈️ Travel World

A full-stack travel booking web application built with the MERN stack. Users can browse tours, book trips with online payment, and receive email confirmations. Admins can manage tours, bookings, users, and reviews through a dedicated dashboard.

## 🌐 Live Demo
> Coming soon

## 🖼️ Screenshots
> Add screenshots here

## 🚀 Features

### User Features
- 🔐 Passwordless OTP login via email
- 🗺️ Browse & search tours by city, distance, group size
- 🔍 Filter tours by price range & sort by rating
- 💳 Razorpay payment gateway (test mode)
- 📧 Booking confirmation email
- 👤 User profile with booking history
- ⭐ Leave reviews and ratings on tours
- 🤖 AI travel chatbot powered by Google Gemini

### Admin Features
- 📊 Admin dashboard with stats
- 🗺️ Create, edit, delete tours
- 📋 View all bookings
- 👥 Manage users (make/remove admin)
- ⭐ Moderate reviews

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router DOM
- Reactstrap (Bootstrap)
- Context API

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (OTP + booking emails)

**Integrations**
- 💳 Razorpay (payments)
- 🤖 Google Gemini AI (chatbot)
- 📧 Gmail SMTP (emails)

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Razorpay test account
- Gmail account (for emails)
- Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/amritpalubhi/Travel_World.git
cd Travel_World
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

```bash
npm start
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm start
```

### 4. Make yourself admin
```bash
cd backend
node make-admin.js your@email.com
```

## 📁 Project Structure

```
Travel_World/
├── backend/
│   ├── controllers/    # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── utils/          # Helper functions
└── frontend/
    └── src/
        ├── components/ # Reusable components
        ├── pages/      # Page components
        ├── hooks/      # Custom hooks
        ├── context/    # Auth context
        └── utils/      # Helper utilities
```

## 🔑 Test Payment Credentials
```
Method: Netbanking → Any bank → Click Success
```

## 👨‍💻 Author
**Amrit** — [GitHub](https://github.com/amritpalubhi)

## 📄 License
MIT
