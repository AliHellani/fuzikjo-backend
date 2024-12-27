const messageRepository = require("../repositories/messages_repository");
const userRepository = require("../repositories/users_repository");

async function createMessage(req, res) {
  try {
    const { user_id, subject_ar, subject_en, message_ar, message_en } =
      req.body;
    const messageData = await messageRepository.saveMessages({
      user_id,
      subject_ar,
      subject_en,
      message_ar,
      message_en,
    });
    res.status(201).json({
      message: "Message created successfully",
      MessageId: messageData.insertId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create Message", details: error.message });
  }
}

async function getAllMessages(req, res) {
  try {
    const messages = await messageRepository.findAllMessages();
    const language = req.language;
    const filteredMessage = messages.map((message) => ({
      id: message.id,
      userId: message.user_id,
      subject: language === "ar" ? message.subject_ar : message.subject_en,
      message: language === "ar" ? message.message_ar : message.message_en,
      username: message.full_name,
      createdAt: message.formatted_date,
    }));

    res.status(200).json({
      message: "Messages retrieved successfully",
      MessageData: filteredMessage,
    });
  } catch (error) {
    console.error("Error retrieving Message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getMessageById(req, res) {
  try {
    const { id } = req.params;
    const messages = await messageRepository.findMessageById(id);
    if (!messages) {
      return res.status(404).json({ message: "Message not found" });
    }

    const language = req.language;
    const responseMessage = {
      id: messages.id,
      userId: messages.user_id,
      subject: language === "ar" ? messages.subject_ar : messages.subject_en,
      message: language === "ar" ? messages.message_ar : messages.message_en,
      username: messages.full_name,
      createdAt: messages.formatted_date,
    };
    res.status(200).json({
      message: "Message retrieved By ID successfully",
      MessageData: responseMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve Message By ID",
      details: error.message,
    });
  }
}

async function getMessageByUsername(req, res) {
  try {
    const { username } = req.params;
    const responseUser = await userRepository.findUserByFullName(username);
    if (!responseUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const messages = await messageRepository.findMessageByUsername(username);

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No Message found for this username" });
    }
    const language = req.language;

    const responseMessage = messages.map((message) => ({
      id: message.id,
      userId: message.user_id,
      subject: language === "ar" ? message.subject_ar : message.subject_en,
      message: language === "ar" ? message.message_ar : message.message_en,
      username: message.full_name,
      createdAt: message.formatted_date,
    }));
    res.status(200).json({
      message: "Message retrieved By Username successfully",
      MessageData: responseMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve Message By Username",
      details: error.message,
    });
  }
}

async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const existingMessage = await messageRepository.findMessageById(id);
    if (!existingMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    const result = await messageRepository.deleteMessage(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      deletedRows: result.deletedRows,
    });
  } catch (error) {
    console.error("Error deleting Message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  getMessageByUsername,
  deleteMessage,
};
