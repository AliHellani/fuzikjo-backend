const pool = require("../config/db");

async function saveEmployees(employeeData) {
  try {
    const {
      name_ar,
      name_en,
      job_title_ar,
      job_title_en,
      profile_image_url,
      bio_ar,
      bio_en,
    } = employeeData;

    const connection = await pool.getConnection();
    const query = `
        INSERT INTO employees(name_ar, name_en, job_title_ar, job_title_en, profile_image_url, bio_ar, bio_en, created_at)
        VALUES(?, ?, ?, ?, ?, ?, ? , NOW())`;

    const [result] = await connection.execute(query, [
      name_ar,
      name_en,
      job_title_ar,
      job_title_en,
      profile_image_url,
      bio_ar,
      bio_en,
    ]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Employee:", error);
    throw error;
  }
}

async function findAllEmployee() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM employees`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding all Employee:", error);
    throw error;
  }
}

async function findEmployeeById(employeeId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM employees WHERE id = ?`;
    const [rows] = await connection.execute(query, [employeeId]);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error("Error finding Employee by ID:", error);
    throw error;
  }
}

async function findEmployeeByName(name) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM employees WHERE name_ar LIKE ? OR name_en LIKE ?`;
    const [rows] = await connection.execute(query, [`%${name}%`, `%${name}%`]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Employee by name:", error);
    throw error;
  }
}

async function findEmployeeByJobTitle(jobTitle) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM employees WHERE job_title_ar LIKE ? OR job_title_en LIKE ?`;
    const [rows] = await connection.execute(query, [
      `%${jobTitle}%`,
      `%${jobTitle}%`,
    ]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Employee by JobTitle:", error);
    throw error;
  }
}

async function updateEmployee(employeeData) {
  try {
    const {
      id,
      name_ar,
      name_en,
      job_title_ar,
      job_title_en,
      profile_image_url,
      bio_ar,
      bio_en,
    } = employeeData;
    const connection = await pool.getConnection();
    const query = `
        UPDATE employees
        SET name_ar = ?, name_en = ?, job_title_ar = ?, job_title_en = ?, profile_image_url = ?, bio_ar = ?, bio_en = ?
        WHERE id = ?`;
    const [result] = await connection.execute(query, [
      name_ar,
      name_en,
      job_title_ar,
      job_title_en,
      profile_image_url,
      bio_ar,
      bio_en,
      id,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error updating Employee:", error);
    throw error;
  }
}

async function deleteEmployee(employeeId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM employees WHERE id = ?`;
    const [result] = await connection.execute(query, [employeeId]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error deleting employee by ID:", error);
    throw error;
  }
}

module.exports = {
  saveEmployees,
  findAllEmployee,
  findEmployeeById,
  findEmployeeByName,
  findEmployeeByJobTitle,
  updateEmployee,
  deleteEmployee,
};
