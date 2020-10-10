/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

// Mount all the routes onto their respective base routes
router.use("/", require("./default"));
router.use("/generate", require("./generate"));

module.exports = router;
