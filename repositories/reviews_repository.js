const pool = require("../config/db");

async function saveReviews(reviewData) {
  try {
    const { user_id, rating, comment_ar, comment_en, status } = reviewData;
    const connection = await pool.getConnection();

    const query = `INSERT INTO reviews(user_id, rating, comment_ar, comment_en, status, created_at)
        VALUES(?, ?, ?, ?, ?, NOW())`;

    const [result] = await connection.execute(query, [
      user_id,
      rating,
      comment_ar,
      comment_en,
      status,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Reviews:", error);
    throw error;
  }
}

async function findAllReviews() {
  try {
    const connection = await pool.getConnection();
    const query = `
  SELECT reviews.id, reviews.user_id, reviews.rating, reviews.comment_ar,
         reviews.comment_en, reviews.status,
         DATE_FORMAT(reviews.created_at, '%d-%m-%Y') AS formatted_date,
         users.full_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id`;

    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Reviews:", error);
    throw error;
  }
}

async function findReviewsById(reviewId) {
  try {
    const connection = await pool.getConnection();
    const query = `
    SELECT reviews.id, reviews.user_id, reviews.rating, reviews.comment_ar,
           reviews.comment_en, reviews.status,
           DATE_FORMAT(reviews.created_at, '%d-%m-%Y') AS formatted_date,
           users.full_name
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.id = ?`;
    const [rows] = await connection.execute(query, [reviewId]);
    if (rows.length === 0) {
      throw new Error("Reviews Not Found!");
    }
    connection.release();
    return rows[0];
  } catch (error) {
    console.error("Error finding Reviews by ID:", error);
    throw error;
  }
}

async function findReviewsByUser(userId) {
  try {
    const connection = await pool.getConnection();
    const query = `
    SELECT reviews.id, reviews.user_id, reviews.rating, reviews.comment_ar,
           reviews.comment_en, reviews.status,
           DATE_FORMAT(reviews.created_at, '%d-%m-%Y') AS formatted_date,
           users.full_name
       FROM reviews
       JOIN users ON reviews.user_id = users.id
      WHERE reviews.user_id = ?`;

    const [rows] = await connection.execute(query, [userId]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Reviews by User:", error);
    throw error;
  }
}

async function findReviewByUsername(username) {
  try {
    const connection = await pool.getConnection();
    const query = `
  SELECT reviews.id, reviews.user_id, reviews.rating, reviews.comment_ar,
         reviews.comment_en, reviews.status,
         DATE_FORMAT(reviews.created_at, '%d-%m-%Y') AS formatted_date,
         users.full_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE users.full_name LIKE ?
        `;

    const [rows] = await connection.execute(query, [`%${username}%`]);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding Review by Username:", error);
    throw error;
  }
}

async function updateReviews(reviewId, status) {
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE reviews 
                   SET status = ? 
                   WHERE id = ?`;
    const [rows] = await connection.execute(query, [status, reviewId]);
    connection.release();
    if (rows.affectedRows === 0) {
      throw new Error("Reviews Not Found or Status Unchanged!");
    }
    return rows;
  } catch (error) {
    console.error("Error finding Reviews:", error);
    throw error;
  }
}

async function deleteReview(reviewId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM reviews
                   WHERE id = ?`;
    const [rows] = await connection.execute(query, [reviewId]);
    connection.release();
    if (rows.affectedRows === 0) {
      throw new Error("Review Not Found!");
    }
    return rows;
  } catch (error) {
    console.error("Error Deleting Reviews:", error);
    throw error;
  }
}

module.exports = {
  saveReviews,
  findAllReviews,
  findReviewsById,
  findReviewByUsername,
  findReviewsByUser,
  updateReviews,
  deleteReview,
};
