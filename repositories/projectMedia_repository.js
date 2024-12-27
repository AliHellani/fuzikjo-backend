const pool = require("../config/db");

async function createProjectMedia(mediaData) {
  try {
    const { project_id, media_type, media_url } = mediaData;
    const connection = await pool.getConnection();
    const query = `INSERT INTO project_media(project_id, media_type, media_url)
        VALUES(?, ?, ?)`;
    const [result] = await connection.execute(query, [
      project_id,
      media_type,
      media_url,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Project Media:", error);
    throw error;
  }
}

async function findAllProjectMedia() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM project_media`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Project Media:", error);
    throw error;
  }
}

async function findProjectMediaById(mediaId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM project_media WHERE id = ?`;
    const [rows] = await connection.execute(query, [mediaId]);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error("Error finding Project Media By Id:", error);
    throw error;
  }
}

async function updateProjectMedia(mediaData) {
  const { id, project_id, media_type, media_url } = mediaData;
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE project_media
                       SET project_id = ? , media_type = ?, media_url = ?
                       WHERE id = ?`;
    const [result] = await connection.execute(query, [
      project_id,
      media_type,
      media_url,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Project Media Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Project Media:", error);
    throw error;
  }
}

async function deleteProjectMedia(mediaId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM project_media WHERE id = ?`;
    const [result] = await connection.execute(query, [mediaId]);
    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("Project Media Not Found or Already Deleted");
    }
    return result;
  } catch (error) {
    console.error("Error deleting Project Media:", error);
    throw error;
  }
}

module.exports = {
  createProjectMedia,
  findAllProjectMedia,
  findProjectMediaById,
  updateProjectMedia,
  deleteProjectMedia,
};
