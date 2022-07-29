// Install gray-matter and date-fns
import matter from "gray-matter";
import { parseISO, format } from "date-fns";
import fs from "fs";
import path from "path";
import { join } from "path";
import { PostInfo } from "../src/models/interfaces";

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), "src", "pages", "blog");

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

export function getPostByFileInfo(slugFile: FileInfo): PostInfo {
  const curDirRelative = join(process.cwd(), "src", "pages");
  const fileContents = fs.readFileSync(
    join(curDirRelative, slugFile.filePath),
    "utf8"
  );

  const { data, content } = matter(fileContents);
  const publicPath = join("/opt_images/", slugFile?.dirPath);

  const date = format(parseISO(data.date), "MMMM dd, yyyy");
  const {
    title,
    description,
    hero_image: relativeHero,
    hero_image_alt,
    published,
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
      published,
    },
  };
}

export function getAllPosts() {
  const curDir = join(process.cwd(), "src", "blog");
  const curDirRelative = join(process.cwd(), "src", "pages");
  const slugs = getAllFiles(curDir, /.mdx?$/gi, [], curDirRelative);

  const curImgDir = join(process.cwd(), "public", "opt_images");
  const images = getAllFiles(curImgDir, /(webp)/gi, [], curImgDir);

  const posts: Array<PostInfo> = slugs.map((slug) => getPostByFileInfo(slug));

  return posts;
}

const curDirRelative = join(process.cwd(), "src", "pages");
const curDir = join(process.cwd(), "src", "blog");
const posts = getAllFiles(curDir, /.mdx?$/gi, [], curDirRelative);

const contents = posts.map((post, index) => {
  const slug = post.filePath.replace(/(\/[a-zA-Z0-9]+\.mdx?|\.\.\/)/gi, "");
  return `
  "${slug}": () => import('${post.filePath.replace("..", "src")}')`.replace(
    /\n/gi,
    ""
  );
});

const allImports = `import { Loader } from "next/dynamic"; \n\n const m : Record<string, Loader> = {${contents.join(
  ",\n"
)}};\n export default m;`;

console.log({
  allImports,
});

fs.writeFileSync("./src/imports.ts", allImports);