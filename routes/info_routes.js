const express = require("express");
const infoController = require("../controllers/info_controller");

const info = express.Router();

info.post("/createInfo", infoController.createInfo);
info.get("/findAllInfo", infoController.getAllInfo);
info.get("/findInfoById/:id", infoController.getInfoById);
info.put("/updateInfo/:id", infoController.updateInfo);
info.delete("/deleteInfo/:id", infoController.deleteInfo);

module.exports = info;
