---
title: What happens when you click on the browser's "back" button?
date: "2019-08-16T12:00:03.284Z"
description: "What exactly happens to your web application when a user clicks on their browser's back button?"
published: false
---

The "back" button in a browser is one of those things that seem so simple no one really puts a lot of thought on it. After all, the concept behind it it's really simple: You navigate to the previous page you were before. If there is no previous page, the button can't be clicked. Simple, right?

Fo you know for sure what "going back" actually involves? Do you look at a cached version of your page? Does it re-render as if you were navigating to it for the first time? What about network requests?
These questions might have simple answers when web sites were mostly HTML and CSS, but as we have added more complexity to our web apps with JavaScript and frameworks, the answers are less clear today.

In this post I'll try to shed some light on what happens to our web apps when we click on the back button.

## Static HTML
Let's start from the simplest case. What happens to a static web page when the user hits the back button?

