import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import { generateToken } from "../utils/jwtUtils.js";

// @desc    Register customer
// @route   POST /api/auth/register
// @access  Public
const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return sendError(res, 400, "Please provide name, email, mobile and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return sendError(res, 400, "User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    mobile,
    password,
    role: "customer",
  });

  const token = generateToken(user._id, user.role);

  return sendSuccess(
    res,
    201,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    },
    "Customer registered successfully"
  );
});

// @desc    Customer login
// @route   POST /api/auth/login
// @access  Public
const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return sendError(res, 401, "Invalid email or password");
  }

  if (user.role !== "customer") {
    return sendError(res, 403, "Use the admin login page for admin accounts");
  }

  const token = generateToken(user._id, user.role);

  return sendSuccess(
    res,
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    },
    "Login successful"
  );
});

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return sendError(res, 401, "Invalid email or password");
  }

  if (user.role !== "admin") {
    return sendError(res, 403, "Not an admin account");
  }

  const token = generateToken(user._id, user.role);

  return sendSuccess(
    res,
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    },
    "Admin login successful"
  );
});

// @desc    Get logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return sendSuccess(res, 200, user, "User profile retrieved");
});

// @desc    Update customer profile
// @route   PUT /api/auth/profile
// @access  Private (customer)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  const { name, mobile, address } = req.body;

  if (name) user.name = name;
  if (mobile) user.mobile = mobile;
  if (address) user.address = address;

  await user.save();

  return sendSuccess(
    res,
    200,
    {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      address: user.address,
    },
    "Profile updated successfully"
  );
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendError(res, 400, "Please provide current and new password");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    return sendError(res, 401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return sendSuccess(res, 200, null, "Password changed successfully");
});

export {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getMe,
  updateProfile,
  changePassword,
};
