const pool = require("../config/db");

async function saveProject(projectData) {
  try {
    const { title_ar, title_en, description_ar, description_en } = projectData;
    const connection = await pool.getConnection();
    const query = `
        INSERT INTO projects(title_ar, title_en, description_ar, description_en, created_at)
        VALUES(?, ?, ?, ?, NOW())`;

    const [result] = await connection.execute(query, [
      title_ar,
      title_en,
      description_ar,
      description_en,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Project:", error);
    throw error;
  }
}

async function findAllProject() {
  try {
    const connection = await pool.getConnection();
    const query = `
    SELECT projects.id, projects.title_ar, projects.title_en, projects.description_ar, projects.description_en,
           DATE_FORMAT(projects.created_at, '%d-%m-%Y') AS formatted_date
    FROM projects 
    ORDER BY created_at DESC`;
    const [result] = await connection.execute(query);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error finding Projects:", error);
    throw error;
  }
}

async function findProjectById(projectId) {
  try {
    const connection = await pool.getConnection();
    const query = `
        SELECT projects.id, projects.title_ar, projects.title_en, projects.description_ar, projects.description_en,
               DATE_FORMAT(projects.created_at, '%d-%m-%Y') AS formatted_date
        FROM projects 
        WHERE projects.id = ?
      `;
    const [result] = await connection.execute(query, [projectId]);
    if (result.length === 0) {
      throw new Error("Project Not Found!");
    }
    connection.release();
    return result[0];
  } catch (error) {
    console.error("Error finding Project By ID:", error);
    throw error;
  }
}

async function findProjectByTitle(projectTitle) {
  try {
    const connection = await pool.getConnection();
    const query = `
        SELECT projects.id, projects.title_ar, projects.title_en, projects.description_ar, projects.description_en,
               DATE_FORMAT(projects.created_at, '%d-%m-%Y') AS formatted_date
        FROM projects 
        WHERE projects.title_ar LIKE ? OR projects.title_en LIKE ?
        ORDER BY created_at DESC
        `;
    const [result] = await connection.execute(query, [
      `%${projectTitle}%`,
      `%${projectTitle}%`,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error finding Project by Title:", error);
    throw error;
  }
}

async function updateProject(projectData) {
  const { id, title_ar, title_en, description_ar, description_en } =
    projectData;
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE projects 
                          SET title_ar = ?, title_en = ?, description_ar = ?, description_en = ?
                          WHERE id = ?`;
    const [result] = await connection.execute(query, [
      title_ar,
      title_en,
      description_ar,
      description_en,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Project Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Project:", error);
    throw error;
  }
}

async function deleteProject(projectId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM projects WHERE id = ?`;
    const [result] = await connection.execute(query, [projectId]);
    connection.release();
    if (result.affectedRows === 0) {
      return { success: false, message: "Project Not Found" };
    }
    return result;
  } catch (error) {
    console.error("Error deleting Project:", error);
    throw error;
  }
}

module.exports = {
  saveProject,
  findAllProject,
  findProjectById,
  findProjectByTitle,
  updateProject,
  deleteProject,
};
