const fs = require("fs");

module.exports = function (path) {
  // @todo Use fs promises API instead
  if (!fs.existsSync(path))
    fs.mkdirSync(path, { recursive: true }, (err) => {
      if (err) throw err;
    });
};
