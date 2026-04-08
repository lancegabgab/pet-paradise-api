const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const createAccessToken = require("../middlewares/createAccessToken");

const registerUser = async ({ firstName, lastName, email, password, mobileNo, isAdmin = false }) => {
  if (!firstName)
    throw new Error("First name is required");

  if (!lastName)
    throw new Error("Last name is required");

  if (!email || !email.includes("@"))
    throw new Error("Invalid email format");

  if (!password || password.length < 8) 
    throw new Error("Password must be at least 8 characters");

  if (!mobileNo || mobileNo.length !== 11)
    throw new Error("Mobile number must be 11 digits");

  const existingUser = await User.findOne({
    $or: [{ email }, { mobileNo }]
  });

  if (existingUser)
    throw new Error("Email or mobile number already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    mobileNo,
    isAdmin
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user)
    throw new Error("Invalid email or password");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new Error("Invalid email or password");

  const token = createAccessToken({
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    }
  };
};

const getAllUsers = async () => {
  return await User.find({});
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user)
    throw new Error("User not found");
  
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNo: user.mobileNo,
    isAdmin: user.isAdmin
  };
};

const resetPassword = async (userId, newPassword) => {
  if (newPassword.length < 8)
    throw new Error("Password must be at least 8 characters");
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  return await User.findByIdAndUpdate(userId, { password: hashedPassword });
};

const updateAdmin = async (requestingUser, userId) => {
  if (!requestingUser.isAdmin)
    throw new Error("Permission denied. Only admins can update user roles.");
  return await User.findByIdAndUpdate(userId, { isAdmin: true });
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getProfile,
    resetPassword,
    updateAdmin
};
