const express = require("express");
const newsController = require("../controllers/news_controller");
const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const news = express.Router();

news.post(
  "/createNews",
  verifyToken,
  adminMiddleware,
  newsController.createNews
);
news.get("/findAllNews", verifyToken, newsController.getAllNews);
news.get("/findNewsById/:id", verifyToken, newsController.getNewsById);
news.get("/findNewsByTitle/:title", verifyToken, newsController.getNewsByTitle);
news.put(
  "/updateNews/:id",
  verifyToken,
  adminMiddleware,
  newsController.updateNews
);
news.delete(
  "/deleteNews/:id",
  verifyToken,
  adminMiddleware,
  newsController.deleteNews
);

module.exports = news;
