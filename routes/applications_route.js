const express = require("express");
const applicationController = require("../controllers/applications_controller");
const upload = require("../middlewares/applicationMiddleware");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const applications = express.Router();

applications.post(
  "/createApplication",
  verifyToken,
  upload([
    { name: "resume_url", maxCount: 1 },
    { name: "cover_url", maxCount: 1 },
  ]),
  applicationController.createApplication
);
applications.get(
  "/findAllApplications",
  verifyToken,
  adminMiddleware,
  applicationController.getAllApplication
);
applications.get(
  "/findApplicationById/:id",
  verifyToken,
  adminMiddleware,
  applicationController.getApplicationById
);
applications.get(
  "/findApplicationByUsername/:username",
  verifyToken,
  adminMiddleware,
  applicationController.getApplicationByUsername
);
applications.get(
  "/findApplicationByTitle/:title",
  verifyToken,
  adminMiddleware,

  applicationController.getApplicationByTitle
);
applications.put(
  "/updateApplication/:id",
  verifyToken,
  adminMiddleware,
  applicationController.updateApplication
);
applications.delete(
  "/deleteApplication/:id",
  verifyToken,
  adminMiddleware,
  applicationController.deleteApplication
);

module.exports = applications;
