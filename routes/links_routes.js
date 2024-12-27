const express = require("express");
const linkController = require("../controllers/links_controller");

const upload = require("../middlewares/linksMiddleware");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const links = express.Router();

links.post(
  "/createLink",
  verifyToken,
  adminMiddleware,
  upload,
  linkController.createLink
);
links.get("/findAllLinks", verifyToken, linkController.getAllLinks);
links.get(
  "/findLinkById/:id",
  verifyToken,
  adminMiddleware,
  linkController.getLinksById
);
links.get(
  "/findLinkByProviderName/:provider_name",
  verifyToken,
  adminMiddleware,
  linkController.getLinkByProviderName
);
links.put(
  "/updateLink/:id",
  verifyToken,
  adminMiddleware,
  upload,
  linkController.updateLink
);
links.delete(
  "/deleteLink/:id",
  verifyToken,
  adminMiddleware,
  linkController.deleteLink
);

module.exports = links;
