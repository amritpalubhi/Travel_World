import express from 'express'
import User from '../models/User.js'
import { updateUser, deleteUser, getAllUser, getSingleUser } from '../controllers/userController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

// Must come BEFORE /:id routes
router.put('/update-username', async (req, res) => {
  try {
    const { email, username } = req.body
    if (!email || !username)
      return res.status(400).json({ success: false, message: 'Email and username are required' })
    const user = await User.findOneAndUpdate({ email }, { username }, { new: true })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    const { password, ...rest } = user._doc
    res.status(200).json({ success: true, message: 'Username updated', data: rest })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update username' })
  }
})

// Make / Remove admin — admin only
router.put('/:id/role', verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body
    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' })
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.status(200).json({ success: true, message: `Role updated to ${role}`, data: user })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update role' })
  }
})

router.put('/:id',    verifyUser,  updateUser)
router.delete('/:id', verifyAdmin, deleteUser)
router.get('/:id',    verifyUser,  getSingleUser)
router.get('/',       verifyAdmin, getAllUser)

export default router
