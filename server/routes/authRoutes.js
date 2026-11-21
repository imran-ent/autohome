import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Customer auth
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Continue with Google
router.post("/google", async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();
    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        googleId,
        avatar: picture || "",
        role: "customer",
      });
    } else {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated. Contact support.",
        });
      }
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
      }
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// Forgot Password -> Send 6-digit OTP via Brevo
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtpHash = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: `${otp} is your AutoHome Batteries password reset code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #4b5563; font-size: 14px;">Hi ${user.name || "Customer"}, use this 6-digit verification code to reset your AutoHome Batteries password:</p>
          <div style="margin: 20px 0; padding: 14px; background: #f3f4f6; border-radius: 8px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0f172a;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "6-digit reset code sent to your email",
    });
  } catch (error) {
    next(error);
  }
});

// Reset Password -> Verify OTP & Set New Password
router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const otpHash = crypto
      .createHash("sha256")
      .update(String(otp).trim())
      .digest("hex");

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetOtpHash: otpHash,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code",
      });
    }

    user.password = newPassword;
    user.resetOtpHash = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully! You can now sign in.",
    });
  } catch (error) {
    next(error);
  }
});

// Admin auth
router.post("/admin/login", loginAdmin);

// Profile (protected)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;