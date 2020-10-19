const fs = require("fs").promises;

// Create directory recursively, if already exists, will just ignore request
module.exports = async (path) => fs.mkdir(path, { recursive: true });
