import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `Travel World <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Travel World Login",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h1 style="color: #007bff; text-align: center;">Travel World</h1>
          <h2 style="color: #333;">Your OTP Code</h2>
          <p style="font-size: 16px; color: #666;">
            Use this OTP to log in to your Travel World account:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            This OTP will expire in 5 minutes.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};
