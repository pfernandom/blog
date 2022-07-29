import NextImage, { ImageProps, ImageLoader } from "next/image";

const customLoader: ImageLoader = ({ src, width }) => {
  return src;
};

export default function Image(props: ImageProps) {
  return <NextImage {...props} loader={customLoader} />;
}
