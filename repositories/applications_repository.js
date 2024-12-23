const pool = require("../config/db");

async function saveApplication(appData) {
  try {
    const { job_offer_id, user_id, resume_url, cover_url, status } = appData;

    const connection = await pool.getConnection();
    const query = `INSERT INTO applications(job_offer_id, user_id, resume_url, cover_url, status)
                   VALUES(?, ?, ?, ?, ?)`;

    const [result] = await connection.execute(query, [
      job_offer_id,
      user_id,
      resume_url,
      cover_url || null,
      status || "Pending",
    ]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Application:", error);
    throw error;
  }
}

async function findAllApplications() {
  try {
    const connection = await pool.getConnection();
    const query = `
     SELECT applications.id, applications.job_offer_id, applications.user_id, 
             applications.resume_url, applications.cover_url, 
             DATE_FORMAT(applications.date, '%d-%m-%Y') AS formatted_date, 
             applications.status, users.full_name, 
             job_offers.title_en, job_offers.title_ar
      FROM applications
      JOIN users ON applications.user_id = users.id
      JOIN job_offers ON applications.job_offer_id = job_offers.id`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Applications:", error);
    throw error;
  }
}

async function findApplicationById(appId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT applications.id, applications.job_offer_id, applications.user_id, 
             applications.resume_url, applications.cover_url, 
             DATE_FORMAT(applications.date, '%d-%m-%Y') AS formatted_date, 
             applications.status, users.full_name, 
             job_offers.title_en, job_offers.title_ar
      FROM applications
      JOIN users ON applications.user_id = users.id
      JOIN job_offers ON applications.job_offer_id = job_offers.id
      WHERE applications.id = ?`;
    const [rows] = await connection.execute(query, [appId]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("Application Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding Application by ID:", error);
    throw error;
  }
}

async function findApplicationByUsername(appName) {
  try {
    const connection = await pool.getConnection();
    const query = `
             SELECT applications.id, applications.job_offer_id, applications.user_id, 
             applications.resume_url, applications.cover_url, 
             DATE_FORMAT(applications.date, '%d-%m-%Y') AS formatted_date, 
             applications.status, users.full_name, 
             job_offers.title_en, job_offers.title_ar
      FROM applications
      JOIN users ON applications.user_id = users.id
      JOIN job_offers ON applications.job_offer_id = job_offers.id
      WHERE users.full_name LIKE ?`;
    const [rows] = await connection.execute(query, [`%${appName}%`]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Application by Username:", error);
    throw error;
  }
}

async function findApplicationByTitle(appTitle) {
  try {
    const connection = await pool.getConnection();
    const query = `
        SELECT applications.id, applications.job_offer_id, applications.user_id,
               applications.resume_url, applications.cover_url,
               DATE_FORMAT(applications.date, '%d-%m-%Y') AS formatted_date,
               applications.status, users.full_name,
               job_offers.title_en, job_offers.title_ar
        FROM applications
        JOIN users ON applications.user_id = users.id
        JOIN job_offers ON applications.job_offer_id = job_offers.id
        WHERE job_offers.title_en LIKE ? OR job_offers.title_ar LIKE ?`;
    const [rows] = await connection.execute(query, [
      `%${appTitle}%`,
      `%${appTitle}%`,
    ]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Application by Title:", error);
    throw error;
  }
}

async function updateApplication(appId, status) {
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE applications SET status = ? WHERE id = ?`;
    const [result] = await connection.execute(query, [status, appId]);
    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("Application Not Found or Status Unchanged!");
    }
    return { success: true, updatedRows: result.affectedRows };
  } catch (error) {
    console.error("Error updating Application status:", error);
    throw error;
  }
}

async function deleteApplication(appId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM applications WHERE id = ?`;
    const [result] = await connection.execute(query, [appId]);
    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("Application Not Found or Already Deleted!");
    }
    return { success: true, deletedRows: result.affectedRows };
  } catch (error) {
    console.error("Error deleting Application:", error);
    throw error;
  }
}

module.exports = {
  saveApplication,
  findAllApplications,
  findApplicationById,
  findApplicationByUsername,
  findApplicationByTitle,
  updateApplication,
  deleteApplication,
};
