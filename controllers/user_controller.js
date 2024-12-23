const userRepository = require("../repositories/users_repository");
const authMiddleware = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const validator = require("validator");

async function registerUser(req, res) {
  try {
    const { full_name, email, hash_password, is_admin } = req.body;

    if (!full_name || !email || !hash_password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(hash_password, salt);

    console.log("Saving new user to repository...");
    const newUserData = await userRepository.saveUsers({
      full_name,
      email,
      hash_password: hashedPassword,
      is_admin: is_admin || 0,
    });

    const token = await authMiddleware.generateToken({
      id: newUserData.insertId,
      email: email,
      is_admin: is_admin || 0,
      full_name: full_name,
    });

    res.status(201).json({
      message: "User Created Successfully",
      userId: newUserData.insertId,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create User", details: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, hash_password } = req.body;

    if (!email || !hash_password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(hash_password, user.hash_password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate JWT token after successful login
    const token = authMiddleware.generateToken({
      id: user.id,
      email: user.email,
    });
    console.log("token:", token);

    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login", details: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { full_name, email, hash_password, is_admin } = req.body;

    if (!full_name || !email || !hash_password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(hash_password, salt);

    const newUserData = await userRepository.saveUsers({
      full_name,
      email,
      hash_password: hashedPassword,
      is_admin: is_admin || 0,
    });

    res.status(201).json({
      message: "User Created Successfully.",
      userId: newUserData.insertId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create User", details: error.message });
  }
}

async function getAllUser(req, res) {
  try {
    const users = await userRepository.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Users",
      details: error.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    if (!validator.isNumeric(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
    const user = await userRepository.findUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: "User Not Found", details: error.message });
  }
}

async function getUserByFullname(req, res) {
  try {
    const { full_name } = req.params;
    const user = await userRepository.findUserByFullName(full_name);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: "User Not Found", details: error.message });
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;
    const user = await userRepository.findUserByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: "User Not Found", details: error.message });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { full_name, email, hash_password, is_admin } = req.body;
  try {
    const existingUser = await userRepository.findUserById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (email && email !== existingUser.email) {
      const sameEmail = await userRepository.findUserByEmail(email);
      if (sameEmail && sameEmail.id !== id) {
        return res.status(400).json({ message: "Email is Already in use!!" });
      }
    }
    const updateData = {
      id,
      full_name: full_name || existingUser.full_name,
      email: email || existingUser.email,
      is_admin: is_admin !== undefined ? is_admin : existingUser.is_admin,
    };

    if (hash_password) {
      const salt = await bcrypt.genSalt(10);
      updateData.hash_password = await bcrypt.hash(hash_password, salt);
    } else {
      updateData.hash_password = existingUser.hash_password;
    }
    await userRepository.updateUser(updateData);
    res.status(200).json({ message: "User Updated Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update User", details: error.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const user = await userRepository.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await userRepository.deleteUser(id);
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete User",
      details: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  createUser,
  getAllUser,
  getUserById,
  getUserByFullname,
  getUserByEmail,
  updateUser,
  deleteUser,
};
