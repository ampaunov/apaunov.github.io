---
title: The tick bar
date: 2026-04-22
slug: the-tick-bar
references:
  - "Apple Inc. *Human Interface Guidelines: Dock magnification* (accessed 2026)."
  - "Edward Tufte. *The Visual Display of Quantitative Information* (Graphics Press, 2nd ed., 2001)."
---

Why a tick bar instead of a list. The problem with a list of post titles in the right margin is that the list either grows beyond the viewport (in which case you scroll twice — once on the article, once on the table of contents) or it has to be compressed into something smaller than its natural size (in which case it stops working as a list).

A bar of marks does neither. Each post is a horizontal line of fixed-but-tiny height. With hundreds of posts, the bar still fits. Hover gives you the title back, on demand, without claiming permanent screen real-estate.

The magnification trick is borrowed from the macOS Dock, and for the same reason: when you have too many small targets, you don't have to make them all bigger — you just have to make the one near the cursor big enough to aim at. The math is a smooth bump centered on the cursor. The taper matters: too sharp and the cursor's neighbours feel jittery; too gentle and the magnification stops being useful.

There is a separate question of what the bar is *for*. Two answers: it is a navigation aid (you click to jump), and it is a position indicator (you can see where you are in the stream as you scroll). The active-tick highlight covers the second use. The bubble label covers the first.

![](static/images/ornaments/separator.svg){.separator}

The third possible role — a *map of similarity* between posts, with closer posts sitting closer in the bar — is tempting and almost certainly a mistake at this scale. A reader does not arrive needing a similarity map; they arrive with a question, and the map will not answer it any better than chronology will.

So: ticks for chronology, bubbles for titles, magnification for aim.
