import React from 'react'
import Link from 'next/link'
import { ReactNode } from 'react'

import { useRouter } from 'next/router'
import SocialPane from './social'
import News from './news'

function Layout({
  location,
  title,
  children,
}: {
  location: string
  title: string
  children: ReactNode
}) {
  // eslint-disable-next-line no-undef
  let header
  const router = useRouter()

  if (router.route === '/') {
    header = <h1>{title}</h1>
  } else {
    header = (
      <>
        <div style={{ marginBottom: '1em' }}>
          <Link href="/"> &larr; Back to all posts</Link>
        </div>
        <h1>{title}</h1>
      </>
    )
  }
  return (
    <>
      <News></News>
      <div className="layout-content">
        <div className="layout-header">
          <header>{header}</header>
          <SocialPane />
        </div>
        <main className="main">{children}</main>

        <footer>
          <a
            href="https://pfernandom.github.io"
            style={{ textDecoration: 'underline' }}
          >
            Pedro Marquez-Soto
          </a>{' '}
          © {new Date().getFullYear()}
        </footer>
      </div>
    </>
  )
}

export default Layout
