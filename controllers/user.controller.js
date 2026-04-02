const userService = require("../services/user.service");

const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const token = await userService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { access: token }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
    try {
        const user = await userService.getProfile(req.user.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const message = await userService.resetPassword(
            req.user.id,
            req.body.newPassword
        );
        res.status(200).send({ message });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const message = await userService.updateAdmin(
            req.user,
            req.params.userId
        );
        res.status(200).send({ message });
    } catch (error) {
        res.status(403).send({ error: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser,
    getAllUsers,
    getProfile,
    resetPassword,
    updateAdmin
};
