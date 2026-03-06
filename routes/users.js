const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/all", verify, verifyAdmin, userController.getAllUsers);
router.get('/details', verify, userController.getProfile);
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.updateAdmin);
router.patch('/update-password', verify, userController.resetPassword);

module.exports = router;

