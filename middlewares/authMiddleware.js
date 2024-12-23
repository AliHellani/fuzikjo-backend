const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../secret.env" });

async function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    is_admin: user.is_admin,
    full_name: user.full_name,
  };
  const options = {
    expiresIn: "24h",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

async function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}

async function adminMiddleware(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authorization required" });
    }
    console.log("name", req.user);

    // Check if the user is an admin
    if (req.user.is_admin !== 1) {
      return res.status(403).json({
        message: `Access denied. You are not an Admin!`,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
}

module.exports = {
  generateToken,
  verifyToken,
  adminMiddleware,
};
