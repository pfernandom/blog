import React from "react";

function ToParagraphs({
  description,
  className,
  style,
}: {
  description: Array<string>;
  className?: string;
  style: Record<string | number, string>;
}) {
  return (
    <div className={className} style={style}>
      {description?.map((el, index) => (
        <p key={`description-p-${index}`}>{el}</p>
      ))}
    </div>
  );
}
