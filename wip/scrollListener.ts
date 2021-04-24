/*
@polyfill Array.includes required for all versions of Internet Explorer


scrollListener
==============

Performant scroll based actions in 60 FPS.


@todo
- [ ] Save root data to var to optimise when it's written
- [ ] DOM mutation observer that also triggers a reMeasure
- [ ] Document use of rAF: "Only wrap your DOM changes"
- [ ] Complete use cases
- [ ] Consider renaming "offset" to "target"
- [ ] Implement threshold in Intersection method
- [ ] Example pattern for `addOnce`


@note use cases to cover
- [ ] Asset lazy loading
- [x] Nav positioned/transformed based on scroll offset
- [ ] component/veneer integration
- [ ] IO behaviour
- [ ] Works with elements with fixed positions; ie, their offset relative to the document _does_ change as the page scrolls
- [ ] parallax and animation tweening
- [ ] TOC heading highlighting behaviour


When to use requestAnimationFrame
---------------------------------

Callbacks should calculate whether they are going to update the DOM, and only if they will do so should they wrap the DOM change in rAF, eg:

```
  if (offset.top > someValue) {
    requestAnimationFrame(writeLayout)
  }
```

Or

```
  const onscroll = (data) => {
    if (interstion(data).isIntersecting) {
      requestAnimationFrame(() => { el.classList.add("Hello! You can see me!") })
    }
  }
  add(el, onscroll)
```
*/
// Callbacks that are supposed to happen at exactly the same time are ordered by the position of the element in the DOM and called with a staggerIndex. This allows



// import { debounce } from "../util/debounce"
import { offset as getOffset, OffsetData } from "../dom/offset"
import { clamp } from "../math/clamp"


interface RootData {
  scrollX: number
  scrollY: number
  scrollHeight: number
  direction: Direction
  width: number
  height: number
}

interface TrackedData {
  target: HTMLElement
  offset?: OffsetData
  cb: ScrollCallback
}

interface ScrollData {
  target: HTMLElement,
  offset: OffsetData
  root: RootData
}

interface IntersectionData {
  target: HTMLElement,
  isIntersecting: boolean
  ratio: number // 0–1
  value: number // 0–1
}

export type ScrollCallback = (data: ScrollData) => any
type Threshold = number // @todo... remove? Implement in `intersection` method

let initiated = false
let tracked: TrackedData[] = []
let lastScrollY: number
let root: RootData


type Direction = "DOWN" | "UP"
export const DOWN = "DOWN"
export const UP = "UP"


function measureOffsets () {
  console.log("measureOffsets")
  const length = tracked.length
  for (var i = 0; i < length; i++) {
    const target = tracked[i].target
    tracked[i].offset = getOffset(target)
  }
}


function onResize () {
  measureRootData()
  measureOffsets()
  onScroll()
}


function measureRootData () {
  console.log("measureRootData")
  const w = window
  const html = document.documentElement

  root = {
    scrollX: w.scrollX,
    scrollY: w.scrollY,
    scrollHeight: html.scrollHeight, // @note maybe cache
    direction: w.scrollY >= lastScrollY ? DOWN : UP,
    width: html.clientWidth, // * clientWidth vs offsetWidth
    height: html.clientHeight, // @note maybe cache
  }
}


function onScroll () {
  console.log("onScroll")
  const length = tracked.length
  if (!length) return

  root.scrollX = window.scrollX
  root.scrollY = window.scrollY
  root.direction = window.scrollY >= lastScrollY ? DOWN : UP

  for (var i = 0; i < length; i++) {
    // Check the tracked item still exists. This is necessary because removeScrollListener can be called during this loop (eg in the tracked item callback) which mutates the tracked array and can change the length mid-loop.
    if (!tracked[i]) continue

    const { target, cb, offset } = tracked[i]
    cb({ target, offset, root })
  }

  lastScrollY = window.scrollY
}


export function addScrollListener (target: HTMLElement, cb: ScrollCallback) {
  // Don't subscribe the same callback + element multiple times
  if (tracked.some((x) => x.target === target && x.cb === cb)) return

  const offset = getOffset(target) // @todo measure at a better time?
  tracked.push({ target, cb, offset })

  if (!initiated) {
    initiated = true
    addEventListeners()
    onResize()
  } else {
    cb({ target, offset, root }) // Immediately apply callbacks for added target
  }
}


// if cb, ubsub just that cb, otherwise ubsubs all from el
// Remove items from array, removing references to function and elements allowing garbage collection
export function removeScrollListener (target: HTMLElement, cb?: ScrollCallback) {
  if (cb) {
    tracked = tracked.filter((x) => !(x.target === target && x.cb === cb))
  } else {
    tracked = tracked.filter((x) => !(x.target === target))
  }

  // Call onScroll again. This is necessary because removeScrollListener can be called during iteration of the tracked array and can change the length mid-loop.
  onScroll()
}


// function init () {
//   if (initiated) return
//   initiated = true
//   onResize()
//   onScroll()
//   addEventListeners()
// }


export function removeAll () {
  initiated = false
  tracked = []
  removeEventListeners()
}


function addEventListeners () {
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onResize, { passive: true })
}


function removeEventListeners () {
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", onResize)
}


/*

*/
export function intersection (
  {
    target,
    offset,
    root
  }: ScrollData,
  threshold: Threshold = 0
): IntersectionData {
  // Ratio ... 1 is possible even for very tall els, unlike Intersection Observer
  const scrollY = root.scrollY
  const rootTop = root.scrollY + threshold // But never smaller than root.height / 2
  const rootHeight = root.height
  const rootBottom = root.scrollY + root.height - threshold // But never smaller than root.height / 2

  const targetTop = offset.top
  const targetHeight = offset.height
  const targetBottom = offset.top + offset.height

  // Some part of the target is in the viewport when the targetTop edge is < rootBottom and the targetBottom edge > rootTop
  const isIntersecting = targetTop < rootBottom && targetBottom > rootTop

  // Same as IO.entry.isIntersecting
  // If the target is taller than the root you will never get a ratio of 1
  const ratio = isIntersecting
    ? (Math.min(
      rootBottom - targetTop,
      targetBottom - rootTop,
      targetHeight,
      rootHeight
    )) / targetHeight
    : 0

  // Like ratio but normalised*
  // Smooths out the intersection ratio so you always get a linear 0 to 1 to 0 with a guaranteed 1 in the middle and no dead spots where it sits at 1 for a long period of time
  const valueRangeHeight = targetHeight + rootHeight
  const valueRangeTopY = scrollY - targetHeight
  const valueRangeMiddleY = valueRangeTopY + valueRangeHeight / 2

  // This never seems to completely get to 1, it's 0.0025 off in observations
  const value = targetTop > valueRangeMiddleY
    ? 1 - (targetTop - valueRangeMiddleY) / (valueRangeHeight / 2)
    : (targetTop - valueRangeTopY) / (valueRangeHeight / 2)

  return {
    target,
    isIntersecting,
    ratio: clamp(0, ratio, 1),
    value: clamp(0, value, 1),
  }
}
