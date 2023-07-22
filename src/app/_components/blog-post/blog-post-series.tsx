import Link from 'next/link'
import React from 'react'
import { Post, PostInfo } from 'app/models/interfaces'

export function BlogPostSeries({
  post,
  seriesPosts,
}: {
  post: Post
  seriesPosts: Post[]
}) {
  if (seriesPosts.length <= 1) {
    return <></>
  }
  const { prevInSeries, nextInSeries } = getNextAndPrevSeries(post, seriesPosts)

  const seriesAndSelected: [Post, boolean][] = [
    ...prevInSeries.map((post) => [post, false] as [Post, boolean]),
    [post, true] as [Post, boolean],
    ...nextInSeries.map((post) => [post, false] as [Post, boolean]),
  ]

  const allSeries = seriesAndSelected.map(([post, isSelected], index) =>
    seriesLink(post, isSelected as boolean, index)
  )

  return (
    <div className="blog-series-list">
      <div className="series-heading"></div>
      <ul>{allSeries}</ul>
      <div className="series-footer"></div>
    </div>
  )
}

function seriesLink(post: Post, selected = false, index: number) {
  const Text = () => (
    <div className="series-text">
      <span className="batch">{index + 1}</span>{' '}
      <span className="text">{post.title}</span>
    </div>
  )

  return (
    <li key={post.slug} className={selected ? 'selected' : ''}>
      {selected ? (
        <Text />
      ) : (
        <Link href={`/${post.slug}`} title={`Posted on ${post.date}`}>
          <Text />
        </Link>
      )}
    </li>
  )
}

export function getNextAndPrevSeries(post: Post, series: Post[]) {
  const prevInSeries = series.filter(
    (p) => p.slug != post.slug && p.date < post.date
  )
  const nextInSeries = series.filter(
    (p) => p.slug != post.slug && p.date >= post.date
  )

  return { prevInSeries, nextInSeries }
}
