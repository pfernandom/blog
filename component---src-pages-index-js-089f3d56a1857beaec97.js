(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{RXBc:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),l=a.n(n),r=a("Wbzz"),o=a("6Gk8"),i=a("Bl7J"),s=a("vrFN"),c=a("p3AD");t.default=function(e){var t=e.data,a=e.location,n=t.site.siteMetadata.title,d=t.allMarkdownRemark.edges;return l.a.createElement(i.a,{location:a,title:n},l.a.createElement(s.a,{title:"All posts",keywords:["blog","gatsby","javascript","react"]}),l.a.createElement(o.a,null),d.filter((function(e){return e.node.frontmatter.published})).map((function(e){var t=e.node,a=t.frontmatter.title||t.fields.slug;return l.a.createElement("div",{key:t.fields.slug},l.a.createElement("h3",{style:{marginBottom:Object(c.a)(1/4)}},l.a.createElement(r.Link,{style:{boxShadow:"none"},to:t.fields.slug},a)),l.a.createElement("small",null,t.frontmatter.date),l.a.createElement("p",{dangerouslySetInnerHTML:{__html:t.frontmatter.description||t.excerpt}}))})))}}}]);
//# sourceMappingURL=component---src-pages-index-js-089f3d56a1857beaec97.js.map