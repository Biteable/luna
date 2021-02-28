/*

  Use cases:

  - Imgset
  - Nav positioned/transformed based on scroll offset
  - component/veneer
  - IO behaviour
  - Works with elements with fixed positions; ie, their offset relative to the document _does_ change as the page scrolls
  - parallax and animation tweening
  - TOC behaviour

  requestAnimationFrame
  ---------------------

  Callbacks should calculate whether they are going to update the DOM, and only if they will do so should they wrap the DOM change in rAF, eg:

  ```
    if (offset.top > someValue) {
      requestAnimationFrame(writeLayout)
    }
  ```

  Or

  ```
  const onscroll = (data) => {
    if (intersecting(data)) {
      requestAnimationFrame(() => { el.classList.add("Hello!") })
    }
  }
  add(el, onscroll)


  https://stackoverflow.com/a/44779316


  clientWidth vs offsetWidth
  --------------------------

  tl;dr clientWidth is the inner containing area excluding the scrollbar, probably what we want for the root dimensions

  https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth
*/

// import { debounce } from "../util/debounce"
import { offset, OffsetData } from "../dom/offset"
import { clamp } from "../math/clamp"


// @todo exports utility methods like intersects
// @polyfill Array.includes


interface RootData {
  scrollX: number
  scrollY: number
  direction: Down | Up
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

type Down = "+"
type Up = "-"
type ScrollCallback = (data: ScrollData) => any
type Threshold = number //

// @todo returns intersecting data:
// This will let you easily
// - intersection ratio: 0–1
// - position in screen relative to intersection?
// What does IO entry give you?


function intersection (
  {
    target,
    offset,
    root
  }: ScrollData,
  threshold: Threshold = 0
): IntersectionData {
  // Ratio ... 1 is possible even for very tall els, unlike IO
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



// Scroll Watch
// ============

let initiated = false
let tracked: TrackedData[] = []
let lastScrollY: number


const down: Down = "+"
const up: Up = "-"


function measureOffsets () {
  const length = tracked.length
  for (var i = 0; i < length; i++) {
    const target = tracked[i].target
    tracked[i].offset = offset(target)
  }
}


function onResize () {
  // console.log("onResize")
  measureOffsets()
  onScroll()
}


function onScroll () {
  // console.log("onScroll")
  const w = window
  const html = document.documentElement
  const root: RootData = {
    scrollX: w.scrollX,
    scrollY: w.scrollY,
    direction: w.scrollY >= lastScrollY ? down : up,
    width: html.clientWidth, // * clientWidth vs offsetWidth
    height: html.clientHeight,
  }

  const length = tracked.length
  for (var i = 0; i < length; i++) {
    const { target, cb, offset } = tracked[i]
    cb({ target, offset, root })
  }

  lastScrollY = w.scrollY
}


function add (target: HTMLElement, cb: ScrollCallback) {
  // console.log("add")

  // Don't subscribe the same callback + element multiple times
  if (tracked.some((x) => x.target === target && x.cb === cb)) return

  tracked.push({
    target,
    cb,
    offset: offset(target) // @todo measure at a better time?
  })

  init()
  onScroll() // @todo if we measure offsets in this add method, we only need to apply callbacks for the current target

  // @todo Maybe measure and run post subscribe?
  // @todo Maybe initiate and add listeners here?
}


// if cb, ubsub just that cb, otherwise ubsubs all from el
// Remove items from array, removing references to function and elements allowing garbage collection
function remove (target: HTMLElement, cb?: ScrollCallback) {
  if (cb) {
    tracked = tracked.filter((x) => !(x.target === target && x.cb === cb))
  } else {
    tracked = tracked.filter((x) => !(x.target === target))
  }
}


function init () {
  if (initiated) return
  initiated = true
  onResize()
  onScroll()
  addEventListeners()
}


function uninit () {
  initiated = false
  tracked = []
  removeEventListeners()
}


function addEventListeners () {
  window.addEventListener("scroll", onScroll)
  window.addEventListener("resize", onResize)
}


function removeEventListeners () {
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", onResize)
}


// Utils

// @todo add threshold options, maybe a single number, maybe x/y, maybe top/bottom
function intersecting ({ offset, root }, threshold?: any) {
  threshold = 0 // @todo use threshold
  return offset.top - threshold <= root.scrollY + root.height && offset.top + threshold + offset.height >= scrollY
}


// Exports

export { add, remove, uninit, down, up, intersecting, intersection }

// ---

const addOnce = (
  el: HTMLElement,
  intersectingFunc: ScrollCallback,
  cb: () => any
) => {
  const once: ScrollCallback = data => {
    if (intersectingFunc(data)) {
      cb()
      remove(el, once)
    }
  }
  add(el, once)
}



const component = () => {
  const el = document.querySelector(".Component") as HTMLElement

  const doThisOnce = () => {
    requestAnimationFrame(() => {
      el.classList.add("Hello! I'm visible!")
    })
  }
  const isIntersecting: ScrollCallback = (data) => intersecting(data, -1000)
  addOnce(el, isIntersecting, doThisOnce)

  // Or

  // addOnce(el, )

  // ---

  const once: ScrollCallback = data => {
    if (intersecting(data, "-50%")) {
      requestAnimationFrame(() => {
        el.classList.add("Hello! I'm visible!")
      })
      remove(el, once)
    }
  }

  const every: ScrollCallback = data => {
    if (intersecting(data)) {
      console.log(`Yewwww, the scroll is ${data.root.scrollY} in the ${data.root.direction} direction.`)
    }
  }

  let prev: boolean
  const onchange: ScrollCallback = data => {
    const curr = intersecting(data)
    if (curr !== prev) {
      console.log(`Woah, different! I am now ${curr ? "" : "not"} intersecting.`)
      prev = curr
    }
  }

  add(el, once)
  add(el, every)
  add(el, onchange)

  return () => {
    remove(el) // Remove all scroll listeners
  }
}
