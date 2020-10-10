const path = require("path");

/**
 * Pure side effect function to generate the static site, assuming the files are all in
 * Caller should AWAIT for this to resolve to ensure build is completed successfully
 *
 * DO NOT OVERRIDE THE THEME, unless you know what you are doing
 *
 * @todo Does resolve use local path of execution? Like the node_mod path if I install this as lib? or the path of the file of execution?
 */
module.exports = (
  sourceDir = path.resolve(__dirname, "./docs"),
  dest = path.resolve("./dist"),
  theme = "@vuepress/theme-default"
) => require("vuepress").build({ theme, sourceDir, dest });
