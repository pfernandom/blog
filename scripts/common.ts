import path, { join } from "path";
import fs from "fs";
import matter from "gray-matter";

export type FileInfo = {
  fileName: string;
  filePath: string;
  dirPath: string;
};

export const postsDirectory = join(process.cwd(), "src", "blog");

export const getAllFiles = function (
  dirPath: string,
  pattern: RegExp,
  arrayOfFiles: Array<FileInfo> | undefined = []
) {
  const files = fs.readdirSync(dirPath);

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
      }
      //  else {
      //   console.log(`Found "${file}": Failed to match ${regex} Not processed`);
      //   console.log(file.match(regex));
      // }
    }
  });

  return arrayOfFiles;
};

export function getPostByFileInfo(slugFile: FileInfo) {
  const curDirRelative = join(process.cwd(), "src", "blog");
  const fileContents = fs.readFileSync(
    join(curDirRelative, slugFile.filePath),
    "utf8"
  );

  const { data, content } = matter(fileContents);
  if (!data.published) {
    return null;
  }

  return { data, content };
}
