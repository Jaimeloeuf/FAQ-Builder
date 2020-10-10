/**
 * Module wrapper around firebase cloud storage
 * @author JJ
 * @module DB singleton
 */

// Same bucket for all users? Or seperate bucket for different users?
// module.exports = require("./firebaseAdmin")({
//   storageBucket: "<BUCKET_NAME>.appspot.com",
// })
//   .storage()
//   .bucket();

// Use diff buckets, as the upload is by per file
module.exports = require("./firebaseAdmin")({
  storageBucket: "<BUCKET_NAME>.appspot.com",
}).storage();
