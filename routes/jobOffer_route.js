const express = require("express");

const jobOfferController = require("../controllers/jobOffers_controller");

const {
  verifyToken,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const jobOffer = express.Router();

jobOffer.post(
  "/createJobOffer",
  verifyToken,
  adminMiddleware,
  jobOfferController.createJobOffer
);
jobOffer.get(
  "/findAllJobOffer",
  verifyToken,
  jobOfferController.getAllJobOffer
);
jobOffer.get(
  "/findJobOfferById/:id",
  verifyToken,
  jobOfferController.getJobOfferById
);
jobOffer.put(
  "/updateJobOffer/:id",
  verifyToken,
  adminMiddleware,
  jobOfferController.updateJobOffer
);
jobOffer.delete(
  "/deleteJobOffer/:id",
  verifyToken,
  adminMiddleware,
  jobOfferController.deleteJobOffer
);

module.exports = jobOffer;
