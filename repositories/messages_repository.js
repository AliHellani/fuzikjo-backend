const pool = require("../config/db");

async function saveMessages(messageData) {
  try {
    const { user_id, subject_ar, subject_en, message_ar, message_en } =
      messageData;
    const connection = await pool.getConnection();
    const query = `
        INSERT INTO messages(user_id, subject_ar, subject_en, message_ar, message_en, created_at)
        VALUES(?, ?, ?, ?, ?, NOW())`;
    const [result] = await connection.execute(query, [
      user_id,
      subject_ar,
      subject_en,
      message_ar,
      message_en,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Message:", error);
    throw error;
  }
}

async function findAllMessages() {
  try {
    const connection = await pool.getConnection();
    const query = `
        SELECT 
        messages.id, 
        messages.user_id, 
        messages.subject_ar, 
        messages.subject_en, 
        messages.message_ar, 
        messages.message_en, 
        DATE_FORMAT(messages.created_at, '%d-%m-%Y') AS formatted_date,
        users.full_name
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC`;
    const [result] = await connection.execute(query);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error finding Messages:", error);
    throw error;
  }
}

async function findMessageById(messageId) {
  try {
    const connection = await pool.getConnection();
    const query = `
        SELECT 
        messages.id, 
        messages.user_id, 
        messages.subject_ar, 
        messages.subject_en, 
        messages.message_ar, 
        messages.message_en, 
        DATE_FORMAT(messages.created_at, '%d-%m-%Y') AS formatted_date,
        users.full_name
      FROM messages
      JOIN users ON messages.user_id = users.id
      WHERE messages.id = ?`;
    const [result] = await connection.execute(query, [messageId]);
    if (result.length === 0) {
      throw new Error("Message Not Found!");
    }
    connection.release();
    return result[0];
  } catch (error) {
    console.error("Error finding Message By ID:", error);
    throw error;
  }
}

async function findMessageByUsername(username) {
  try {
    const connection = await pool.getConnection();
    const query = `
        SELECT 
        messages.id, 
        messages.user_id, 
        messages.subject_ar, 
        messages.subject_en, 
        messages.message_ar, 
        messages.message_en, 
        DATE_FORMAT(messages.created_at, '%d-%m-%Y') AS formatted_date,
        users.full_name
      FROM messages
      JOIN users ON messages.user_id = users.id
      WHERE users.full_name LIKE ?
        `;
    const [result] = await connection.execute(query, [`%${username}%`]);
    connection.release();
    return result[0];
  } catch (error) {
    console.error("Error finding Message by Username:", error);
    throw error;
  }
}

async function deleteMessage(messageId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM messages WHERE id = ?`;
    const [result] = await connection.execute(query, [messageId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Message Not Found or Already Deleted");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting Message:", error);
    throw error;
  }
}

module.exports = {
  saveMessages,
  findAllMessages,
  findMessageById,
  findMessageByUsername,
  deleteMessage,
};
