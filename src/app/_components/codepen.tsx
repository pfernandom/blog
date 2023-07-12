import Script from 'next/script'
import React from 'react'

type CodePenProps = {
  height: string
  defaultTab: string
  slugHash: string
  user: string
}

export default function CodePen({
  height,
  defaultTab,
  slugHash,
  user,
}: CodePenProps) {
  return (
    <div>
      <Script
        defer
        src="https://cpwebassets.codepen.io/assets/embed/ei.js"
      ></Script>
      <p
        className="codepen"
        data-height={height}
        data-default-tab={defaultTab}
        data-slug-hash={slugHash}
        data-user={user}
        style={{ height: `${height}px` }}
      >
        <span>
          See the Pen{' '}
          <a href={`https://codepen.io/pfernandom/pen/${slugHash}`}>
            CSS variables and dark-mode
          </a>{' '}
          by Pedro Marquez (
          <a href="https://codepen.io/pfernandom">@pfernandom</a>) on{' '}
          <a href="https://codepen.io">CodePen</a>.
        </span>
      </p>
    </div>
  )
}
