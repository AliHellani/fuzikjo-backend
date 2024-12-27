const express = require("express");

const projectMediaController = require("../controllers/projectMedia_controller");

const upload = require("../middlewares/projectMediaMiddleware");
const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const projectMedia = express.Router();

projectMedia.post(
  "/createProjectMedia",
  verifyToken,
  adminMiddleware,
  upload("media"),
  projectMediaController.createProjectMedia
);
projectMedia.get(
  "/findAllProjectMedia",
  verifyToken,
  projectMediaController.getAllProjectMedia
);
projectMedia.get(
  "/findProjectMediaById/:id",
  verifyToken,
  projectMediaController.getProjectMediaById
);
projectMedia.put(
  "/updateProjectMedia/:id",
  verifyToken,
  adminMiddleware,
  upload("media"),
  projectMediaController.updateProjectMedia
);
projectMedia.delete(
  "/deleteProjectMedia/:id",
  verifyToken,
  adminMiddleware,
  projectMediaController.deleteProjectMedia
);

module.exports = projectMedia;
