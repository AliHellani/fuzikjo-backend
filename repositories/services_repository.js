const pool = require("../config/db");

async function saveService(serviceData) {
  try {
    const { name_ar, name_en, description_ar, description_en, image_url } =
      serviceData;
    const connection = await pool.getConnection();
    const query = `INSERT INTO services(name_ar, name_en, description_ar, description_en, image_url) VALUES(?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [
      name_ar,
      name_en,
      description_ar,
      description_en,
      image_url,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

async function findAllServices() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM services`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding all services:", error);
    throw error;
  }
}

async function findServiceById(serviceId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM services WHERE id = ?`;
    const [rows] = await connection.execute(query, [serviceId]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding service by ID:", error);
    throw error;
  }
}

async function findServiceByName(serviceName) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM services WHERE name_ar LIKE ? OR name_en LIKE ?`;
    const [rows] = await connection.execute(query, [
      `%${serviceName}%`,
      `%${serviceName}%`,
    ]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding service by name:", error);
    throw error;
  }
}

async function updateService(serviceData) {
  try {
    const { id, name_ar, name_en, description_ar, description_en, image_url } =
      serviceData;
    const connection = await pool.getConnection();
    const query = `UPDATE services SET name_ar = ?, name_en = ?, description_ar = ?, description_en = ?, image_url = ? WHERE id = ?`;
    const [result] = await connection.execute(query, [
      name_ar,
      name_en,
      description_ar,
      description_en,
      image_url,
      id,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

async function deleteService(serviceId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM services WHERE id = ?`;
    const [result] = await connection.execute(query, [serviceId]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error deleting service by ID:", error);
    throw error;
  }
}

module.exports = {
  saveService,
  findAllServices,
  findServiceById,
  findServiceByName,
  updateService,
  deleteService,
};
