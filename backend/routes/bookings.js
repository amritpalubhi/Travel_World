import express from 'express'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'
import { createBooking, getAllBooking, getBooking, getUserBookings } from '../controllers/bookingController.js'
import { validateBooking } from '../utils/validator.js'

const router = express.Router()

// Create booking
router.post('/', verifyUser, validateBooking, createBooking)

// Get single booking by id
router.get('/:id', verifyUser, getBooking)

// Admin: get all bookings (no filter)
router.get('/', verifyAdmin, getAllBooking)

// User: get bookings for logged-in user
router.get('/user/me', verifyUser, getUserBookings)

export default router