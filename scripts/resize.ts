import sharp from "sharp";
import fs from "fs";
import path, { join } from "path";

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

function main() {
  const regexExt = /\.(jpeg|jpg|png|gif)$/gi;
  const files = getAllFiles(postsDirectory, regexExt, []);
  console.log({ files });

  const optimizedRegex = /\.(webp)$/gi;
  const optimizedImages = getAllFiles(postsDirectory, optimizedRegex, []);

  optimizedImages.forEach(
    ({ fileName, filePath: fileRelativePath, dirPath }) => {
      const filePath = path.join(postsDirectory, fileRelativePath);
      const saveDirPath = path.join(
        process.cwd(),
        "public",
        "opt_images",
        "blog",
        dirPath
      );
      fs.mkdirSync(saveDirPath, {
        recursive: true,
      });

      fs.copyFileSync(filePath, path.join(saveDirPath, fileName));
    }
  );

  files.forEach(({ fileName, filePath: fileRelativePath, dirPath }) => {
    const filePath = path.join(postsDirectory, fileRelativePath);
    const saveDirPath = path.join(
      process.cwd(),
      "public",
      "opt_images",
      "blog",
      dirPath
    );
    fs.mkdirSync(saveDirPath, {
      recursive: true,
    });

    optimizedImages;

    sharp(filePath)
      .metadata()
      .then(({ width }) => {
        if (filePath.includes(".gif")) {
          sharp(filePath, { animated: true })
            .webp({ lossless: false, quality: 90 })
            .toFile(
              path.join(saveDirPath, fileName.replace(regexExt, ".webp")),

              function (err) {
                // output.jpg is a 300 pixels wide and 200 pixels high image
                // containing a scaled and cropped version of input.jpg
                if (err) {
                  console.error(err);
                }
              }
            );
        } else {
          sharp(filePath)
            //.resize(400)
            .blur(5)
            .webp({ lossless: false, quality: 50 })
            .toFile(
              path.join(
                saveDirPath,
                `blur_${fileName.replace(regexExt, ".webp")}`
              ),
              function (err) {
                // output.jpg is a 300 pixels wide and 200 pixels high image
                // containing a scaled and cropped version of input.jpg
                if (err) {
                  console.error(err);
                }
              }
            );

          sharp(filePath)
            // .resize(Math.round(width * 0.5))
            //.resize(400)
            .webp({ lossless: false, quality: 90 })
            .toFile(
              path.join(saveDirPath, fileName.replace(regexExt, ".webp")),

              function (err) {
                // output.jpg is a 300 pixels wide and 200 pixels high image
                // containing a scaled and cropped version of input.jpg
                if (err) {
                  console.error(err);
                }
              }
            );
        }
      });
  });
}

main();
