const User = require("../models/users");
const bcrypt = require("bcrypt");
const auth = require("../auth");

const registerUser = async (userData) => {
    if (userData.mobileNo.length !== 11)
        throw new Error("Your number is not 11 digits");
    if (!userData.email.includes("@")) 
        throw new Error("Your email does not include @ character");
    if (userData.password.length < 8) 
        throw new Error("Your password must compose of atleast 8 characters");
    const newUser = new User({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: bcrypt.hashSync(userData.password, 10),
        mobileNo: userData.mobileNo,
        isAdmin: userData.isAdmin
    });
    return await newUser.save();
};

const loginUser = async (userData) => {
    const user = await User.findOne({ email: userData.email });
    if (!user) 
        throw new Error("No Email Found");
    const isPasswordCorrect = bcrypt.compareSync(userData.password, user.password);
    if (!isPasswordCorrect)
        throw new Error("Email and password do not match");
    return auth.createAccessToken(user);
};

const getAllUsers = async () => {
    return await User.find({});
};

const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");
    user.password = "";
    return user;
};

const resetPassword = async (userId, newPassword) => {
    if (newPassword.length < 8)
        throw new Error("Password must be at least 8 characters");
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    return "Password reset successfully";
};

const updateAdmin = async (requestingUser, userId) => {
    if (!requestingUser.isAdmin)
        throw new Error("Permission denied. Only admins can update user roles.");
    await User.findByIdAndUpdate(userId, { isAdmin: true });
    return "User role updated successfully";
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getProfile,
    resetPassword,
    updateAdmin
};