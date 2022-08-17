import NextImage, {
  ImageProps,
  ImageLoader,
  StaticImageData,
} from "next/image";

const customLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function Image({
  className,
  width,
  height,
  objectFit = "cover",
  scale = 1,
  ...rest
}: ImageProps & { scale?: number }) {
  const { src } = rest;

  const size =
    typeof src === "string" ? { width, height } : (src as StaticImageData);

  const scaleNum = (n: number | undefined | string) => {
    if (typeof n === "number") return scale * n;
    return n;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span className={["blog-img", className].join(" ")}>
        <NextImage
          width={scaleNum(width ?? size.width)}
          height={scaleNum(height ?? size.height)}
          objectFit={objectFit}
          {...rest}
          loader={customLoader}
        />
      </span>
    </div>
  );
}
