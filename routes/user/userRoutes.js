const userController = require("../../controllers/user/userController.js");
const { verifyToken } = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/viewAllUsers", userController.getUsers);
router.post("/addUser", userController.addUser);
router.post("/login", userController.loginUser);
router.get("/logout", verifyToken, userController.logoutUser);
router.post("/viewUsersInRadius", verifyToken, userController.getUsersInRadius);
router.get("/verifyRefreshToken", userController.verifyRefreshToken);

module.exports = router;
