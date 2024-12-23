const express = require("express");

const jobOfferController = require("../controllers/jobOffers_controller");

const jobOffer = express.Router();

jobOffer.post("/createJobOffer", jobOfferController.createJobOffer);
jobOffer.get("/findAllJobOffer", jobOfferController.getAllJobOffer);
jobOffer.get("/findJobOfferById/:id", jobOfferController.getJobOfferById);
jobOffer.put("/updateJobOffer/:id", jobOfferController.updateJobOffer);
jobOffer.delete("/deleteJobOffer/:id", jobOfferController.deleteJobOffer);

module.exports = jobOffer;
