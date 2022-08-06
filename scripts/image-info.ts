import sharp from "sharp";
import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

console.log(process.argv);

async function main(file: string, scale: number) {
  if (!fs.existsSync(process.argv[2])) {
    console.error(`File ${file} does not exist`);
  }
  const meta = await sharp(file).metadata();
  console.log(meta);

  const { width, height } = meta;

  sharp(file)
    .resize({
      width: Math.round(width! * scale),
      height: Math.round(height! * scale),
    })
    .png({})
    .toFile(file.replace(/\.(jpeg|jpg|png|webo)/gi, "_scaled.$1"));
}

const args = yargs(hideBin(process.argv))
  .usage("Usage: $0 <source> -scale [number]")
  .help()
  .positional("source", {
    describe: "image path to fetch content from",
    type: "string",
  })
  .options({
    scale: { type: "number", default: 1 },
  })
  .parseSync();

console.log({ args });
main(args._[0] as string, args.scale);
