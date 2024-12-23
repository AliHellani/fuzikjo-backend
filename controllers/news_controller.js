const newsRepository = require("../repositories/news_repository");
const validator = require("validator");

async function createNews(req, res) {
  try {
    const { title_ar, title_en, content_ar, content_en, author_id } = req.body;

    if (
      !title_ar ||
      !title_en ||
      !content_ar ||
      !content_en ||
      !author_id ||
      !validator.isNumeric(author_id.toString())
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const newsData = await newsRepository.saveNews({
      title_ar,
      title_en,
      content_ar,
      content_en,
      author_id,
    });
    res.status(201).json({
      message: "News created successfully",
      newsId: newsData.insertId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create News", details: error.message });
  }
}

async function getAllNews(req, res) {
  try {
    const news = await newsRepository.findAllNews();
    const language = req.language;
    const filteredNews = news.map((newest) => {
      if (language === "ar") {
        return {
          id: newest.id,
          title_ar: newest.title_ar,
          content_ar: newest.content_ar,
          author_id: newest.author_id,
        };
      } else {
        return {
          id: newest.id,
          title_en: newest.title_en,
          content_en: newest.content_en,
          author_id: newest.author_id,
        };
      }
    });
    res.status(200).json(filteredNews);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve News", details: error.message });
  }
}

async function getNewsById(req, res) {
  try {
    const { id } = req.params;
    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid news ID" });
    }
    const news = await newsRepository.findNewsById(id);

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    const language = req.language;

    const responseNews = {
      id: news.id,
      author_id: news.author_id,
    };

    if (language === "ar") {
      responseNews.title_ar = news.title_ar;
      responseNews.content_ar = news.content_ar;
    } else {
      responseNews.title_en = news.title_en;
      responseNews.content_en = news.content_en;
    }

    res.status(200).json(responseNews);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve News By ID", details: error.message });
  }
}

async function getNewsByTitle(req, res) {
  try {
    const { title } = req.params;
    const language = req.language;

    if (!title) {
      return res.status(400).json({ message: "News title Not Found" });
    }

    const news = await newsRepository.findNewsByTitle(title, language);

    const responseNews = {
      id: news.id,
      author_id: news.author_id,
    };

    if (language === "ar") {
      responseNews.title_ar = news.title_ar;
      responseNews.content_ar = news.content_ar;
    } else {
      responseNews.title_en = news.title_en;
      responseNews.content_en = news.content_en;
    }
    res.status(200).json(responseNews);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve News By Title",
      details: error.message,
    });
  }
}

async function updateNews(req, res) {
  const { id } = req.params;
  const { title_ar, title_en, content_ar, content_en, author_id } = req.body;
  try {
    const existingNews = await newsRepository.findNewsById(id);

    if (!existingNews) {
      return res.status(404).json({ message: "News Not Found" });
    }

    const updateData = {
      id,
      title_ar: title_ar || existingNews.title_ar,
      title_en: title_en || existingNews.title_en,
      content_ar: content_ar || existingNews.content_ar,
      content_en: content_en || existingNews.content_en,
      author_id: author_id || existingNews.author_id,
    };

    await newsRepository.updateNews(updateData);
    return res.status(200).json({
      message: "News updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update News", details: error.message });
  }
}

async function deleteNews(req, res) {
  const { id } = req.params;
  try {
    const news = await newsRepository.findNewsById(id);

    if (!news) {
      return res.status(404).json({ error: "News not found!" });
    }

    await newsRepository.deleteNews(id);
    return res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete News",
      details: error.message,
    });
  }
}

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  getNewsByTitle,
  updateNews,
  deleteNews,
};
