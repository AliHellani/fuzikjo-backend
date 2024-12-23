const applicationRepository = require("../repositories/applications_repository");
const jobOfferRepository = require("../repositories/jobOffers_repository");
const userRepository = require("../repositories/users_repository");
const validator = require("validator");
const path = require("path");
const fs = require("fs");

async function createApplication(req, res) {
  try {
    const { job_offer_id, user_id, status } = req.body;

    const resume_url = req.files["resume_url"]
      ? `/uploads/applicationsFile/${req.files["resume_url"][0].filename}`
      : null;

    const cover_url = req.files["cover_url"]
      ? `/uploads/applicationsFile/${req.files["cover_url"][0].filename}`
      : null;

    if (!job_offer_id || !user_id || !resume_url) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingJobOffer = await jobOfferRepository.findJobOffersById(
      job_offer_id
    );
    if (!existingJobOffer) {
      return res.status(404).json({ message: "Job offer not found" });
    }

    const existingUser = await userRepository.findUserById(user_id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const appData = {
      job_offer_id,
      user_id,
      resume_url,
      cover_url,
      status,
    };

    const result = await applicationRepository.saveApplication(appData);

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllApplication(req, res) {
  try {
    const applications = await applicationRepository.findAllApplications();

    const language = req.language;

    const filteredApp = applications.map((app) => ({
      id: app.id,
      jobOfferId: app.job_offer_id,
      userId: app.user_id,
      resumeUrl: app.resume_url,
      coverUrl: app.cover_url,
      status: app.status,
      title: language === "en" ? app.title_en : app.title_ar,
      date: app.formatted_date,
    }));
    res.status(200).json({
      message: "Applications retrieved successfully",
      ApplicationData: filteredApp,
    });
  } catch (error) {
    console.error("Error retrieving applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getApplicationById(req, res) {
  try {
    const { id } = req.params;
    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid Application ID" });
    }

    const app = await applicationRepository.findApplicationById(id);
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    const language = req.language;

    const responseApp = {
      id: app.id,
      jobOfferId: app.job_offer_id,
      userId: app.user_id,
      resumeUrl: app.resume_url,
      coverUrl: app.cover_url,
      status: app.status,
      title: language === "en" ? app.title_en : app.title_ar,
      date: app.formatted_date,
    };

    res.status(200).json({
      message: "Applications retrieved By ID successfully",
      data: responseApp,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve Application By ID",
      details: error.message,
    });
  }
}

async function getApplicationByUsername(req, res) {
  try {
    const { username } = req.params;
    if (!username || validator.isEmpty(username)) {
      return res.status(400).json({ message: "Username is required" });
    }

    const applications = await applicationRepository.findApplicationByUsername(
      username
    );

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this username" });
    }

    const language = req.language;

    const filteredApps = applications.map((app) => ({
      id: app.id,
      jobOfferId: app.job_offer_id,
      userId: app.user_id,
      resumeUrl: app.resume_url,
      coverUrl: app.cover_url,
      status: app.status,
      title: language === "en" ? app.title_en : app.title_ar,
      date: app.formatted_date,
    }));

    res.status(200).json({
      message: "Applications retrieved successfully",
      data: filteredApps,
    });
  } catch (error) {
    console.error("Error retrieving applications by username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getApplicationByTitle(req, res) {
  try {
    const { title } = req.params;
    if (!title || validator.isEmpty(title)) {
      return res.status(400).json({ message: "Title is required" });
    }

    const applications = await applicationRepository.findApplicationByTitle(
      title
    );

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this Title" });
    }

    const language = req.language;

    const filteredApps = applications.map((app) => ({
      id: app.id,
      jobOfferId: app.job_offer_id,
      userId: app.user_id,
      resumeUrl: app.resume_url,
      coverUrl: app.cover_url,
      status: app.status,
      title: language === "en" ? app.title_en : app.title_ar,
      date: app.formatted_date,
    }));

    res.status(200).json({
      message: "Applications retrieved successfully",
      data: filteredApps,
    });
  } catch (error) {
    console.error("Error retrieving applications by title:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid Application ID" });
    }

    if (!status || validator.isEmpty(status)) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await applicationRepository.updateApplication(id, status);

    res.status(200).json({
      message: "Application status updated successfully",
      updatedRows: result.updatedRows,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteApplication(req, res) {
  try {
    const { id } = req.params;

    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid Application ID" });
    }

    const applications = await applicationRepository.findApplicationById(id);
    if (!applications) {
      return res.status(404).json({ message: "Application not found" });
    }

    const resumePath = path.join(__dirname, "../", applications.resume_url);
    const coverPath = applications.cover_url
      ? path.join(__dirname, "../", applications.cover_url)
      : null;

    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
    if (coverPath && fs.existsSync(coverPath)) {
      fs.unlinkSync(coverPath);
    }

    const result = await applicationRepository.deleteApplication(id);

    res.status(200).json({
      message: "Application deleted successfully",
      deletedRows: result.deletedRows,
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createApplication,
  getAllApplication,
  getApplicationById,
  getApplicationByUsername,
  getApplicationByTitle,
  updateApplication,
  deleteApplication,
};
