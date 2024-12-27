const express = require("express");
const newsMediaController = require("../controllers/newsMedia_controller");
const upload = require("../middlewares/newsMediaMiddleware");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const newsMedia = express.Router();

newsMedia.post(
  "/createNewsMedia",
  verifyToken,
  adminMiddleware,
  upload("media"),
  newsMediaController.createNewsMedia
);
newsMedia.get(
  "/findAllNewsMedia",
  verifyToken,
  newsMediaController.getAllNewsMedia
);
newsMedia.get(
  "/findNewsMediaById/:id",
  verifyToken,
  newsMediaController.getNewsMediaById
);
newsMedia.put(
  "/updateNewsMedia/:id",
  verifyToken,
  adminMiddleware,
  upload("media"),
  newsMediaController.updateNewsMedia
);
newsMedia.delete(
  "/deleteNewsMedia/:id",
  verifyToken,
  adminMiddleware,
  newsMediaController.deleteNewsMedia
);

module.exports = newsMedia;
