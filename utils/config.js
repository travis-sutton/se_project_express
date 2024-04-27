// Generate a random secret key
const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Use the generated secret key or fallback to a default value
const JWT_SECRET = process.env.JWT_SECRET || generateSecretKey();

module.exports = { JWT_SECRET };
