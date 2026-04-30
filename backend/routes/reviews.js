import express from 'express'
import { createReview } from '../controllers/reviewController.js'
import { verifyUser } from '../utils/verifyToken.js'
import { validateReview } from '../utils/validator.js' 

const router = express.Router()

router.post('/:tourId',verifyUser, validateReview, createReview)

export default router