const pool = require("../config/db");

async function saveNewsMedia(mediaData) {
  try {
    const { news_id, media_type, media_url } = mediaData;
    const connection = await pool.getConnection();

    const query = `INSERT INTO news_media(news_id, media_type, media_url)
        VALUES(?, ?, ?)`;
    const [result] = await connection.execute(query, [
      news_id,
      media_type,
      media_url,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating News Media:", error);
    throw error;
  }
}

async function findAllNewsMedia() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM news_media`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding News Media:", error);
    throw error;
  }
}

async function findNewsMediaById(mediaId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM news_media WHERE id = ?`;
    const [rows] = await connection.execute(query, [mediaId]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("News Media Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding News Media by ID:", error);
    throw error;
  }
}

async function updateNewsMedia(newsMediaData) {
  const { id, news_id, media_type, media_url } = newsMediaData;
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE news_media
        SET news_id = ?, media_type = ?, media_url = ?
        WHERE id = ?`;

    const [result] = await connection.execute(query, [
      news_id,
      media_type,
      media_url,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "News Media Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating News Media:", error);
    throw error;
  }
}

async function deleteNewsMedia(mediaId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM news_media WHERE id = ?`;

    const [result] = await connection.execute(query, [mediaId]);
    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("News Media Not Found or Already Deleted");
    }
    return result;
  } catch (error) {
    console.error("Error deleting News Media:", error);
    throw error;
  }
}

module.exports = {
  saveNewsMedia,
  findAllNewsMedia,
  findNewsMediaById,
  updateNewsMedia,
  deleteNewsMedia,
};
