import express      from 'express'
import dotenv       from 'dotenv'
import mongoose     from 'mongoose'
import cors         from 'cors'
import cookieParser from 'cookie-parser'
import tourRoute    from './routes/tours.js'
import userRoute    from './routes/users.js'
import authRoute    from './routes/auth.js'
import reviewRoute  from './routes/reviews.js'
import bookingRoute from './routes/bookings.js'
import otpRoute     from './routes/otp.js'
import chatbotRoute from './routes/chatbot.js'
import paymentRoute from './routes/payment.js'
import uploadRoute  from './routes/upload.js'

dotenv.config()
const app  = express()
const port = process.env.PORT || 4000

mongoose.set('strictQuery', false)

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.log('❌ MongoDB connection failed:', err.message)
  }
}

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use('/api/v1/tours',   tourRoute)
app.use('/api/v1/users',   userRoute)
app.use('/api/v1/auth',    authRoute)
app.use('/api/v1/review',  reviewRoute)
app.use('/api/v1/booking', bookingRoute)
app.use('/api/v1/payment', paymentRoute)
app.use('/api/v1/upload',  uploadRoute)
app.use('/api/otp',        otpRoute)
app.use('/api/chatbot',    chatbotRoute)

app.listen(port, () => {
  connect()
  console.log(`🚀 Server running on port ${port}`)
})
