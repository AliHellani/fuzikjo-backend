const pool = require("../config/db");

async function saveLinks(linksData) {
  try {
    const { provider_name_ar, provider_name_en, provider_link, icon_url } =
      linksData;
    const connection = await pool.getConnection();
    const query = `INSERT INTO links (provider_name_ar, provider_name_en, provider_link, icon_url) 
                   VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [
      provider_name_ar,
      provider_name_en,
      provider_link,
      icon_url,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Link:", error);
    throw error;
  }
}

async function findAllLinks() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM links`;
    const [result] = await connection.execute(query);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error fetching all Links:", error);
    throw error;
  }
}

async function findLinksById(linksId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM links WHERE id = ?`;
    const [rows] = await connection.execute(query, [linksId]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("Links Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error fetching Links by ID:", error);
    throw error;
  }
}

async function findLinksByProviderName(providerName) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM links 
                       WHERE provider_name_ar LIKE ? OR provider_name_en LIKE ?`;
    const [rows] = await connection.execute(query, [
      `%${providerName}%`,
      `%${providerName}%`,
    ]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error fetching Links by ProviderName:", error);
    throw error;
  }
}

async function updateLinks(linksData) {
  const { id, provider_name_ar, provider_name_en, provider_link, icon_url } =
    linksData;
  try {
    const connection = await pool.getConnection();
    const query = `
        UPDATE links
        SET provider_name_ar = ?, provider_name_en = ?, provider_link = ?, icon_url = ?
        WHERE id = ?`;
    const [result] = await connection.execute(query, [
      provider_name_ar,
      provider_name_en,
      provider_link,
      icon_url,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Links Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Links:", error);
    throw error;
  }
}

async function deleteLinks(linkId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM links WHERE id = ?`;
    const [result] = await connection.execute(query, [linkId]);
    connection.release();
    if (result.affectedRows === 0) {
      return { success: false, message: "Link Not Found" };
    }
    return result;
  } catch (error) {
    console.error("Error deleting Link:", error);
    throw error;
  }
}

module.exports = {
  saveLinks,
  findAllLinks,
  findLinksById,
  findLinksByProviderName,
  updateLinks,
  deleteLinks,
};
