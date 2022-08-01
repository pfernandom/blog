import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import { InstagramDefaultConfig } from "src/models/instagram-default-config";
import CanvasManager from "src/helpers/canvas/canvas-manager";
import { PostInfo } from "src/models/interfaces";
import ColorPicker from "../color-picker";
import InstagramPostView from "./instagram-post-view";
import { InstagramPost } from "src/models/InstagramPost";

const allFonts = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier",
  "Courier New",
  "Brush Script MT",
];

enum SavedStatus {
  INITIAL,
  SAVING,
  SAVED,
  ERROR,
}

const getSaveButtonText = (status: SavedStatus) => {
  switch (status) {
    case SavedStatus.INITIAL:
      return "Print";
    case SavedStatus.SAVING:
      return "Printing...";
    case SavedStatus.SAVED:
      return "Print again";
  }
};

export default function InstagramEditTools({
  post,
  defaultConfig = InstagramDefaultConfig(),
}: {
  post: PostInfo;
  defaultConfig?: InstagramPost;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [inPreview, setPreview] = useState(false);
  const [isGridVisible, setGridVisible] = useState(false);
  const [isOutlineVisible, setOutlinesVisible] = useState(false);
  const [savedStatus, setSavedStatus] = useState(SavedStatus.INITIAL);
  const [containerSize, setContainerSize] = useState({
    width: 300,
    height: 300,
  });

  const [currentConfig, setConfig] = useState(new InstagramPost(defaultConfig));
  const { width, height, fontSize, fonts } = currentConfig;

  const colorsConfig = Object.entries(fonts ?? {}).map(([property, font]) => ({
    property,
    color: font.color,
  }));

  return (
    <>
      <div style={{ display: "flex" }}>
        <InstagramPostView
          outerRef={canvasRef}
          post={post}
          currentConfig={currentConfig}
          editConfig={{ isGridVisible, isOutlineVisible }}
          containerSize={containerSize}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>
            Show grid?
            <input
              type="checkbox"
              onChange={(val) => {
                setGridVisible(val.target.checked);
              }}
            ></input>
          </label>
          <label>
            Show outlines?
            <input
              type="checkbox"
              onChange={(val) => {
                setOutlinesVisible(val.target.checked);
              }}
            ></input>
          </label>
          Colors:
          {colorsConfig.map((colorProp) => (
            <ColorPicker
              key={colorProp.property}
              property={colorProp.property}
              color={colorProp.color}
              onSelect={(props) => {
                const newConfig = new InstagramPost(currentConfig);
                const fonts = newConfig.fonts!;
                fonts[props.property].color = props.color;

                setConfig(newConfig);
              }}
            ></ColorPicker>
          ))}
          Fonts:
          {Object.entries(fonts ?? {}).map(([property, font]) => (
            <label key={`font-${property}`}>
              {property}
              <select
                defaultValue={font.family}
                onChange={(props) => {
                  const newConfig = new InstagramPost(currentConfig);
                  const fonts = newConfig.fonts!;
                  fonts[property].family = props.target.value;

                  setConfig(newConfig);
                }}
              >
                {allFonts.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          ))}
          <button
            onClick={() => {
              fetch("/api/instagram-post", {
                method: "POST",
                body: JSON.stringify({
                  instagramPost: currentConfig,
                  slug: post.slug,
                  overwrite: true,
                }),
              }).catch((err) => {
                console.error(err);
              });
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setConfig(InstagramDefaultConfig());
            }}
          >
            Clear
          </button>
        </div>
      </div>
      {inPreview && (
        <button
          onClick={() => {
            const url = canvasRef.current?.toDataURL("image/png");

            fetch("/api/canvas-image", {
              method: "POST",
              body: JSON.stringify({ img: url, fileName: post?.slug }),
            })
              .then(async (data) => {
                setSavedStatus(SavedStatus.SAVED);
              })
              .catch((err) => {
                setSavedStatus(SavedStatus.ERROR);
              });

            setSavedStatus(SavedStatus.SAVING);
          }}
        >
          {getSaveButtonText(savedStatus)}
        </button>
      )}
      <button
        onClick={() => {
          if (inPreview) {
            setContainerSize({ width: 300, height: 300 });
            setPreview(false);
            return;
          }
          setContainerSize({ width: 1080, height: 1080 });
          setPreview(true);
        }}
      >
        Preview
      </button>
      <pre>{JSON.stringify(currentConfig, null, "\t")}</pre>
    </>
  );
}
