// Simple module to use noops in production env
module.exports = process.env.verbose === "true" ? console.log : () => {};
