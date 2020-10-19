const verboseLog = require("./verboseLog");
const storage = require("./cloudStorage");

/**
 * Use getMetadata method to determine if bucket exists
 * @param {String} bucketName
 * @return {Boolean} Returns bool indicating if bucket exists
 */
async function bucketExists(bucketName) {
  if (!bucketName) throw new Error("Missing bucket name");

  // Get bucket metadata.
  const [metadata] = await storage.bucket(bucketName).getMetadata();

  // End if no metadata
  if (!metadata) return false;

  for (const [key, value] of Object.entries(metadata))
    verboseLog(`${key}: ${value}`);
  return true;
}

module.exports = async function createBucket(bucketName) {
  // If bucket already exists, then just ignore request
  // @todo Should we clear the bucket? Not v efficient but will at least remove the unused files
  if (await bucketExists(bucketName))
    return verboseLog(`Bucket ${bucketName} exists.`);

  // Creates the new bucket
  await storage.createBucket(bucketName);

  // Make the bucket publicly readable.
  storage.bucket(bucketName).makePublic(function (err) {
    if (err) throw new Error(err);
  });

  verboseLog(`Bucket ${bucketName} created.`);
};
