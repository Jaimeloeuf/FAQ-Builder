var admin = require("firebase-admin");

var serviceAccount = require("./class-express-faq-test-dfbe99b8ad93.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://class-express-faq-test.appspot.com",
});

var bucket = admin.storage().bucket();

// 'bucket' is an object defined in the @google-cloud/storage library.
// See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
// for more details.

async function downloadFile(bucket, srcFilename, destFilename) {
  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };

  // Downloads the file
  await bucket.file(srcFilename).download(options);

  console.log(`gs://${srcFilename} downloaded to ${destFilename}.`);
}

downloadFile(bucket, "test/test.json", "./test.json").catch(console.error);
