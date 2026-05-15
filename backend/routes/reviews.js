import express from 'express'
import { createReview, getAllReviews } from '../controllers/reviewController.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'
import { validateReview } from '../utils/validator.js' 

const router = express.Router()

// user creates review for a tour
router.post('/:tourId', verifyUser, validateReview, createReview)

// admin gets all reviews
router.get('/', verifyAdmin, getAllReviews)

export default router