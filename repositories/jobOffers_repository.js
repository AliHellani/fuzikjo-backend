const pool = require("../config/db");

async function saveJobOffers(jobData) {
  try {
    const {
      title_ar,
      title_en,
      description_ar,
      description_en,
      requirements_ar,
      requirements_en,
      application_deadline,
    } = jobData;

    const jobOfferData = {
      title_ar: title_ar || null,
      title_en: title_en || null,
      description_ar: description_ar || null,
      description_en: description_en || null,
      requirements_ar: requirements_ar || null,
      requirements_en: requirements_en || null,
      application_deadline: application_deadline || null,
    };

    const connection = await pool.getConnection();

    const query = `
     INSERT INTO job_offers(title_ar, title_en, description_ar, description_en, requirements_ar, requirements_en, application_deadline, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
     `;

    const [result] = await connection.execute(query, [
      jobOfferData.title_ar,
      jobOfferData.title_en,
      jobOfferData.description_ar,
      jobOfferData.description_en,
      jobOfferData.requirements_ar,
      jobOfferData.requirements_en,
      jobOfferData.application_deadline,
    ]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Job Offers:", error);
    throw error;
  }
}

async function findAllJobOffer() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM job_offers`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Job Offers:", error);
    throw error;
  }
}

async function findJobOffersById(jobId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM job_offers WHERE id = ?`;
    const [rows] = await connection.execute(query, [jobId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Job Offer Not Found!");
    }

    return rows[0];
  } catch (error) {
    console.error("Error finding Job Offer by ID:", error);
    throw error;
  }
}

async function findJobOfferByTitle(jobTitle, language) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM job_offers WHERE ${
      language === "ar" ? "title_ar" : "title_en"
    } = ?`;
    const [rows] = await connection.execute(query, [jobTitle]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Job Offer Not Found!");
    }

    return rows[0];
  } catch (error) {
    console.error("Error finding Job Offer by Title:", error);
    throw error;
  }
}

async function updateJobOffer(jobData) {
  const {
    id,
    title_ar,
    title_en,
    description_ar,
    description_en,
    requirements_ar,
    requirements_en,
    application_deadline,
  } = jobData;
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE job_offers
        SET title_ar =?, title_en = ?, description_ar = ?, description_en = ?, requirements_ar = ?, requirements_en = ?, application_deadline = ?
        WHERE id = ?`;

    const [result] = await connection.execute(query, [
      title_ar,
      title_en,
      description_ar,
      description_en,
      requirements_ar,
      requirements_en,
      application_deadline,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Job Offer Not Found or No Changes Made",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating Job Offer:", error);
    throw error;
  }
}

async function deleteJobOffer(jobId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM job_offers WHERE id = ?`;
    const [result] = await connection.execute(query, [jobId]);

    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("Job Offer Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting Job Offer:", error);
    throw error;
  }
}

module.exports = {
  saveJobOffers,
  findAllJobOffer,
  findJobOffersById,
  findJobOfferByTitle,
  updateJobOffer,
  deleteJobOffer,
};
