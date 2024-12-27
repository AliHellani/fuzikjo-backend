const employeeRepository = require("../repositories/employees_repository");
const path = require("path");
const fs = require("fs");

async function createEmployee(req, res) {
  try {
    const { name_ar, name_en, job_title_ar, job_title_en, bio_ar, bio_en } =
      req.body;
    const profile_image_url = req.file
      ? `uploads/employees/${req.file.filename}`
      : undefined;

    const employeeData = {
      name_ar: name_ar,
      name_en: name_en,
      job_title_ar: job_title_ar,
      job_title_en: job_title_en,
      profile_image_url: profile_image_url,
      bio_ar: bio_ar,
      bio_en: bio_en,
    };
    const result = await employeeRepository.saveEmployees(employeeData);

    res.status(201).json({
      message: "Employee created successfully",
      resultId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
}

async function getALlEmployee(req, res) {
  try {
    const employees = await employeeRepository.findAllEmployee();
    const language = req.language;
    const filteredEmployee = employees.map((employee) => ({
      id: employee.id,
      name: language === "ar" ? employee.name_ar : employee.name_en,
      job_title:
        language === "ar" ? employee.job_title_ar : employee.job_title_en,
      profile_image_url: employee.profile_image_url,
      bio: language === "ar" ? employee.bio_ar : employee.bio_en,
    }));
    res.status(200).json(filteredEmployee);
  } catch (error) {
    console.error("Error fetching Employees:", error);
    res.status(500).json({ error: "Failed to fetch Employees" });
  }
}

async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const employee = await employeeRepository.findEmployeeById(id);
    const language = req.language;

    const responseEmployee = {
      id: employee.id,
      name: language === "ar" ? employee.name_ar : employee.name_en,
      job_title:
        language === "ar" ? employee.job_title_ar : employee.job_title_en,
      profile_image_url: employee.profile_image_url,
      bio: language === "ar" ? employee.bio_ar : employee.bio_en,
    };
    res.status(200).json(responseEmployee);
  } catch (error) {
    console.error("Error fetching Employee By ID:", error);
    res.status(500).json({ error: "Failed to fetch Employee By ID" });
  }
}

async function getEmployeeByName(req, res) {
  try {
    const { name } = req.params;
    const employees = await employeeRepository.findEmployeeByName(name);
    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: "Name not found" });
    }

    const language = req.language;
    const filteredEmployee = employees.map((employee) => ({
      id: employee.id,
      name: language === "ar" ? employee.name_ar : employee.name_en,
      job_title:
        language === "ar" ? employee.job_title_ar : employee.job_title_en,
      profile_image_url: employee.profile_image_url,
      bio: language === "ar" ? employee.bio_ar : employee.bio_en,
    }));
    res.status(200).json(filteredEmployee);
  } catch (error) {
    console.error("Error fetching Employee By Name:", error);
    res.status(500).json({ error: "Failed to fetch Employee By Name" });
  }
}

async function getEmployeeByJobTitle(req, res) {
  try {
    const { job_title } = req.params;
    const employees = await employeeRepository.findEmployeeByJobTitle(
      job_title
    );
    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: "Job Title not found" });
    }

    const language = req.language;
    const filteredEmployee = employees.map((employee) => ({
      id: employee.id,
      name: language === "ar" ? employee.name_ar : employee.name_en,
      job_title:
        language === "ar" ? employee.job_title_ar : employee.job_title_en,
      profile_image_url: employee.profile_image_url,
      bio: language === "ar" ? employee.bio_ar : employee.bio_en,
    }));
    res.status(200).json(filteredEmployee);
  } catch (error) {
    console.error("Error fetching Employee By Job Title:", error);
    res.status(500).json({ error: "Failed to fetch Employee By Job Title" });
  }
}

async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const { name_ar, name_en, job_title_ar, job_title_en, bio_ar, bio_en } =
      req.body;
    const profile_image_url = req.file
      ? `uploads/employees/${req.file.filename}`
      : undefined;

    const existingEmployee = await employeeRepository.findEmployeeById(id);
    if (!existingEmployee || existingEmployee.length === 0) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    const employee = existingEmployee;

    if (profile_image_url && profile_image_url !== employee.profile_image_url) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        employee.profile_image_url
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    const employeeData = {
      id,
      name_ar: name_ar !== undefined ? name_ar : employee.name_ar,
      name_en: name_en !== undefined ? name_en : employee.name_en,
      job_title_ar:
        job_title_ar !== undefined ? job_title_ar : employee.job_title_ar,
      job_title_en:
        job_title_en !== undefined ? job_title_en : employee.job_title_en,
      profile_image_url:
        profile_image_url !== undefined
          ? profile_image_url
          : employee.profile_image_url,
      bio_ar: bio_ar !== undefined ? bio_ar : employee.bio_ar,
      bio_en: bio_en !== undefined ? bio_en : employee.bio_en,
    };
    await employeeRepository.updateEmployee(employeeData);
    return res.status(200).json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Error updating Employee:", error);
    return res
      .status(500)
      .json({ error: "Failed to update Employee", details: error.message });
  }
}

async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const employees = await employeeRepository.findEmployeeById(id);
    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: "Link not found!" });
    }

    const employee = employees;
    if (employee.profile_image_url) {
      const imageUrlPath = path.join(
        __dirname,
        "..",
        employee.profile_image_url
      );
      if (fs.existsSync(imageUrlPath)) {
        fs.unlinkSync(imageUrlPath);
      }
    }
    const result = await employeeRepository.deleteEmployee(id);
    return res.status(200).json({
      message: "Employee deleted successfully",
      deletedRows: result.deletedRows,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Employee",
      details: error.message,
    });
  }
}

module.exports = {
  createEmployee,
  getALlEmployee,
  getEmployeeById,
  getEmployeeByName,
  getEmployeeByJobTitle,
  updateEmployee,
  deleteEmployee,
};
