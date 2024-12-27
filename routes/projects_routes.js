const express = require("express");
const projectController = require("../controllers/project_controller");
const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const projects = express.Router();

projects.post(
  "/createProject",
  verifyToken,
  adminMiddleware,
  projectController.createProject
);
projects.get("/findAllProject", verifyToken, projectController.getAllProject);
projects.get(
  "/findProjectById/:id",
  verifyToken,
  projectController.getProjectById
);
projects.get(
  "/findProjectByTitle/:title",
  verifyToken,
  projectController.getProjectByTitle
);
projects.put(
  "/updateProject/:id",
  verifyToken,
  adminMiddleware,
  projectController.updateProject
);
projects.delete(
  "/deleteProject/:id",
  verifyToken,
  adminMiddleware,
  projectController.deleteProject
);

module.exports = projects;
