const path = require("path");
const { promisify } = require("util");
const readFile = promisify(require("fs").readFile);
const writeFile = promisify(require("fs").writeFile);

const parseEPUB = require("./parser");

const read = async (filePath) => {
  const file = readFile(filePath, { encoding: "binary" });

  const epub = await parseEPUB(file);

  return epub.fromFragment("/6/4[chap01ref]!/4[body01]/10[para05]/3:10");
}

const fileName = ["epub-samples", "30", "linear-algebra.epub"];
// const fileName = ["Free_Stories_2019.epub"];
// const fileName = ["pg11220.epub"];

const filePath = path.join(__dirname, ...fileName);

read(filePath).then(
  async (info) => {
    await writeFile(
      path.join(__dirname, fileName.join("--") + ".frag.json"),
      JSON.stringify(
        info,
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
