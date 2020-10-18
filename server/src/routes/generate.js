/**
 * Express Router for API handler to generate vuepress static site from user inputs
 * Mounted on /generate
 * @author JJ
 * @module Default routes
 */

const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const cloudStorage = require("../utils/cloudStorage");
const logger = require("@lionellbriones/logging").default("routes:generate");

const generateVuepressSite = require("generate-vuepress-site");

function generateJsonFromMarkdown(markdown) {}
function generateMarkdownFromJson(json) {
  return JSON.stringify(json);
}

/**
 * Generate vuepress site from json
 *
 * @todo Add stats tracking, so after every generation or failure, update the event system
 *
 * @name POST /generate
 * @returns {Status} 200
 */
router.post("/", express.json(), async (req, res) => {
  try {
    const { customerID } = req.query;

    // Can there be more then 1 file?
    const markdownFilePath = `/tmp/vuepress-markdown/${customerID}/README.md`;

    // @todo primarily for testing -- Change to use storage service instead of the ephemeral container storage
    await fs.writeFile(markdownFilePath, generateMarkdownFromJson(req.body), {
      flag: "w",
    });

    // start async background job to generate the site and push live when done.
    // Should we use seperate processes? Or like torus relayer split into diff rabbitmq processes

    await generateVuepressSite(
      markdownFilePath,
      `/tmp/vuepress-generated/${customerID}`
    );

    // Update stats

    // Push site live to static hosting service
    // Uploads a local file to the bucket
    // Get all the files in the output directory and upload 1 by 1?
    // @todo Nested directory?
    await Promise.all(
      (await fs.readdir(`/tmp/vuepress-generated/${customerID}`)).map(
        (filePath) =>
          /* Might wanna see waht is file Path first... */
          cloudStorage
            .bucket(`/tmp/vuepress-generated/${customerID}`)
            // @todO Might use diff slash
            // Might not wanna pop, and use the full path
            .upload(filePath.split("/").pop(), {
              // Support for HTTP requests made with `Accept-Encoding: gzip`
              gzip: true,
              // By setting the option `destination`, you can change the name of the
              // object you are uploading to a bucket.
              metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: "public, max-age=31536000",
              },
            })
      )
    );

    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
