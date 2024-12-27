const heroMediaRepository = require("../repositories/heroMedia_repository");
const fs = require("fs");

async function createHeroMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Media file is required!" });
    }
    const mimeType = req.file.mimetype;
    const media_type = mimeType.startsWith("image/") ? "image" : "video";

    const media_url = `uploads/heroMedia/${req.file.filename}`;

    const result = await heroMediaRepository.saveHeroMedia({
      media_type,
      media_url,
    });

    return res.status(201).json({
      message: "Hero Media created successfully",
      heroMediaId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create Hero Media",
      details: error.message,
    });
  }
}

async function getAllHeroMedia(req, res) {
  try {
    const heroMedia = await heroMediaRepository.findAllHeroMedia();
    return res.status(200).json(heroMedia);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve Hero Media",
      details: error.message,
    });
  }
}

async function getHeroMediaById(req, res) {
  try {
    const { id } = req.params;

    const heroMedia = await heroMediaRepository.findHeroMediaById(id);
    if (!heroMedia) {
      return res.status(404).json({ error: "Hero Media not found" });
    }
    return res.status(200).json(heroMedia);
  } catch (error) {
    return res.status(404).json({
      error: "Hero Media not found",
      details: error.message,
    });
  }
}

async function updateHeroMedia(req, res) {
  const { id } = req.params;
  const { media_type } = req.body;
  try {
    const existingHeroMedia = await heroMediaRepository.findHeroMediaById(id);

    if (!existingHeroMedia) {
      return res.status(404).json({ error: "Hero Media not found!" });
    }

    const updatedData = {
      id,
      media_type:
        media_type !== undefined ? media_type : existingHeroMedia.media_type,
      media_url: existingHeroMedia.media_url,
    };

    if (req.file) {
      // Delete old file if a new one is uploaded
      if (fs.existsSync(existingHeroMedia.media_url)) {
        fs.unlinkSync(existingHeroMedia.media_url);
      }

      updatedData.media_url = `uploads/heroMedia/${req.file.filename}`;
      updatedData.media_type = req.file.mimetype.startsWith("image/")
        ? "image"
        : "video";
    }

    const result = await heroMediaRepository.updateHeroMedia(updatedData);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    return res.status(200).json({ message: "Hero Media updated successfully" });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to update Hero Media",
      details: error.message,
    });
  }
}

async function deleteHeroMedia(req, res) {
  const { id } = req.params;
  try {
    const existingHeroMedia = await heroMediaRepository.findHeroMediaById(id);

    if (!existingHeroMedia) {
      return res.status(404).json({ error: "Hero Media not found!" });
    }

    if (fs.existsSync(existingHeroMedia.media_url)) {
      fs.unlinkSync(existingHeroMedia.media_url);
    }

    await heroMediaRepository.deleteHeroMedia(id);

    return res.status(200).json({
      message: "Hero Media deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Hero Media",
      details: error.message,
    });
  }
}

module.exports = {
  createHeroMedia,
  getAllHeroMedia,
  getHeroMediaById,
  updateHeroMedia,
  deleteHeroMedia,
};
