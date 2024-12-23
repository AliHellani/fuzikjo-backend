const express = require("express");
const userController = require("../controllers/user_controller");
const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const customer = express.Router();

customer.post("/registerUser", userController.registerUser);
customer.post("/loginUser", userController.loginUser);

customer.post("/createUser", userController.createUser);
customer.get(
  "/findAllUser",
  verifyToken,
  adminMiddleware,
  userController.getAllUser
);
customer.get(
  "/findUserById/:id",
  verifyToken,
  adminMiddleware,
  userController.getUserById
);
customer.get(
  "/findUserByName/:full_name",
  verifyToken,
  adminMiddleware,
  userController.getUserByFullname
);
customer.get(
  "/findUserByEmail/:email",
  verifyToken,
  adminMiddleware,
  userController.getUserByEmail
);
customer.put(
  "/updateUser/:id",
  verifyToken,
  adminMiddleware,
  userController.updateUser
);
customer.delete(
  "/deleteUser/:id",
  verifyToken,
  adminMiddleware,
  userController.deleteUser
);

module.exports = customer;
