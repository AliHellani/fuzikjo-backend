const pool = require("../config/db");

async function saveNews(newsData) {
  try {
    const { title_ar, title_en, content_ar, content_en, author_id } = newsData;
    const connection = await pool.getConnection();

    const query = `INSERT INTO news(title_ar , title_en, content_ar, content_en, author_id)
                       VALUES(?, ?, ?, ?,?)`;

    const [result] = await connection.execute(query, [
      title_ar,
      title_en,
      content_ar,
      content_en,
      author_id,
    ]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
}

async function findAllNews() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM news`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding News:", error);
    throw error;
  }
}

async function findNewsById(newsId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM news WHERE id = ?`;
    const [rows] = await connection.execute(query, [newsId]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("News Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding News by ID:", error);
    throw error;
  }
}

async function findNewsByTitle(newsTitle, language) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM news WHERE ${
      language === "ar" ? "title_ar" : "title_en"
    } = ?`;
    const [rows] = await connection.execute(query, [newsTitle]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("News Not Found!");
    }

    return rows[0];
  } catch (error) {
    console.error("Error finding News by Title:", error);
    throw error;
  }
}

async function updateNews(newsData) {
  const { id, title_ar, title_en, content_ar, content_en, author_id } =
    newsData;

  try {
    const connection = await pool.getConnection();
    const query = `
        UPDATE news
        SET title_ar = ?, title_en = ?, content_ar = ?, content_en = ?, author_id = ?
        WHERE id = ?
        `;
    const [result] = await connection.execute(query, [
      title_ar,
      title_en,
      content_ar,
      content_en,
      author_id,
      id,
    ]);

    connection.release();
    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "News Not Found or No Changes Made",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating News:", error);
    throw error;
  }
}

async function deleteNews(newsId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM news WHERE id = ?`;

    const [result] = await connection.execute(query, [newsId]);
    connection.release();
    if (result.affectedRows === 0) {
      throw new Error("News Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting News:", error);
    throw error;
  }
}

module.exports = {
  saveNews,
  findAllNews,
  findNewsById,
  findNewsByTitle,
  updateNews,
  deleteNews,
};
