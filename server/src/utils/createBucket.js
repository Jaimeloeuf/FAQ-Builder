module.exports = async function createBucket(bucketName) {
  const { Storage } = require("@google-cloud/storage");

  // Creates a client
  const storage = new Storage({
    keyFilename: "./serviceAccountKey.json",
    projectId: "class-express-faq-test",
  });

  // Creates the new bucket
  await storage.createBucket(bucketName);

  // Make the bucket publicly readable.
  storage.bucket(bucketName).makePublic(function (err) {
    if (err) throw new Error(err);
  });

  console.log(`Bucket ${bucketName} created.`);
};
