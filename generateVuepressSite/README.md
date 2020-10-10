# generateVuepressSite
Simple wrapper library over [vuepress](https://www.npmjs.com/package/vuepress), specifically the @vuepress/core library to build vuepress static sites programmatically.

## API
```js
const generateVuepressSite = require("generate-vuepress-site");

// Use this in an async function
await generateVuepressSite(sourceDir, dest);

// Using resolved paths.
await generateVuepressSite(path.resolve(__dirname, "/tmp/source"), path.resolve(__dirname, "/tmp/output"));
```