const projectRepository = require("../repositories/projects_repository");

async function createProject(req, res) {
  try {
    const { title_ar, title_en, description_ar, description_en } = req.body;
    const projectData = await projectRepository.saveProject({
      title_ar,
      title_en,
      description_ar,
      description_en,
    });
    res.status(201).json({
      message: "Project created successfully",
      ProjectId: projectData.insertId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create Project", details: error.message });
  }
}

async function getAllProject(req, res) {
  try {
    const projects = await projectRepository.findAllProject();
    const language = req.language;
    const filteredProject = projects.map((project) => ({
      id: project.id,
      title: language === "ar" ? project.title_ar : project.title_en,
      description:
        language === "ar" ? project.description_ar : project.description_en,
      createdAt: project.formatted_date,
    }));
    res.status(200).json({
      message: "Projects retrieved successfully",
      ProjectData: filteredProject,
    });
  } catch (error) {
    console.error("Error retrieving Project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const projects = await projectRepository.findProjectById(id);
    if (!projects) {
      return res.status(404).json({ message: "Project not found" });
    }

    const language = req.language;
    const responseProject = {
      id: projects.id,
      title: language === "ar" ? projects.title_ar : projects.title_en,
      description:
        language === "ar" ? projects.description_ar : projects.description_en,
      createdAt: projects.formatted_date,
    };
    res.status(200).json({
      message: "Project retrieved By ID successfully",
      ProjectData: responseProject,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve Project By ID",
      details: error.message,
    });
  }
}

async function getProjectByTitle(req, res) {
  try {
    const { title } = req.params;
    const projects = await projectRepository.findProjectByTitle(title);
    if (!projects) {
      return res.status(404).json({ message: "Project not found" });
    }
    const language = req.language;
    const responseProject = projects.map((project) => ({
      id: project.id,
      title: language === "ar" ? project.title_ar : project.title_en,
      description:
        language === "ar" ? project.description_ar : project.description_en,
      createdAt: project.formatted_date,
    }));
    res.status(200).json({
      message: "Project retrieved By Title successfully",
      ProjectData: responseProject,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve Project By Title",
      details: error.message,
    });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title_ar, title_en, description_ar, description_en } = req.body;
    const existingProject = await projectRepository.findProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    const updateData = {
      id,
      title_ar: title_ar || existingProject.title_ar,
      title_en: title_en || existingProject.title_en,
      description_ar: description_ar || existingProject.description_ar,
      description_en: description_en || existingProject.description_en,
    };
    const result = await projectRepository.updateProject(updateData);

    return res.status(200).json({
      message: "Project updated successfully",
      projectData: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update Project", details: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const projects = await projectRepository.findProjectById(id);
    if (!projects) {
      return res.status(404).json({ message: "Project not found" });
    }
    await projectRepository.deleteProject(id);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Project",
      details: error.message,
    });
  }
}

module.exports = {
  createProject,
  getAllProject,
  getProjectById,
  getProjectByTitle,
  updateProject,
  deleteProject,
};
