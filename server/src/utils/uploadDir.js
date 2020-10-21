/*
    WIP refactor of uploadDirGS
*/

// Modified from:
// https://github.com/googleapis/nodejs-storage/blob/master/samples/uploadDirectory.js

// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

// sample-metadata:
//   title: Upload a directory to a bucket.
//   description: Uploads full hierarchy of a local directory to a bucket.
//   usage: node files.js upload-directory <bucketName> <directoryPath>

const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const storage = require("./cloudStorage");
const verboseLog = require("./verboseLog");

function getFiles(directory, onComplete) {
  const fileList = [];
  let dirCtr = 1;
  let itemCtr = 0;

  fs.readdir(directory, (err, items) => {
    if (err) throw new Error(err);

    dirCtr--;
    itemCtr += items.length;
    items.forEach((item) => {
      const fullPath = path.join(directory, item);
      fs.stat(fullPath, (err, stat) => {
        if (err) throw new Error(err);

        itemCtr--;

        if (stat.isFile()) fileList.push(fullPath);
        else if (stat.isDirectory()) {
          dirCtr++;
          getFiles(fullPath);
        }

        if (dirCtr === 0 && itemCtr === 0) return onComplete(fileList);
      });
    });
  });
}

// OH SHIT, this wont work, because the counter is in the function itself
// and it calls itself, which will create the new values.... FKKKKKK
async function getFilesP(directory, onComplete) {
  const fileList = [];
  let dirCounter = 1;
  let itemCounter = 0;

  const items = await fsp.readdir(directory);

  --dirCounter;
  itemCounter += items.length;

  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = await fsp.stat(fullPath);

    --itemCounter;

    if (stat.isFile()) fileList.push(fullPath);
    else if (stat.isDirectory()) {
      ++dirCounter;
      getFiles(fullPath);
    }

    if (dirCounter === 0 && itemCounter === 0) return onComplete(fileList);
  }
}

// If running on Windows
const getDestination = (pathDirName, filePath) =>
  process.platform === "win32"
    ? path.relative(pathDirName, filePath).replace(/\\/g, "/")
    : path.relative(pathDirName, filePath);

/**
 * @todo Convert to use fs' promise API
 *
 * @param {String} directoryPath Name of a bucket, e.g. my-bucket
 * @param {String} bucketName Local directory to upload, e.g. ./local/path/to/directory'
 */
module.exports = async function main(directoryPath, bucketName) {
  // get the list of files from the specified directory
  const pathDirName = path.dirname(directoryPath);

  async function onComplete(fileList) {
    const resp = await Promise.all(
      fileList.map((filePath) => {
        const destination = getDestination(pathDirName, filePath);

        // @todo fix the file path so it is all stored flat in root of bucket
        verboseLog("destination", filePath, destination);
        return storage
          .bucket(bucketName)
          .upload(filePath, { destination })
          .then(
            (uploadResp) => ({
              fileName: destination,
              status: uploadResp[0],
            }),
            (err) => ({ fileName: destination, response: err })
          );
      })
    );

    const successfulUploads =
      fileList.length - resp.filter((r) => r.status instanceof Error).length;

    verboseLog(
      `Successfully uploaded ${successfulUploads} files to ${bucketName}`,
      fileList.length - successfulUploads > 0 &&
        `${fileList.length - successfulUploads} files failed`
    );
  }

  return getFiles(directoryPath, onComplete);
};
