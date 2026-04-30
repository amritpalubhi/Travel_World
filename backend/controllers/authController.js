import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//user registration

// backend/controllers/authController.js

export const register = async (req, res) => {
    try {
        const { username, email } = req.body

        // Validation
        if (!username || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide both username and email' 
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            })
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            photo: req.body.photo || ''
        })

        await newUser.save()

        res.status(200).json({ 
            success: true, 
            message: 'Registration successful! Please login with OTP.' 
        })

    } catch (err) {
        console.error('Registration error:', err)
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        })
    }
}
//user login
export const login = async (req,res) => {

    const email = req.body.email
    try{
        const user = await User.findOne({email})

        //if user doesnot exist

        if(!user){
            return res.status(400).json({success: false, message:"User not found"})
        }

        //if user exist check the passord or compare the [assword]
        const checkCorrectPassword =await bcrypt.compare(req.body.password, user.password)

        //if passowrd is incorrect
        if(!checkCorrectPassword){
            return res.status(401).json({success:false, message:'Incorrect email or password'})
        }
        const {password, role, ...rest} = user._doc

        //create jwt token
        const token = jwt.sign(
            {id:user._id, role: user.role},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "15d"}
        )

        //set token in the browser cookies and send the response to the client
        res.cookie("accessToken", token,{
            httpOnly:true,
            expires: token.expiresIn,
        })
        .status(200)
        .json({
           token,
           data:{...rest},
           role
        })


    }catch(err){
        res.status(500)
        .json({
            success:false, 
            message:'Failed to login'})
        }

    
}
