// import express from 'express'
import { updateUser,deleteUser,getAllUser,getSingleUser,  } from '../controllers/userController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'
// const router = express.Router()

// //update tour
// router.put('/:id',verifyUser, updateUser)

// //delete tour
// router.delete('/:id',verifyUser, deleteUser)

// //getSInletour
// router.get('/:id',verifyUser, getSingleUser)

// //getAll tour
// router.get('/',verifyAdmin, getAllUser)

// export default router
import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.put("/update-username", async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: "Email and username are required",
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      { username: username },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      data: rest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update username",
    });
  }
});

export default router;

