import express from 'express'
import { getWeather } from '../controllers/weatherController.js'

const router = express.Router()

// public: /api/v1/weather?city=...
router.get('/', getWeather)

export default router