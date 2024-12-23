const jobOfferRepository = require("../repositories/jobOffers_repository");
const validator = require("validator");
const moment = require("moment");

async function createJobOffer(req, res) {
  try {
    const {
      title_ar,
      title_en,
      description_ar,
      description_en,
      requirements_ar,
      requirements_en,
      application_deadline,
    } = req.body;

    // Validate and format the application_deadline
    const formattedDeadline = moment(
      application_deadline,
      ["DD-MM-YYYY"],
      true
    ).isValid()
      ? moment(application_deadline, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      : null;

    if (!formattedDeadline) {
      return res
        .status(400)
        .json({ error: "Invalid application_deadline format" });
    }

    const jobData = await jobOfferRepository.saveJobOffers({
      title_ar,
      title_en,
      description_ar,
      description_en,
      requirements_ar,
      requirements_en,
      application_deadline: formattedDeadline,
    });

    res.status(201).json({
      message: "Job Offer created successfully",
      jobId: jobData.insertId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create Job Offer", details: error.message });
  }
}

async function getAllJobOffer(req, res) {
  try {
    const jobOffer = await jobOfferRepository.findAllJobOffer();
    const language = req.language;

    const filteredJobOffer = jobOffer.map((job) => {
      const formattedDeadline = moment(job.application_deadline).format(
        "DD-MM-YYYY"
      );
      const createdAt = moment(job.created_at).format("DD-MM-YYYY");

      if (language === "ar") {
        return {
          id: job.id,
          title: job.title_ar,
          description: job.description_ar,
          requirements: job.requirements_ar,
          application_deadline: formattedDeadline,
          created_at: createdAt,
        };
      } else {
        return {
          id: job.id,
          title: job.title_en,
          description: job.description_en,
          requirements: job.requirements_en,
          application_deadline: formattedDeadline,
          created_at: createdAt,
        };
      }
    });
    res.status(200).json(filteredJobOffer);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve Job Offer", details: error.message });
  }
}

async function getJobOfferById(req, res) {
  try {
    const { id } = req.params;

    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid Job Offer ID" });
    }

    const jobOffer = await jobOfferRepository.findJobOffersById(id);

    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found" });
    }

    const language = req.language;

    // Format the application_deadline
    const formattedDeadline = moment(jobOffer.application_deadline).format(
      "DD-MM-YYYY"
    );
    const createdAt = moment(jobOffer.created_at).format("DD-MM-YYYY");
    const responseOffer = {
      id: jobOffer.id,
      application_deadline: formattedDeadline,
      created_at: createdAt,
    };

    if (language === "ar") {
      responseOffer.title_ar = jobOffer.title_ar;
      responseOffer.description_ar = jobOffer.description_ar;
      responseOffer.requirements_ar = jobOffer.requirements_ar;
    } else {
      responseOffer.title_en = jobOffer.title_en;
      responseOffer.description_en = jobOffer.description_en;
      responseOffer.requirements_en = jobOffer.requirements_en;
    }

    res.status(200).json(responseOffer);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve Job Offer By ID",
      details: error.message,
    });
  }
}

async function updateJobOffer(req, res) {
  const { id } = req.params;
  const {
    title_ar,
    title_en,
    description_ar,
    description_en,
    requirements_ar,
    requirements_en,
    application_deadline,
  } = req.body;
  try {
    const existingJobOffer = await jobOfferRepository.findJobOffersById(id);
    if (!existingJobOffer) {
      return res.status(404).json({ message: "Job Offer Not Found" });
    }

    const updatedData = {
      id,
      title_ar: title_ar || existingJobOffer.title_ar,
      title_en: title_en || existingJobOffer.title_en,
      description_ar: description_ar || existingJobOffer.description_ar,
      description_en: description_en || existingJobOffer.description_en,
      requirements_ar: requirements_ar || existingJobOffer.requirements_ar,
      requirements_en: requirements_en || existingJobOffer.requirements_en,
      application_deadline:
        application_deadline || existingJobOffer.application_deadline,
    };

    await jobOfferRepository.updateJobOffer(updatedData);
    return res.status(200).json({
      message: "News updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update Job Offer", details: error.message });
  }
}

async function deleteJobOffer(req, res) {
  const { id } = req.params;
  try {
    const jobOffer = await jobOfferRepository.findJobOffersById(id);

    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found!" });
    }

    await jobOfferRepository.deleteJobOffer(id);
    return res.status(200).json({ message: "Job Offer deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Job Offer",
      details: error.message,
    });
  }
}

module.exports = {
  createJobOffer,
  getAllJobOffer,
  getJobOfferById,
  updateJobOffer,
  deleteJobOffer,
};
