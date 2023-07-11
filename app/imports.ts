const m = (name: string) => import(`app/${name}/index.mdx`)

export default m
