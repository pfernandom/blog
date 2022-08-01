// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { InstagramPost } from "src/models/InstagramPost";
import { InstagramDefaultConfig } from "src/models/instagram-default-config";

export class InstagramDataService {
  save({
    slug,
    instagramPost,
    overwrite = false,
  }: {
    slug: string;
    instagramPost: InstagramPost;
    overwrite?: boolean;
  }) {
    const saveDirPath = path.join(
      process.cwd(),
      "src",
      "data",
      "instagram",
      slug
    );

    fs.mkdirSync(saveDirPath, {
      recursive: true,
    });

    const filePath = path.join(saveDirPath, "post.json");

    if (!fs.existsSync(filePath) || (fs.existsSync(filePath) && overwrite)) {
      fs.writeFileSync(filePath, JSON.stringify(instagramPost));
    } else {
      console.log(`${filePath} already exists`);
    }

    return filePath;
  }

  get(slug: string) {
    const saveDirPath = path.join(
      process.cwd(),
      "src",
      "data",
      "instagram",
      slug,
      "post.json"
    );

    if (!fs.existsSync(saveDirPath)) {
      return JSON.parse(JSON.stringify(InstagramDefaultConfig(slug)));
    }

    const config: InstagramPost = JSON.parse(
      fs.readFileSync(saveDirPath, "utf8")
    );
    config.slug = slug;
    return config;
  }
}

type Error = {
  cause: string;
};

type Data =
  | Error
  | InstagramPost
  | {
      name: string;
    };

type RequestData = {
  instagramPost: InstagramPost;
  slug: string;
  overwrite: boolean;
};

function get(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
  const slug = req.query["slug"] as string;

  const instagramService = new InstagramDataService();
  const config = instagramService.get(slug);

  return res.status(200).json(config);
}

function post(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
  const body: RequestData = JSON.parse(req.body);

  const instagramService = new InstagramDataService();
  const filePath = instagramService.save({
    slug: body.slug,
    instagramPost: body.instagramPost,
    overwrite: body.overwrite,
  });

  return res.status(200).json({ name: filePath });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  try {
    if (req.method === "POST") {
      return post(req, res);
    }
    return get(req, res);
  } catch (err: unknown) {
    return res.status(500).send({ cause: `${err}` });
  }
}
