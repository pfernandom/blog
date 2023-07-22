import path from 'path'

/**
 * src/content
 */
export const CONTENT_PATH = path.join('src', 'app', 'content')

/**
 * content
 */
export const CONTENT_RELATIVE_PATH = path.join('app', 'content')

export type StaticParams<T extends string | string[]> = Promise<
  Record<
    T extends string ? T : T[number],
    T extends string ? string : string[]
  >[]
>

export type DynamicPageParams<T extends string | string[]> = {
  params: Record<
    T extends string ? T : T[number],
    T extends string ? string : string[]
  >
}
