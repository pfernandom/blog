import Link from 'next/link'
import React from 'react'
import { PostInfo } from 'src/models/interfaces'

export function BlogPostSeries({
  post,
  seriesPosts,
}: {
  post: PostInfo
  seriesPosts: PostInfo[]
}) {
  if (seriesPosts.length <= 1) {
    return <></>
  }
  const { prevInSeries, nextInSeries } = getNextAndPrevSeries(post, seriesPosts)

  const allSeries = [
    ...prevInSeries.map((post) => [post, false]),
    [post, true],
    ...nextInSeries.map((post) => [post, false]),
  ].map(([post, isSelected], index) =>
    seriesLink(post as PostInfo, isSelected as boolean, index)
  )

  return (
    <div className="blog-series-list">
      <div className="series-heading"></div>
      <ul>{allSeries}</ul>
      <div className="series-footer"></div>
    </div>
  )
}

function seriesLink(post: PostInfo, selected: boolean = false, index: number) {
  const Text = () => (
    <div className="series-text">
      <span className="batch">{index + 1}</span>{' '}
      <span className="text">{post.frontmatter.title}</span>
    </div>
  )

  return (
    <li key={post.slug} className={selected ? 'selected' : ''}>
      {selected ? (
        <Text />
      ) : (
        <Link href={post.slug} title={`Posted on ${post.frontmatter.date}`}>
          <Text />
        </Link>
      )}
    </li>
  )
}

export function getNextAndPrevSeries(post: PostInfo, series: PostInfo[]) {
  const prevInSeries = series.filter(
    (p) => p.slug != post.slug && p.frontmatter.date < post.frontmatter.date
  )
  const nextInSeries = series.filter(
    (p) => p.slug != post.slug && p.frontmatter.date >= post.frontmatter.date
  )

  return { prevInSeries, nextInSeries }
}
