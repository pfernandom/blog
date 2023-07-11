'use client'
import { ReactElement } from "react";
import MDXComponentsDef from "../mdx/mdx-components";
import { MDXProvider } from '@mdx-js/react'

export default function BlogPostProvider({children}: {children:JSX.Element}) {
    return <MDXProvider components={MDXComponentsDef}>{children}</MDXProvider>
}