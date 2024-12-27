const express = require("express");

const heroMediaController = require("../controllers/heroMedia_controller");

const upload = require("../middlewares/heroMediaMiddleware");
const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const heroMedia = express.Router();

heroMedia.post(
  "/createHeroMedia",
  verifyToken,
  adminMiddleware,
  upload("media"),
  heroMediaController.createHeroMedia
);
heroMedia.get(
  "/findAllHeroMedia",
  verifyToken,
  heroMediaController.getAllHeroMedia
);
heroMedia.get(
  "/findHeroMediaById/:id",
  verifyToken,
  heroMediaController.getHeroMediaById
);
heroMedia.put(
  "/updateHeroMedia/:id",
  verifyToken,
  adminMiddleware,
  upload("media"),
  heroMediaController.updateHeroMedia
);
heroMedia.delete(
  "/deleteHeroMedia/:id",
  verifyToken,
  adminMiddleware,
  heroMediaController.deleteHeroMedia
);

module.exports = heroMedia;
