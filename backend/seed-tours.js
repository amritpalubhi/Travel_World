// backend/seed-tours.js

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Tour from './models/Tour.js'

// 1) Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 2) Load .env specifically from backend folder
dotenv.config({ path: path.join(__dirname, '.env') })
console.log('MONGO_URI from env:', process.env.MONGO_URI)

// 3) Path to tours.json in frontend
const toursFilePath = path.join(
  __dirname,
  '..',           // go up to project root
  'frontend',
  'src',
  'assets',
  'data',
  'tours.json'
)

async function seedTours() {
  try {
    // 4) Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // 5) Read tours.json
    const raw = fs.readFileSync(toursFilePath, 'utf-8')
    const tours = JSON.parse(raw)
    console.log(`📦 Read ${tours.length} tours from file`)

    // 6) Clear old tours
    await Tour.deleteMany({})
    console.log('🗑️  Cleared existing tours collection')

    // 7) Insert new tours
    await Tour.insertMany(tours)
    console.log(`✅ Inserted ${tours.length} tours into database`)

  } catch (err) {
    console.error('❌ Error seeding tours:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit()
  }
}

seedTours()