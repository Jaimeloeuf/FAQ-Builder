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

    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
