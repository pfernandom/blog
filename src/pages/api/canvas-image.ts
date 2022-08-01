// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Data = {
  name: string;
};

type Error = {
  cause: string;
};

type RequestData = {
  img: string;
  fileName: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  try {
    const body: RequestData = JSON.parse(req.body);
    console.log("Got request");
    var regex = /^data:.+?\/(.+?);base64,(.*?)$/;

    console.log({ body });
    if (!body.img || !body.fileName) {
      return res.status(500).send({ cause: "Not all fields are present" });
    }

    const string = body.img;
    console.log("Matching regex");
    var matches = string.match(regex) ?? [];
    console.log("Matched regex");
    var ext = matches[1];
    var data = matches[2];
    console.log("Start parsing image");
    var buffer = Buffer.from(data, "base64");
    console.log("Ended parsing image");

    const saveDirPath = path.join(
      process.cwd(),
      "public",
      "opt_images",
      "instagram",
      body.fileName
    );

    fs.mkdirSync(saveDirPath, {
      recursive: true,
    });

    console.log("Start writting image");
    const filePath = path.join(saveDirPath, `data.` + ext);
    console.log({ filePath });
    fs.writeFileSync(filePath, buffer);
    console.log("Finished writting image");

    return res.status(200).json({ name: filePath });
  } catch (err: unknown) {
    return res.status(500).send({ cause: `${err}` });
  }
}
