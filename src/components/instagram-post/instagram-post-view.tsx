/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, {
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { InstagramDefaultConfig } from "src/models/instagram-default-config";
import CanvasManager from "src/helpers/canvas/canvas-manager";
import { PostInfo } from "src/models/interfaces";
import ColorPicker from "./color-picker";
import { InstagramPost } from "src/models/InstagramPost";
import InstagramBackground from "./InstagramBackground.jpeg";
import Image from "src/components/image";

type InstagramPostEditConfig = {
  isGridVisible?: boolean;
  isOutlineVisible?: boolean;
};

export default function InstagramPostView({
  post,
  pageNumber,
  currentConfig = InstagramDefaultConfig(),
  editConfig = {},
  outerRef = null,
  containerSize = {
    width: 300,
    height: 300,
  },
  withInstagramBackground = false,
  children,
}: {
  post: PostInfo;
  pageNumber: Number;
  currentConfig?: InstagramPost;
  editConfig?: InstagramPostEditConfig;
  outerRef?: RefObject<HTMLCanvasElement> | null;
  containerSize?: { width: number; height: number };
  withInstagramBackground?: Boolean;
  children?: ReactNode;
}) {
  const innerCanvasRef = useRef<HTMLCanvasElement>(null);

  const canvasRef = outerRef ?? innerCanvasRef;
  const imgRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setImageLoaded] = useState(false);

  const { width, height, fontSize, fonts } = currentConfig;

  const { isGridVisible = false, isOutlineVisible = false } = editConfig;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const em = parseFloat(getComputedStyle(canvas).fontSize);

    const canvasManager = new CanvasManager(canvas, currentConfig);

    canvasManager.drawBackground();

    const { title, topLink, subtitle, footer } = fonts!;

    //drawGrid(em, "grey");
    if (isGridVisible) {
      canvasManager.drawGrid({ rem: 2 * em, color: "red" });
    }

    const xem = 4;

    canvasManager.drawTopLink({
      xem: 2,
      yem: 0.5,
      heightEm: 2,
      font: topLink,
      isOutlineVisible,
    });

    let nexty = 6;
    nexty = canvasManager.addShadow(
      () =>
        (nexty = canvasManager.drawText({
          text: post?.frontmatter.social_title ?? "",
          xem: 2,
          yem: nexty,
          font: title,
          isOutlineVisible,
        })),
      {
        shadowBlur: 1,
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowColor: "#00c5e8",
      }
    );

    const { height: imgH } = canvasManager.getScaledImageSize({
      imgHeight: post.frontmatter.hero_height,
      imgWidth: post.frontmatter.hero_width,
    });
    const { width } = canvasManager.getScaledSize();

    const footerStart = canvasManager.footerTextStart - 2;
    const imgHEm = imgH / em;
    const midEm = (footerStart + nexty - 2) / 2;

    switch (pageNumber) {
      case 1:
        nexty = canvasManager.addShadow(() =>
          canvasManager.drawImage({
            imgRef: imgRef?.current,
            yem: midEm - imgHEm / 2,
            imgHeight: post.frontmatter.hero_height,
            imgWidth: post.frontmatter.hero_width,
          })
        );
        break;
      case 2:
        const w = width - xem * em * 2;
        const lines = canvasManager.getLines({
          text: post?.frontmatter.social_subtitle ?? "",
          maxWidth: w,
          font: subtitle,
        }).length;
        canvasManager.addShadow(
          () =>
            (nexty = canvasManager.drawText({
              text: post?.frontmatter.social_subtitle ?? "",
              xem,
              yem: midEm - ((subtitle.lineHeight ?? 1) * lines) / 2,
              font: subtitle,
              isOutlineVisible,
            })),
          {
            shadowBlur: 1,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "grey",
          }
        );
        break;
      default:
    }

    let yem = canvasManager.footerTextStart;

    canvasManager.drawText({
      text: post?.frontmatter.social_footer ?? "",
      xem,
      yem,
      font: footer,
      isOutlineVisible,
    });

    //canvasManager.scale();
  }, [
    width,
    height,
    fontSize,
    post,
    isGridVisible,
    isOutlineVisible,
    currentConfig,
    fonts,
    isImageLoaded,
    canvasRef,
    pageNumber,
  ]);

  return (
    <>
      <div
        style={
          withInstagramBackground
            ? {
                position: "relative",
                width: containerSize.width,
                margin: "1em",
              }
            : { width: containerSize.width, margin: "1em" }
        }
      >
        {withInstagramBackground && (
          <div
            style={{
              width: containerSize.width,
            }}
          >
            <Image
              alt="Instagram background"
              src={InstagramBackground}
              width={1442}
              height={3120}
            />
          </div>
        )}
        <canvas
          //   style={{ transform: "scale(0.5) translate(-900px, -500px)" }}
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            fontSize,
            width: containerSize.width,
            height: containerSize.height,
            position: withInstagramBackground ? "absolute" : "initial",
            top: "14.27%",
            left: 0,
          }}
          className="instagram-canvas"
        />
      </div>
      {children}
      <img
        style={{ display: "none" }}
        ref={imgRef}
        src={post.frontmatter.hero_image}
        alt={post.frontmatter.hero_image_alt}
        width={width / 2}
        onLoad={() => {
          setImageLoaded(true);
        }}
      />
    </>
  );
}
