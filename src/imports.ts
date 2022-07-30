const m = (name: string) => import(`src/${name}/index.mdx`);

export default m;
