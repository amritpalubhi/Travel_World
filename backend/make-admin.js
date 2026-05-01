// Run this script to make a user admin:
// node make-admin.js your@email.com

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const email = process.argv[2]

if (!email) {
  console.log('❌ Please provide an email: node make-admin.js your@email.com')
  process.exit(1)
}

try {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB')

  const user = await User.findOneAndUpdate(
    { email },
    { role: 'admin' },
    { new: true }
  )

  if (!user) {
    console.log(`❌ No user found with email: ${email}`)
  } else {
    console.log(`✅ Success! ${user.username} (${user.email}) is now an admin.`)
  }
} catch (err) {
  console.error('❌ Error:', err.message)
} finally {
  await mongoose.disconnect()
  process.exit(0)
}
