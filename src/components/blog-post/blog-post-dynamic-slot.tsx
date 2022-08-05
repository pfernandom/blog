import dynamic, {
  DynamicOptionsLoadingProps,
  LoadableComponent,
  Loader,
} from "next/dynamic";
import React, { useMemo } from "react";
import m from "src/imports";

function GhostContent() {
  return (
    <div>
      <div>
        {Array.from(Array(1).keys()).map((ps) => (
          <p key={ps}>
            {Array.from(Array(3).keys()).map((val) => (
              <span className="loading-state" key={val}></span>
            ))}
          </p>
        ))}
      </div>
      {Array.from(Array(2).keys()).map((elements) => (
        <>
          <div
            key={elements}
            className="loading-state loading-state--heading"
          ></div>
          <div>
            {Array.from(Array(3).keys()).map((ps) => (
              <p key={ps}>
                {Array.from(Array(3).keys()).map((val) => (
                  <span className="loading-state" key={val}></span>
                ))}
              </p>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}

export default function DynamicSlot({ chunk }: { chunk: string }) {
  const DynamicBlogPost: LoadableComponent = dynamic(m(chunk) as Loader, {
    loading: () => <GhostContent />,
  });
  console.log(DynamicBlogPost);
  return (
    <div className="blog-post-content">
      {/* <GhostContent /> */}
      <DynamicBlogPost />
    </div>
  );
}
