const projectMediaRepository = require("../repositories/projectMedia_repository");
const fs = require("fs");

async function createProjectMedia(req, res) {
  try {
    const { project_id } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Media file is required!" });
    }
    const mimeType = req.file.mimetype;
    const media_type = mimeType.startsWith("image/") ? "image" : "video";

    const media_url = `uploads/projectMedia/${req.file.filename}`;

    const result = await projectMediaRepository.createProjectMedia({
      project_id,
      media_type,
      media_url,
    });
    return res.status(201).json({
      message: "Project Media created successfully",
      projectMediaId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create project Media",
      details: error.message,
    });
  }
}

async function getAllProjectMedia(req, res) {
  try {
    const projectMedia = await projectMediaRepository.findAllProjectMedia();
    return res.status(200).json(projectMedia);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve Project Media",
      details: error.message,
    });
  }
}

async function getProjectMediaById(req, res) {
  try {
    const { id } = req.params;

    const projectMedia = await projectMediaRepository.findProjectMediaById(id);
    if (!projectMedia) {
      return res.status(404).json({ error: "Project Media not found" });
    }
    return res.status(200).json(projectMedia);
  } catch (error) {
    return res.status(404).json({
      error: "Project Media not found",
      details: error.message,
    });
  }
}

async function updateProjectMedia(req, res) {
  const { id } = req.params;
  const { project_id, media_type } = req.body;
  try {
    const existingProjectMedia =
      await projectMediaRepository.findProjectMediaById(id);

    if (!existingProjectMedia) {
      return res.status(404).json({ error: "Project Media not found!" });
    }

    const updatedData = {
      id,
      project_id:
        project_id !== undefined ? project_id : existingProjectMedia.project_id,
      media_type:
        media_type !== undefined ? media_type : existingProjectMedia.media_type,
      media_url: existingProjectMedia.media_url,
    };

    if (req.file) {
      // Delete old file if a new one is uploaded
      if (fs.existsSync(existingProjectMedia.media_url)) {
        fs.unlinkSync(existingProjectMedia.media_url);
      }

      updatedData.media_url = `uploads/projectMedia/${req.file.filename}`;
      updatedData.media_type = req.file.mimetype.startsWith("image/")
        ? "image"
        : "video";
    }

    const result = await projectMediaRepository.updateProjectMedia(updatedData);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    return res
      .status(200)
      .json({ message: "Project Media updated successfully" });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to update Project Media",
      details: error.message,
    });
  }
}

async function deleteProjectMedia(req, res) {
  const { id } = req.params;
  try {
    const existingProjectMedia =
      await projectMediaRepository.findProjectMediaById(id);

    if (!existingProjectMedia) {
      return res.status(404).json({ error: "Project Media not found!" });
    }

    if (fs.existsSync(existingProjectMedia.media_url)) {
      fs.unlinkSync(existingProjectMedia.media_url);
    }

    await projectMediaRepository.deleteProjectMedia(id);

    return res.status(200).json({
      message: "Project Media deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Project Media",
      details: error.message,
    });
  }
}

module.exports = {
  createProjectMedia,
  getAllProjectMedia,
  getProjectMediaById,
  updateProjectMedia,
  deleteProjectMedia,
};
