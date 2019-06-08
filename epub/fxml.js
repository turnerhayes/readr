const path = require("path");
const { promisify } = require("util");
const readFile = promisify(require("fs").readFile);
const parser = require("fast-xml-parser");

const filename = path.join(__dirname, "Free_Stories_2019", "content.opf");

(async () => {
  const file = await readFile(filename, { encoding: "utf8" });

  const parsed = parser.parse(file, {
    parseAttributeValue: true,
    attrNodeName: "@@attrs@@",
    attributeNamePrefix: "",
    ignoreAttributes: false,
  });

  console.log(
    require("util").inspect(
      parsed,
      {
        depth: null,
      }
    )
  );
  
})().catch(
  (ex) => {
    console.error(ex);

    process.exit(1);
  }
);
