const express = require("express");
const serviceController = require("../controllers/services_controller");
const upload = require("../middlewares/servicesMiddleware");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const services = express.Router();

services.post(
  "/createService",
  verifyToken,
  adminMiddleware,
  upload,
  serviceController.createService
);
services.get("/findAllService", verifyToken, serviceController.getAllServices);
services.get(
  "/findServiceById/:id",
  verifyToken,
  serviceController.getServiceById
);
services.get(
  "/findServiceByName/:name",
  verifyToken,
  serviceController.getServiceByName
);
services.put(
  "/updateService/:id",
  upload,
  verifyToken,
  adminMiddleware,
  serviceController.updateServices
);
services.delete(
  "/deleteService/:id",
  verifyToken,
  adminMiddleware,
  serviceController.deleteService
);

module.exports = services;
