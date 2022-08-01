/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { InstagramDefaultConfig } from "src/models/instagram-default-config";
import CanvasManager from "src/helpers/canvas/canvas-manager";
import { PostInfo } from "src/models/interfaces";
import ColorPicker from "../color-picker";
import { InstagramPost } from "src/models/InstagramPost";

type InstagramPostEditConfig = {
  isGridVisible?: boolean;
  isOutlineVisible?: boolean;
};

export default function InstagramPostView({
  post,
  currentConfig = InstagramDefaultConfig(),
  editConfig = {},
  outerRef = null,
  containerSize = {
    width: 300,
    height: 300,
  },
}: {
  post: PostInfo;
  currentConfig?: InstagramPost;
  editConfig?: InstagramPostEditConfig;
  outerRef?: RefObject<HTMLCanvasElement> | null;
  containerSize?: { width: number; height: number };
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
      yem: 2,
      heightEm: 2,
      font: topLink,
      isOutlineVisible,
    });

    let nexty = canvasManager.drawText({
      text: post?.frontmatter.social_title ?? "",
      xem,
      yem: 6,
      font: title,
      isOutlineVisible,
    });
    nexty = canvasManager.drawText({
      text: post?.frontmatter.social_subtitle ?? "",
      xem,
      yem: nexty + 1,
      font: subtitle,
      isOutlineVisible,
    });

    nexty = canvasManager.addShadow(() =>
      canvasManager.drawImage({ imgRef: imgRef?.current, yem: nexty + 1 })
    );

    canvasManager.drawText({
      text: post?.frontmatter.social_footer ?? "",
      xem,
      yem: nexty + 4,
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
  ]);

  return (
    <>
      <canvas
        //   style={{ transform: "scale(0.5) translate(-900px, -500px)" }}
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          fontSize,
          width: containerSize.width,
          height: containerSize.height,
        }}
        className="instagram-canvas"
      />
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
