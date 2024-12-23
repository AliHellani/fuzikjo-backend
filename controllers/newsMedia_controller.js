const newsMediaRepository = require("../repositories/newsMedia_repository");
const fs = require("fs");

async function createNewsMedia(req, res) {
  try {
    const { news_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Media file is required!" });
    }
    const mimeType = req.file.mimetype;
    const media_type = mimeType.startsWith("image/") ? "image" : "video";

    const media_url = `uploads/newsMedia/${req.file.filename}`;

    const result = await newsMediaRepository.saveNewsMedia({
      news_id,
      media_type,
      media_url,
    });
    return res.status(201).json({
      message: "News Media created successfully",
      newsMediaId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create News Media",
      details: error.message,
    });
  }
}

async function getAllNewsMedia(req, res) {
  try {
    const newsMedia = await newsMediaRepository.findAllNewsMedia();
    return res.status(200).json(newsMedia);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve News Media",
      details: error.message,
    });
  }
}

async function getNewsMediaById(req, res) {
  try {
    const { id } = req.params;

    const newsMedia = await newsMediaRepository.findNewsMediaById(id);
    if (!newsMedia) {
      return res.status(404).json({ error: "News Media not found" });
    }
    return res.status(200).json(newsMedia);
  } catch (error) {
    return res.status(404).json({
      error: "News Media not found",
      details: error.message,
    });
  }
}

async function updateNewsMedia(req, res) {
  const { id } = req.params;
  const { news_id, media_type } = req.body;
  try {
    const existingNewsMedia = await newsMediaRepository.findNewsMediaById(id);

    if (!existingNewsMedia) {
      return res.status(404).json({ error: "News Media not found!" });
    }

    const updatedData = {
      id,
      news_id: news_id !== undefined ? news_id : existingNewsMedia.news_id,
      media_type:
        media_type !== undefined ? media_type : existingNewsMedia.media_type,
      media_url: existingNewsMedia.media_url,
    };

    if (req.file) {
      // Delete old file if a new one is uploaded
      if (fs.existsSync(existingNewsMedia.media_url)) {
        fs.unlinkSync(existingNewsMedia.media_url);
      }

      updatedData.media_url = `uploads/newsMedia/${req.file.filename}`;
      updatedData.media_type = req.file.mimetype.startsWith("image/")
        ? "image"
        : "video";
    }

    const result = await newsMediaRepository.updateNewsMedia(updatedData);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    return res.status(200).json({ message: "News Media updated successfully" });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to update News Media",
      details: error.message,
    });
  }
}

async function deleteNewsMedia(req, res) {
  const { id } = req.params;
  try {
    const existingNewsMedia = await newsMediaRepository.findNewsMediaById(id);

    if (!existingNewsMedia) {
      return res.status(404).json({ error: "News Media not found!" });
    }

    if (fs.existsSync(existingNewsMedia.media_url)) {
      fs.unlinkSync(existingNewsMedia.media_url);
    }

    await newsMediaRepository.deleteNewsMedia(id);

    return res.status(200).json({
      message: "News Media deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete News Media",
      details: error.message,
    });
  }
}

module.exports = {
  createNewsMedia,
  getAllNewsMedia,
  getNewsMediaById,
  updateNewsMedia,
  deleteNewsMedia,
};
