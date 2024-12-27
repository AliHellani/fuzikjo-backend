const infoRepository = require("../repositories/info_repository");
const validator = require("validator");

async function createInfo(req, res) {
  try {
    const { phone_number, email, address_ar, address_en, maps_link } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate maps link
    if (
      maps_link &&
      (!validator.isURL(maps_link) || !maps_link.includes("google.com/maps"))
    ) {
      return res.status(400).json({ message: "Invalid Google Maps link" });
    }

    if (!address_ar || !address_en) {
      return res.status(400).json({ message: "Address fields are required" });
    }

    const infoData = await infoRepository.saveInfo({
      phone_number,
      email,
      address_ar,
      address_en,
      maps_link,
    });

    res.status(201).json({
      message: "Info created successfully",
      infoId: infoData.insertId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create Info", details: error.message });
  }
}

async function getAllInfo(req, res) {
  try {
    const infos = await infoRepository.findAllInfo();
    const language = req.language;

    const filteredInfo = infos.map((info) => {
      if (language === "ar") {
        return {
          id: info.id,
          phone_number: info.phone_number,
          email: info.email,
          address_ar: info.address_ar,
          maps_link: info.maps_link,
        };
      } else {
        return {
          id: info.id,
          phone_number: info.phone_number,
          email: info.email,
          address_en: info.address_en,
          maps_link: info.maps_link,
        };
      }
    });
    res.status(200).json(filteredInfo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve Info", details: error.message });
  }
}

async function getInfoById(req, res) {
  try {
    const { id } = req.params;
    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid Info ID" });
    }
    const info = await infoRepository.findInfoById(id);
    const language = req.language;

    const responseInfo = {
      id: info.id,
      phone_number: info.phone_number,
      email: info.email,
      maps_link: info.maps_link,
    };
    if (language === "ar") {
      responseInfo.address_ar = info.address_ar;
    } else {
      responseInfo.address_en = info.address_en;
    }
    res.status(200).json(responseInfo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve Info By ID", details: error.message });
  }
}

async function updateInfo(req, res) {
  try {
    const { id } = req.params;
    const { phone_number, email, address_ar, address_en, maps_link } = req.body;

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate maps link if provided
    if (
      maps_link &&
      (!validator.isURL(maps_link) || !maps_link.includes("google.com/maps"))
    ) {
      return res.status(400).json({ message: "Invalid Google Maps link" });
    }

    const existingInfo = await infoRepository.findInfoById(id);

    if (!existingInfo) {
      return res.status(404).json({ message: "Info Not Found" });
    }

    const updatedData = {
      id,
      phone_number: phone_number ?? existingInfo.phone_number,
      email: email ?? existingInfo.email,
      address_ar: address_ar ?? existingInfo.address_ar,
      address_en: address_en ?? existingInfo.address_en,
      maps_link: maps_link ?? existingInfo.maps_link,
    };

    await infoRepository.updateInfo(updatedData);

    res.status(200).json({ message: "Info Updated Successfully" });
  } catch (error) {
    console.error("Error in updateInfo:", error);
    res
      .status(500)
      .json({ error: "Failed to update Info", details: error.message });
  }
}

async function deleteInfo(req, res) {
  try {
    const { id } = req.params;
    const info = await infoRepository.findInfoById(id);

    if (!info) {
      return res.status(404).json({ error: "Info not found!" });
    }
    await infoRepository.deleteInfo(id);
    return res.status(200).json({ message: "Info deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Info",
      details: error.message,
    });
  }
}

module.exports = {
  createInfo,
  getAllInfo,
  getInfoById,
  updateInfo,
  deleteInfo,
};
