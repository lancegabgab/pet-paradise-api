const userService = require("../services/users");

const registerUser = async (req, res) => {
    try {
        await userService.registerUser(req.body);
        res.status(201).send({ message: "Registered Successfully" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const token = await userService.loginUser(req.body);
        res.status(200).send({ access: token });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
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
