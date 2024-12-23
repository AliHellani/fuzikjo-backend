const express = require("express");
const newsController = require("../controllers/news_controller");

const news = express.Router();

news.post("/createNews", newsController.createNews);
news.get("/findAllNews", newsController.getAllNews);
news.get("/findNewsById/:id", newsController.getNewsById);
news.get("/findNewsByTitle/:title", newsController.getNewsByTitle);
news.put("/updateNews/:id", newsController.updateNews);
news.delete("/deleteNews/:id", newsController.deleteNews);

module.exports = news;
