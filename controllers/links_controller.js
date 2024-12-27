const linkRepository = require("../repositories/links_repository");
const path = require("path");
const fs = require("fs");

async function createLink(req, res) {
  try {
    const { provider_name_ar, provider_name_en, provider_link } = req.body;
    const icon_url = req.file
      ? `uploads/links/${req.file.filename}`
      : undefined;

    const linksData = {
      provider_name_ar: provider_name_ar,
      provider_name_en: provider_name_en,
      provider_link: provider_link,
      icon_url: icon_url,
    };
    const result = await linkRepository.saveLinks(linksData);

    res.status(201).json({
      message: "Link created successfully",
      resultId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ error: "Failed to create link" });
  }
}

async function getAllLinks(req, res) {
  try {
    const links = await linkRepository.findAllLinks();
    const language = req.language;

    const filteredLinks = links.map((link) => ({
      id: link.id,
      provider_name:
        language === "ar" ? link.provider_name_ar : link.provider_name_en,
      provider_link: link.provider_link,
      icon_url: link.icon_url,
    }));
    res.status(200).json(filteredLinks);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Failed to fetch links" });
  }
}

async function getLinksById(req, res) {
  try {
    const { id } = req.params;
    const links = await linkRepository.findLinksById(id);

    const language = req.language;

    const responseLink = {
      id: links.id,
      provider_name:
        language === "ar" ? links.provider_name_ar : links.provider_name_en,
      provider_link: links.provider_link,
      icon_url: links.icon_url,
    };
    res.status(200).json(responseLink);
  } catch (error) {
    console.error("Error fetching Link:", error);
    res.status(500).json({ error: "Failed to fetch Link" });
  }
}

async function getLinkByProviderName(req, res) {
  try {
    const { provider_name } = req.params;
    const links = await linkRepository.findLinksByProviderName(provider_name);

    if (!links || links.length === 0) {
      return res.status(404).json({ error: "Provider Name not found" });
    }

    const language = req.language;

    const filteredLink = links.map((link) => ({
      id: link.id,
      provider_name:
        language === "ar" ? link.provider_name_ar : link.provider_name_en,
      provider_link: link.provider_link,
      icon_url: link.icon_url,
    }));
    res.status(200).json(filteredLink);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Failed to fetch links" });
  }
}

async function updateLink(req, res) {
  try {
    const { id } = req.params;
    const { provider_name_ar, provider_name_en, provider_link } = req.body;
    const icon_url = req.file
      ? `uploads/links/${req.file.filename}`
      : undefined;

    const existingLink = await linkRepository.findLinksById(id);

    if (!existingLink || existingLink.length === 0) {
      return res.status(404).json({ message: "Link Not Found" });
    }

    const link = existingLink;

    if (icon_url && icon_url !== link.icon_url) {
      const oldIconPath = path.join(__dirname, "..", link.icon_url);
      if (fs.existsSync(oldIconPath)) {
        fs.unlinkSync(oldIconPath);
      }
    }

    const linksData = {
      id,
      provider_name_ar:
        provider_name_ar !== undefined
          ? provider_name_ar
          : link.provider_name_ar,
      provider_name_en:
        provider_name_en !== undefined
          ? provider_name_en
          : link.provider_name_en,
      provider_link:
        provider_link !== undefined ? provider_link : link.provider_link,
      icon_url: icon_url !== undefined ? icon_url : link.icon_url,
    };

    await linkRepository.updateLinks(linksData);

    return res.status(200).json({
      message: "Link updated successfully",
    });
  } catch (error) {
    console.error("Error updating Link:", error);
    return res
      .status(500)
      .json({ error: "Failed to update Link", details: error.message });
  }
}

async function deleteLink(req, res) {
  try {
    const { id } = req.params;

    const links = await linkRepository.findLinksById(id);

    // Check if the link exists
    if (!links || links.length === 0) {
      return res.status(404).json({ error: "Link not found!" });
    }

    const link = links;
    if (link.icon_url) {
      const iconUrlPath = path.join(__dirname, "..", link.icon_url);
      if (fs.existsSync(iconUrlPath)) {
        fs.unlinkSync(iconUrlPath);
      }
    }

    const result = await linkRepository.deleteLinks(id);
    return res.status(200).json({
      message: "Link deleted successfully",
      deletedRows: result.deletedRows,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Link",
      details: error.message,
    });
  }
}

module.exports = {
  createLink,
  getAllLinks,
  getLinksById,
  getLinkByProviderName,
  updateLink,
  deleteLink,
};
