const express = require("express");
const infoController = require("../controllers/info_controller");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const info = express.Router();

info.post(
  "/createInfo",
  verifyToken,
  adminMiddleware,
  infoController.createInfo
);
info.get("/findAllInfo", verifyToken, infoController.getAllInfo);
info.get(
  "/findInfoById/:id",
  verifyToken,
  adminMiddleware,
  infoController.getInfoById
);
info.put(
  "/updateInfo/:id",
  verifyToken,
  adminMiddleware,
  infoController.updateInfo
);
info.delete(
  "/deleteInfo/:id",
  verifyToken,
  adminMiddleware,
  infoController.deleteInfo
);

module.exports = info;
