import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered. Please register first.",
      });
    }

    const otp = generateOTP();

    await Otp.deleteMany({ email });

    const newOtp = new Otp({
      email,
      otp,
    });

    await newOtp.save();

    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
  
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    await Otp.deleteOne({ _id: otpRecord._id });

    const { password, role, ...rest } = user._doc;

    return res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};