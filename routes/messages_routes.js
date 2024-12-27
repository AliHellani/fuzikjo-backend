const express = require("express");
const messageController = require("../controllers/messages_controller");
const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const messages = express.Router();

messages.post("/createMessage", verifyToken, messageController.createMessage);
messages.get(
  "/findAllMessage",
  verifyToken,
  adminMiddleware,
  messageController.getAllMessages
);
messages.get(
  "/findMessageById/:id",
  verifyToken,
  adminMiddleware,
  messageController.getMessageById
);
messages.get(
  "/findMessageByUsername/:username",
  verifyToken,
  adminMiddleware,
  messageController.getMessageByUsername
);
messages.delete(
  "/deleteMessage/:id",
  verifyToken,
  adminMiddleware,
  messageController.deleteMessage
);

module.exports = messages;
