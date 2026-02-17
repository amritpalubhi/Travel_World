import express from 'express'
import { updateUser,deleteUser,getAllUser,getSingleUser,  } from '../controllers/userController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'
const router = express.Router()

//update tour
router.put('/:id',verifyUser, updateUser)

//delete tour
router.delete('/:id',verifyUser, deleteUser)

//getSInletour
router.get('/:id',verifyUser, getSingleUser)

//getAll tour
router.get('/',verifyAdmin, getAllUser)

export default router