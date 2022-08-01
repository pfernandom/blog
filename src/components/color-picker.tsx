import React, { useState } from "react";
import { ColorResult, ChromePicker, RGBColor, Color } from "react-color";

export type ColorPickerCallbackProps = {
  color: RGBColor;
  property: string;
};

export type ColorPickerProps = {
  property: string;
  color: Color;
  onSelect: (props: ColorPickerCallbackProps) => any;
};

export default function ColorPicker({
  property,
  color,
  onSelect,
}: ColorPickerProps) {
  const [selectedColor, setColor] = useState(color);
  const [isExpanded, seExpand] = useState(false);

  const handleChange = (color: ColorResult) => {
    setColor(color.rgb);
    onSelect({ color: color.rgb, property });
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => {
          seExpand(true);
        }}
      >
        Set &quot;{property}&quot;
      </button>
    );
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        }}
        onClick={() => {
          seExpand(false);
        }}
      />
      <div style={{ position: "absolute", zIndex: "2" }}>
        <ChromePicker
          color={selectedColor}
          onChange={handleChange}
        ></ChromePicker>
      </div>
    </>
  );
}
