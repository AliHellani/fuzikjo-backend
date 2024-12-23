const express = require("express");
const serviceController = require("../controllers/services_controller");
const upload = require("../middlewares/servicesMiddleware");

const services = express.Router();

services.post("/createService", upload, serviceController.createService);
services.get("/findAllService", serviceController.getAllServices);
services.get("/findServiceById/:id", serviceController.getServiceById);
services.get("/findServiceByName/:name", serviceController.getServiceByName);
services.put("/updateService/:id", upload, serviceController.updateServices);
services.delete("/deleteService/:id", serviceController.deleteService);

module.exports = services;
