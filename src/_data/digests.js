const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../../data/digests");

module.exports = function () {
  const files = fs
    .readdirSync(dataDir)
    .filter(file => file.endsWith(".json"))
    .sort()
    .reverse();

  return files.map(file => {
    const filePath = path.join(dataDir, file);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  });
};
