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

async function uploadFile(bucket, filename) {
  // Uploads a local file to the bucket
  await bucket.upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    destination: "test/test.json",
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: "public, max-age=31536000",
    },
  });

  console.log(`${filename} uploaded.`);
}

uploadFile(bucket, "./class-express-faq-test-dfbe99b8ad93.json").catch(
  console.error
);
