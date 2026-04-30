import express from 'express'
import { createTour, deleteTour, getAllTour, getSingleTour, updateTour,getTourBySearch, getFeaturedTour, getTourCount } from './../controllers/tourController.js'
import { verifyAdmin } from '../utils/verifyToken.js'
import { validateTour } from '../utils/validator.js' 
const router = express.Router()

//create new tour
router.post('/',verifyAdmin,validateTour, createTour)

//update tour
router.put('/:id',verifyAdmin,validateTour, updateTour)

//delete tour
router.delete('/:id',verifyAdmin, deleteTour)

// ✅ SPECIFIC ROUTES FIRST (before /:id)
router.get('/search/getTourBySearch', getTourBySearch)
router.get('/search/getFeaturedTours', getFeaturedTour)
router.get('/search/getTourCount', getTourCount)

// ✅ DYNAMIC ROUTE LAST
router.get('/:id', getSingleTour)

//getAll tour
router.get('/', getAllTour)

export default router