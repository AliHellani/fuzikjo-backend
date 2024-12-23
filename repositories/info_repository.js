const pool = require("../config/db");

async function saveInfo(infoData) {
  try {
    const { phone_number, email, address_ar, address_en, maps_link } = infoData;
    const connection = await pool.getConnection();
    const query = `INSERT INTO info(phone_number, email, address_ar, address_en, maps_link)
        VALUES(?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [
      phone_number,
      email,
      address_ar,
      address_en,
      maps_link,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Info:", error);
    throw error;
  }
}

async function findAllInfo() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM info`;
    const [result] = await connection.execute(query);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error finding Infos:", error);
    throw error;
  }
}

async function findInfoById(infoId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM info WHERE id = ?`;
    const [rows] = await connection.execute(query, [infoId]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("Info Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding Info by ID:", error);
    throw error;
  }
}

async function updateInfo(infoData) {
  try {
    const { id, phone_number, email, address_ar, address_en, maps_link } =
      infoData;
    const connection = await pool.getConnection();
    const query = `UPDATE info 
        SET phone_number = ?, email = ?, address_ar = ?, address_en = ?, maps_link = ?
        WHERE id = ?`;

    const [result] = await connection.execute(query, [
      phone_number,
      email,
      address_ar,
      address_en,
      maps_link,
      id,
    ]);
    connection.release();
    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Info Not Found or No Changes Made",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating Info:", error);
    throw error;
  }
}

async function deleteInfo(id) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM info WHERE id = ?`;
    const [result] = await connection.execute(query, [id]);
    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("Info Not Found or Already Deleted");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting Info:", error);
    throw error;
  }
}

module.exports = {
  saveInfo,
  findAllInfo,
  findInfoById,
  updateInfo,
  deleteInfo,
};
