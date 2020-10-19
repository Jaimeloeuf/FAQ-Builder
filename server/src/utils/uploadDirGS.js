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

/**
 * @todo Convert to use fs' promise API
 *
 * @param {String} directoryPath Name of a bucket, e.g. my-bucket
 * @param {String} bucketName Local directory to upload, e.g. ./local/path/to/directory'
 */
module.exports = async function main(directoryPath, bucketName) {
  const storage = require("./cloudStorage");
  const fs = require("fs");
  const path = require("path");
  const fileList = [];

  async function uploadDirectory() {
    // get the list of files from the specified directory
    let dirCtr = 1;
    let itemCtr = 0;
    const pathDirName = path.dirname(directoryPath);

    getFiles(directoryPath);

    function getFiles(directory) {
      fs.readdir(directory, (err, items) => {
        if (err) throw new Error(err);

        dirCtr--;
        itemCtr += items.length;
        items.forEach((item) => {
          const fullPath = path.join(directory, item);
          fs.stat(fullPath, (err, stat) => {
            if (err) throw new Error(err);

            itemCtr--;
            if (stat.isFile()) {
              fileList.push(fullPath);
            } else if (stat.isDirectory()) {
              dirCtr++;
              getFiles(fullPath);
            }
            if (dirCtr === 0 && itemCtr === 0) {
              onComplete();
            }
          });
        });
      });
    }

    async function onComplete() {
      const resp = await Promise.all(
        fileList.map((filePath) => {
          let destination = path.relative(pathDirName, filePath);
          // If running on Windows
          if (process.platform === "win32") {
            destination = destination.replace(/\\/g, "/");
          }
          // @todo fix the file path so it is all stored flat in root of bucket
          console.log("destination", filePath, destination);
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
      console.log(
        `${successfulUploads} files uploaded to ${bucketName} successfully.`
      );
    }
  }

  return uploadDirectory();
};
