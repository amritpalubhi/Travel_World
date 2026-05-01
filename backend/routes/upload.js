import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

// Multer stores file in memory (buffer)
const storage = multer.memoryStorage()
const upload  = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB limit

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.post('/', verifyAdmin, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'travel_world/tours', resource_type: 'image' },
        (error, result) => error ? reject(error) : resolve(result)
      )
      stream.end(req.file.buffer)
    })

    res.status(200).json({ success: true, url: result.secure_url })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed: ' + err.message })
  }
})

export default router
