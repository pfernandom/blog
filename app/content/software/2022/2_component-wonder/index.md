---
title: "The wonderful world of component-based development"
date: "2022-07-18T22:12:03.284Z"
description:
  [
    "Modern front-end development is based in components. Let us explore the wonders of this paradigm.",
  ]
published: false
---

If you have worked in front-end (both mobile and web), chances are you have met component-based developent.

Just as in most Object-Oriented languages where everything is an object, modern client frameworks are built on top of components. For instance, JavaScript's React allows us to create components as follows:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

In fact, React components can be even simpler than that:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

This
