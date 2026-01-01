const crypto = require('crypto');

// Generate a random session key (48 bytes → hex string)
const generateSessionKey = () => {
    return crypto.randomBytes(48).toString("hex");
};

// Hash a session key using SHA-256
const hashSessionKey = (key) => {
    return crypto.createHash("sha256").update(key).digest("hex");
};

module.exports = { generateSessionKey, hashSessionKey };
