const express = require("express");
const applicationController = require("../controllers/applications_controller");
const upload = require("../middlewares/applicationMiddleware");

const applications = express.Router();

applications.post(
  "/createApplication",
  upload([
    { name: "resume_url", maxCount: 1 },
    { name: "cover_url", maxCount: 1 },
  ]),
  applicationController.createApplication
);
applications.get(
  "/findAllApplications",
  applicationController.getAllApplication
);
applications.get(
  "/findApplicationById/:id",
  applicationController.getApplicationById
);
applications.get(
  "/findApplicationByUsername/:username",
  applicationController.getApplicationByUsername
);
applications.get(
  "/findApplicationByTitle/:title",
  applicationController.getApplicationByTitle
);
applications.put(
  "/updateApplication/:id",
  applicationController.updateApplication
);
applications.delete(
  "/deleteApplication/:id",
  applicationController.deleteApplication
);

module.exports = applications;
