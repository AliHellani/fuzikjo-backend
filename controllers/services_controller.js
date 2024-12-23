const serviceRepository = require("../repositories/services_repository");
const fs = require("fs");
const path = require("path");

async function createService(req, res) {
  try {
    const { name_ar, name_en, description_ar, description_en } = req.body;
    const image_url = req.file ? `uploads/services/${req.file.filename}` : null;

    if (
      !name_ar ||
      !name_en ||
      !description_ar ||
      !description_en ||
      !image_url
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const serviceData = {
      name_ar: name_ar,
      name_en: name_en,
      description_ar: description_ar,
      description_en: description_en,
      image_url: image_url,
    };

    const result = await serviceRepository.saveService(serviceData);

    res.status(201).json({
      message: "Service created successfully",
      resultId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Failed to create service" });
  }
}

async function getAllServices(req, res) {
  try {
    const services = await serviceRepository.findAllServices();
    const language = req.language;

    const responseServices = services.map((service) => {
      if (language === "ar") {
        return {
          id: service.id,
          name: service.name_ar,
          description: service.description_ar,
          image_url: service.image_url,
        };
      } else {
        return {
          id: service.id,
          name: service.name_en,
          description: service.description_en,
          image_url: service.image_url,
        };
      }
    });
    res.status(200).json(responseServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
}

async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const services = await serviceRepository.findServiceById(id);
    if (!services) {
      return res.status(404).json({ error: "Service not found" });
    }

    const language = req.language;

    const responseService = services.map((service) => {
      if (language === "ar") {
        return {
          id: service.id,
          name: service.name_ar,
          description: service.description_ar,
          image_url: service.image_url,
        };
      } else {
        return {
          id: service.id,
          name: service.name_en,
          description: service.description_en,
          image_url: service.image_url,
        };
      }
    });

    res.status(200).json(responseService);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Failed to fetch service" });
  }
}

async function getServiceByName(req, res) {
  try {
    const { name } = req.params;
    const services = await serviceRepository.findServiceByName(name);
    const language = req.language;

    const responseServices = services.map((service) => {
      if (language === "ar") {
        return {
          id: service.id,
          name: service.name_ar,
          description: service.description_ar,
          image_url: service.image_url,
        };
      } else {
        return {
          id: service.id,
          name: service.name_en,
          description: service.description_en,
          image_url: service.image_url,
        };
      }
    });
    res.status(200).json(responseServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
}

async function updateServices(req, res) {
  const { id } = req.params;
  const { name_ar, name_en, description_ar, description_en } = req.body;
  const image_url = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    const allowedFields = [
      "name_ar",
      "name_en",
      "description_ar",
      "description_en",
    ];

    const invalidFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: "Invalid fields in request body",
        invalidFields,
      });
    }

    const existingServices = await serviceRepository.findServiceById(id);

    if (!existingServices || existingServices.length === 0) {
      return res.status(404).json({ message: "Service Not Found" });
    }

    const service = existingServices[0];

    if (image_url && image_url !== service.image_url) {
      const oldImagePath = path.join(__dirname, "..", service.image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const dataService = {
      id,
      name_ar: name_ar !== undefined ? name_ar : service.name_ar,
      name_en: name_en !== undefined ? name_en : service.name_en,
      description_ar:
        description_ar !== undefined ? description_ar : service.description_ar,
      description_en:
        description_en !== undefined ? description_en : service.description_en,
      image_url: image_url !== null ? image_url : service.image_url,
    };

    await serviceRepository.updateService(dataService);

    return res.status(200).json({
      message: "Service updated successfully",
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res
      .status(500)
      .json({ error: "Failed to update Service", details: error.message });
  }
}

async function deleteService(req, res) {
  const { id } = req.params;
  try {
    const services = await serviceRepository.findServiceById(id);

    if (!services) {
      return res.status(404).json({ error: "Service not found!" });
    }

    const service = services[0];
    const imageUrlPath = path.join(__dirname, "..", service.image_url);
    if (fs.existsSync(imageUrlPath)) {
      fs.unlinkSync(imageUrlPath);
    }

    const result = await serviceRepository.deleteService(id);

    return res.status(200).json({
      message: "Service deleted successfully",
      deletedRows: result.deletedRows,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Service",
      details: error.message,
    });
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  getServiceByName,
  updateServices,
  deleteService,
};
