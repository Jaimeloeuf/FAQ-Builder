/**
 * Module wrapper around the google cloud storage lib with credentials and projectID passed in
 * @author JJ
 * @module DB singleton
 */

const { Storage } = require("@google-cloud/storage");
module.exports = new Storage({
  // The file path is relative to where you execute this process, and not relative to __dirname!
  keyFilename: "./serviceAccountKey.json",
  projectId: "class-express-faq-test",
});
