const path = require("path");
const { promisify } = require("util");
const readFile = promisify(require("fs").readFile);
const writeFile = promisify(require("fs").writeFile);

const parseEPUB = require("./parser");

const read = async (filePath) => {
  const file = readFile(filePath, { encoding: "binary" });

  return parseEPUB(file);
}

const fileName = ["epub-samples", "30", "linear-algebra.epub"];
// const fileName = ["Free_Stories_2019.epub"];
// const fileName = ["pg11220.epub"];

const filePath = path.join(__dirname, ...fileName);

read(filePath).then(
  async (info) => {
    // const files = await info.getAllFiles();

    // const serializer = new XMLSerializer();

    // for (const filePath of Object.keys(files)) {
    //   if (files[filePath].implementation && (files[filePath].implementation instanceof DOMImplementation)) {
    //     files[filePath] = serializer.serializeToString(files[filePath].documentElement);
    //   }
    // }

    await writeFile(
      path.join(__dirname, fileName.join("--") + ".json"),
      JSON.stringify(
        info,
        // {
        //   ...info,
        //   files,
        // },
        null,
        "  "
      )
    );
  }
).catch(
  (ex) => {
    console.error(ex);

    process.exit(1);
  }
);
