import dynamic, { Loader } from "next/dynamic";
import React, { useMemo } from "react";
import m from "src/imports";

export default function DynamicSlot({ chunk }: { chunk: string }) {
  const DynamicBlogPost = useMemo(() => dynamic(m(chunk) as Loader), [chunk]);

  return (
    <div className="blog-post-content">
      <DynamicBlogPost />
    </div>
  );
}
