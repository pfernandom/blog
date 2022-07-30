import sharp from "sharp";
import fs from "fs";
import path, { join } from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

type FileInfo = {
  fileName: string;
  filePath: string;
  dirPath: string;
};

const postsDirectory = join(process.cwd(), "src", "blog");

const getAllFiles = function (
  dirPath: string,
  pattern: RegExp,
  arrayOfFiles: Array<FileInfo> | undefined = []
) {
  const files = fs.readdirSync(dirPath);
  console.log({ dirPath, files });

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const regex = new RegExp(pattern);
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, regex, arrayOfFiles);
    } else {
      if (regex.test(file)) {
        console.log(file);
        const relativePath = path.relative(
          postsDirectory,
          path.join(dirPath, "/")
        );
        arrayOfFiles.push({
          fileName: file,
          filePath: [relativePath, "/", file].join(""),
          dirPath: relativePath,
        });
      } else {
        console.log(`Found "${file}": Failed to match ${regex} Not processed`);
        console.log(file.match(regex));
      }
    }
  });

  return arrayOfFiles;
};

function main(filePath: string, newFileName: string = "") {
  const dir = path.dirname(filePath);

  const regex = /(jpeg|jpg|png|gif)/gi;

  const name =
    newFileName.length === 0
      ? `_opt_${path.basename(filePath).replace(regex, "webp")}`
      : newFileName;
  console.log({ dir, name });

  const height = 200;
  const width = 400;
  const crop = "cover";

  const srcPath = path.join(process.cwd(), "src");
  const dirRelativeToSrc = path.relative(srcPath, dir);
  const saveDirPath = path.join(
    process.cwd(),
    "public",
    "opt_images",
    dirRelativeToSrc
  );

  fs.mkdirSync(saveDirPath, {
    recursive: true,
  });

  sharp(filePath)
    .metadata()
    .then((imageParams) => {
      sharp(filePath, { animated: !!name.match(regex) })
        .resize(width, height, {
          fit: crop,
        })
        .webp({ lossless: false, quality: 90 })
        .toFile(`${dir}/${name}`, function (err) {
          // output.jpg is a 300 pixels wide and 200 pixels high image
          // containing a scaled and cropped version of input.jpg
          if (err) {
            console.error(err);
          }
        })
        .toFile(`${saveDirPath}/${name}`, function (err) {
          // output.jpg is a 300 pixels wide and 200 pixels high image
          // containing a scaled and cropped version of input.jpg
          if (err) {
            console.error(err);
          }
        });
    });
}

const args = yargs(hideBin(process.argv))
  .usage("Usage: $0 [string] -name [string] -export [bool]")
  .demandCommand(1)
  .options({
    name: { type: "string", default: "" },
    export: { type: "boolean", default: false },
  })
  .parseSync();

console.log({ args });
main(process.argv[2], args.name);
