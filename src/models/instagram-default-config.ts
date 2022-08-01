import { InstagramPost } from "./InstagramPost";

export const InstagramDefaultConfig = (slug: string = "") =>
  new InstagramPost({
    slug,
    width: 1080,
    height: 1080,
    fontSize: "36px",
    fonts: {
      topLink: {
        color: "black",
        size: "1em",
        family: "Courier",
        lineHeight: 1.5,
      },
      title: {
        color: "rgba(0, 71, 117, 1)",
        size: "1.5em",
        family: "Tahoma",
        lineHeight: 1.5,
      },
      subtitle: {
        color: "black",
        size: "1em",
        family: "Helvetica",
        lineHeight: 1.5,
      },
      footer: {
        color: "black",
        size: "1em",
        family: "Helvetica",
        lineHeight: 1.5,
      },
    },
  });
