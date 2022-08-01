import { RGBColor } from "react-color";
import { CanvasFont } from "src/models/interfaces";

export class DefaultCanvasFont implements CanvasFont {
  color: string | RGBColor;
  size?: string | number | undefined;
  family: string;
  lineHeight?: number;

  constructor({
    color = "black",
    size = "1em",
    family = "Courier",
    lineHeight = 1.5,
  }: {
    color?: string | RGBColor;
    size?: string | number | undefined;
    family?: string;
    lineHeight?: number;
  }) {
    this.color = color;
    this.size = size;
    this.family = family;
    this.lineHeight = lineHeight;
  }

  toString() {
    if (typeof this.size === "string" && this.size.match(/(em|px)/)) {
      return `${this.size} ${this.family}`;
    }
    return `${this.size}em ${this.family}`;
  }
}
