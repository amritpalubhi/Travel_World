import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
export const sendOTP = async (req,res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists, if not create new user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email: email,
        username: email.split("@")[0], 
        role: "user",
      });
      await user.save();
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email });

    // Save new OTP
    const newOtp = new Otp({ 
      email: email, 
      otp: otp 
    });
    await newOtp.save();

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "OTP sent to your email",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Verify OTP and Login
export const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP in database
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    const { password, role, ...rest } = user._doc;

    // Send response with token
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token: token,
        data: { ...rest },
        role: role,
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
