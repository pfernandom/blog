import matter from "gray-matter";
import { parseISO, format } from "date-fns";
import fs from "fs";
import path from "path";
import { join } from "path";
import { PostInfo } from "../models/interfaces";

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), "src", "blog");

type FileInfo = {
  fileName: string;
  filePath: string;
  dirPath: string;
};

class EmptyFileInfo implements FileInfo {
  fileName: string;
  filePath: string;
  dirPath: string;

  constructor() {
    this.fileName = "";
    this.filePath = "";
    this.dirPath = "";
  }
}

const getAllFiles = function (
  dirPath: string,
  pattern: string | RegExp,
  arrayOfFiles: Array<FileInfo> | undefined = [],
  relativeToPath: string
) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const regex = RegExp(pattern, "ig");
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(
        dirPath + "/" + file,
        pattern,
        arrayOfFiles,
        relativeToPath
      );
    } else if (regex.test(file)) {
      const relativePath = path.relative(
        relativeToPath,
        path.join(dirPath, "/")
      );
      arrayOfFiles.push({
        fileName: file,
        filePath: [relativePath, "/", file].join(""),
        dirPath: relativePath,
      });
    }
  });

  return arrayOfFiles;
};

export function getPostByFileInfo(slugFile: FileInfo): PostInfo | null {
  const curDirRelative = join(process.cwd(), "src");
  const fileContents = fs.readFileSync(
    join(curDirRelative, slugFile.filePath),
    "utf8"
  );

  const { data, content } = matter(fileContents);
  const publicPath = join("/opt_images/", slugFile?.dirPath);
  if (!data.published) {
    return null;
  }

  const date = format(parseISO(data.date), "MMMM dd, yyyy");
  const {
    title,
    description,
    hero_image: relativeHero,
    hero_image_alt,
    published,
    key_words,
  } = data;

  const hero_image = relativeHero
    ? path.join(
        publicPath,
        relativeHero.replace(/(png|jpg|jpeg|gif)/gi, "webp")
      )
    : "";
  const hero_image_blur = relativeHero
    ? path.join(
        publicPath,
        "blur_" + relativeHero?.slice(2).replace(/(png|jpg|jpeg|gif)/gi, "webp")
      )
    : "";

  return {
    slug: slugFile?.dirPath,
    frontmatter: {
      title,
      description,
      hero_image,
      hero_image_blur,
      hero_image_alt: hero_image_alt ?? "",
      date,
      key_words: parseKeyWords(key_words),
      published,
    },
    content: content
      .replaceAll("](./", `](${publicPath}/`)
      .replaceAll(".gif", ".webp"),
  };
}

export function getAllPosts() {
  const curDir = join(process.cwd(), "src", "blog");
  const curDirRelative = join(process.cwd(), "src");
  const slugs = getAllFiles(curDir, /.mdx?$/gi, [], curDirRelative);

  const posts: Array<PostInfo> = slugs
    .map((slug) => getPostByFileInfo(slug))
    .filter((post) => post != null)
    .map((post) => post as PostInfo);

  return posts;
}

function parseKeyWords(keywords: string) {
  return keywords
    .split(/[a-zA-Z0-9],( )+?/gi)
    .filter((keyword) => keyword.trim().length);
}
