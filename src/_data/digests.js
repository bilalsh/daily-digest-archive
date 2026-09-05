const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../../data/digests");

function findJsonFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findJsonFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith(".json")
        ? [fullPath]
        : [];
    });
}

module.exports = function () {
  const files = findJsonFiles(dataDir).sort().reverse();

  return files.map(filePath =>
    JSON.parse(fs.readFileSync(filePath, "utf8"))
  );
};