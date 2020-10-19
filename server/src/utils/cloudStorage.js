/**
 * Module wrapper around the google cloud storage lib with credentials and projectID passed in
 * @author JJ
 * @module DB singleton
 */

const { Storage } = require("@google-cloud/storage");
module.exports = new Storage({
  keyFilename: "./serviceAccountKey.json",
  projectId: "class-express-faq-test",
});
