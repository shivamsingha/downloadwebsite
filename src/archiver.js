const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

/**
 * This function implements the archival 
 * @param {string} url 
 * @param {*} res 
 */
module.exports = (url, res) => {
  var output = fs.createWriteStream(`./download/zips/${url}.zip`);
  var archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
    res.sendFile(path.resolve(`download/zips/${url}.zip`));
  });

  output.on("end", function () {
    console.log("Data has been drained");
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.log(err);
    } else {
      console.log(err);
    }
  });
  archive.on("error", function (err) {
    console.log(err);
    res.status(500);
  });

  archive.pipe(output);

  archive.directory(`./download/sites/${url}`, false);
  archive.finalize();
};
