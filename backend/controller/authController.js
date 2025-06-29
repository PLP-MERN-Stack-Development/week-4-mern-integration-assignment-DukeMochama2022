const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { transporter } = require("../config/nodemailer");
const {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} = require("../config/emailTemplates");
const {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ValidationError("Missing details!");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("User already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  //sending welcome email
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Welcome to techSparks",
    text: `Welcome to techSparks website.Your account has been  created with email id: ${email}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ValidationError("Email and Password are required!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthenticationError("Invalid email!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AuthenticationError("Invalid password!");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "User successfully logged in!",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  return res.json({ success: true, message: "Logged out!" });
};

//sending verification OTP to users email account.
const sendverifyOTP = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  if (user.isAccountVerified) {
    throw new ConflictError("Account already verified!");
  }

  //generate 6-digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.verifyOTP = otp;
  user.verifyOTPExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  //sending OTP to user
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Account verification OTP!",
    html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user.email
    ),
  };

  await transporter.sendMail(mailOptions);
  res.json({ success: true, message: "Verification OTP sent to email" });
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const { userId } = req.body;

  if (!otp) {
    throw new ValidationError("Missing OTP!");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  if (user.verifyOTP === "" || user.verifyOTP !== otp) {
    throw new ValidationError("Invalid OTP!");
  }

  if (user.verifyOTPExpiredAt < Date.now()) {
    throw new ValidationError("OTP expired!");
  }

  user.isAccountVerified = true;
  user.verifyOTP = "";
  user.verifyOTPExpiredAt = 0;
  await user.save();

  return res.json({
    success: true,
    message: "Email verified successfully!",
  });
};

// check if user is authenticated
const isAuthenticated = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found!");
  }
  return res.json({ success: true, user });
};

//send password reset OTP
const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  //otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP = otp;
  user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;
  await user.save();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: " Password Reset OTP!",
    html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user.email
    ),
  };
  await transporter.sendMail(mailOptions);

  return res.json({ success: true, message: "OTP sent to your email!" });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    throw new ValidationError("Email, OTP, and new password are required!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  if (user.resetOTP === "" || user.resetOTP !== otp) {
    throw new ValidationError("Invalid OTP!");
  }

  if (user.resetOTPExpireAt < Date.now()) {
    throw new ValidationError("OTP expired!");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetOTP = "";
  user.resetOTPExpireAt = 0;
  await user.save();

  return res.json({
    success: true,
    message: "Password has been reset successfully!",
  });
};

module.exports = {
  register,
  login,
  logout,
  sendverifyOTP,
  verifyEmail,
  isAuthenticated,
  resetPassword,
  sendResetOtp,
};
