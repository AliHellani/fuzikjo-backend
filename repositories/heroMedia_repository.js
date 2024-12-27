const pool = require("../config/db");

async function saveHeroMedia(heroData) {
  try {
    const { media_type, media_url } = heroData;
    const connection = await pool.getConnection();
    const query = `INSERT INTO hero_media(media_type, media_url)
        VALUES(?, ?)`;
    const [result] = await connection.execute(query, [media_type, media_url]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Hero Media:", error);
    throw error;
  }
}

async function findAllHeroMedia() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM hero_media`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Hero Media:", error);
    throw error;
  }
}

async function findHeroMediaById(heroId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM hero_media WHERE id = ?`;
    const [rows] = await connection.execute(query, [heroId]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("Hero Media Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding Hero Media by ID:", error);
    throw error;
  }
}

async function updateHeroMedia(heroMediaData) {
  const { id, media_type, media_url } = heroMediaData;
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE hero_media
          SET media_type = ?, media_url = ?
          WHERE id = ?`;

    const [result] = await connection.execute(query, [
      media_type,
      media_url,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Hero Media Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Hero Media:", error);
    throw error;
  }
}

async function deleteHeroMedia(heroId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM hero_media WHERE id = ?`;

    const [result] = await connection.execute(query, [heroId]);
    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("Hero Media Not Found or Already Deleted");
    }
    return result;
  } catch (error) {
    console.error("Error deleting Hero Media:", error);
    throw error;
  }
}

module.exports = {
  saveHeroMedia,
  findAllHeroMedia,
  findHeroMediaById,
  updateHeroMedia,
  deleteHeroMedia,
};
