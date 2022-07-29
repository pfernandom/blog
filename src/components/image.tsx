import NextImage, { ImageProps, ImageLoader } from "next/image";

const customLoader: ImageLoader = ({ src, width }) => {
  console.log({ src });
  return src;
};

export default function Image(props: ImageProps) {
  console.log({ ImageProps: props });
  return <NextImage {...props} loader={customLoader} />;
}
