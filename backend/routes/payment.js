import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Create order
router.post('/create-order', verifyUser, async (req, res) => {
  try {
    const { amount } = req.body
    const options = {
      amount:   Math.round(amount * 100), // paise
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
    }
    const order = await razorpay.orders.create(options)
    res.status(200).json({ success: true, data: order })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: err.message })
  }
})

// Verify payment
router.post('/verify', verifyUser, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const body      = razorpay_order_id + '|' + razorpay_payment_id
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified' })
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification failed' })
  }
})

export default router
