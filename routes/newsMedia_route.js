const express = require("express");
const newsMediaController = require("../controllers/newsMedia_controller");
const upload = require("../middlewares/newsMediaMiddleware");

const newsMedia = express.Router();

newsMedia.post(
  "/createNewsMedia",
  upload("media"),
  newsMediaController.createNewsMedia
);
newsMedia.get("/findAllNewsMedia", newsMediaController.getAllNewsMedia);
newsMedia.get("/findNewsMediaById/:id", newsMediaController.getNewsMediaById);
newsMedia.put(
  "/updateNewsMedia/:id",
  upload("media"),
  newsMediaController.updateNewsMedia
);
newsMedia.delete("/deleteNewsMedia/:id", newsMediaController.deleteNewsMedia);

module.exports = newsMedia;
