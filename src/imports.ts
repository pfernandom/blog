import { Loader } from "next/dynamic";

const m: Record<string, Loader> = {
  "blog/2019/6/html-chunking": () =>
    import("src/blog/2019/6/html-chunking/index.mdx"),
  "blog/2019/7/array-fill": () =>
    import("src/blog/2019/7/array-fill/index.mdx"),
  "blog/2019": () => import("src/blog/2019/index.md"),
  "blog/2022/7/component-wonder": () =>
    import("src/blog/2022/7/component-wonder/index.md"),
  "blog/2022/7/flutter-app-state": () =>
    import("src/blog/2022/7/flutter-app-state/index.mdx"),
};
export default m;
