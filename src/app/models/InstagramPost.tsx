import { CanvasFont, InstagramPostType } from "app/models/interfaces";
import { DefaultCanvasFont } from "./DefaultCanvasFont";

export class InstagramPost implements InstagramPostType {
  slug?: string;
  width: number;
  height: number;
  fontSize: string | number;
  fonts?: Record<string, CanvasFont>;

  constructor({
    slug = "",
    width = 1080,
    height = 1080,
    fontSize = "36px",
    fonts,
  }: InstagramPostType) {
    this.slug = slug;
    this.width = width;
    this.height = height;
    this.fontSize = fontSize;

    const f = Object.entries(fonts ?? {}).reduce(
      (acc, [prop, val]) => ({
        ...acc,
        [prop]: new DefaultCanvasFont(val),
      }),
      {}
    );

    this.fonts = { ...InstagramPost.getDefaultFonts(), ...f };
  }

  static getDefaultFonts() {
    return {
      topLink: new DefaultCanvasFont({}),
      title: new DefaultCanvasFont({}),
      subtitle: new DefaultCanvasFont({}),
      footer: new DefaultCanvasFont({}),
    };
  }
}
