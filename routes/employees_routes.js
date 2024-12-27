const express = require("express");

const employeeController = require("../controllers/employees_controller");
const upload = require("../middlewares/employeeMiddleware");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const employees = express.Router();

employees.post(
  "/createEmployee",
  verifyToken,
  adminMiddleware,
  upload,
  employeeController.createEmployee
);
employees.get(
  "/findAllEmployees",
  verifyToken,
  employeeController.getALlEmployee
);
employees.get(
  "/findEmployeeById/:id",
  verifyToken,
  employeeController.getEmployeeById
);
employees.get(
  "/findEmployeeByName/:name",
  verifyToken,
  employeeController.getEmployeeByName
);
employees.get(
  "/findEmployeeByJobTitle/:job_title",
  verifyToken,
  employeeController.getEmployeeByJobTitle
);
employees.put(
  "/updateEmployee/:id",
  verifyToken,
  adminMiddleware,
  upload,
  employeeController.updateEmployee
);
employees.delete(
  "/deleteEmployee/:id",
  verifyToken,
  adminMiddleware,
  employeeController.deleteEmployee
);

module.exports = employees;
