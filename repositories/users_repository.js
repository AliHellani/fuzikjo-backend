const pool = require("../config/db");

async function saveUsers(userData) {
  let connection;
  try {
    const { full_name, email, hash_password, is_admin } = userData;
    connection = await pool.getConnection();

    const query = ` INSERT INTO users (full_name, email, hash_password, is_admin, created_at)
                    VALUES (?, ?, ?, ?, NOW()) `;
    const [result] = await connection.execute(query, [
      full_name,
      email,
      hash_password,
      is_admin,
    ]);

    return result;
  } catch (error) {
    console.error("Error creating User:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function findAllUsers() {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `SELECT * FROM users`;
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    console.error("Error Finding Users:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function findUserById(userId) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute(query, [userId]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("User Not Found!!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error Finding User By ID:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function findUserByFullName(fullName) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `SELECT * FROM users WHERE full_name = ?`;
    const [rows] = await connection.execute(query, [fullName]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("User Not Found!!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error Finding User By Full Name:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function findUserByEmail(email) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = ` SELECT * FROM users WHERE email = ?`;
    const [rows] = await connection.execute(query, [email]);
    connection.release();
    if (rows.length === 0) {
      throw new Error("User Not Found!!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error Finding User By Email:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function updateUser(userData) {
  const { id, full_name, email, hash_password, is_admin } = userData;
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `UPDATE users 
        SET full_name = ?, email = ?, hash_password = ?, is_admin = ?
        WHERE id = ?`;

    const [result] = await connection.execute(query, [
      full_name,
      email,
      hash_password,
      is_admin,
      id,
    ]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "User Not Found!! or No Changes Made",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error Updating User:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteUser(id) {
  let connection;
  try {
    connection = await pool.getConnection();

    const query = `DELETE FROM users WHERE id = ?`;
    const [result] = await connection.execute(query, [id]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("User Not Found or Already Deleted!");
    }
    return result;
  } catch (error) {
    console.error("Error Deleting User:", error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  saveUsers,
  findAllUsers,
  findUserById,
  findUserByFullName,
  findUserByEmail,
  updateUser,
  deleteUser,
};
