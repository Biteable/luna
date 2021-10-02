import { offset as getOffset, OffsetData } from "../dom"
import { clamp, debounce } from "../util"


interface RootData {
  scrollX?: number
  scrollY?: number
  scrollHeight?: number
  direction?: Direction
  width?: number
  height?: number
}

interface Entry {
  target: HTMLElement
  // Offsets are relative to the document, not the viewport.
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
}

interface TrackedEntryData {
  entry: Entry
  cb: ScrollCallback
}

interface ScrollData {
  root: RootData
  entry: Entry
}

export type ScrollCallback = (data: ScrollData) => any
type Threshold = number // @todo... remove? Implement in `intersection` method
type Direction = "DOWN" | "UP"
export const DOWN: Direction = "DOWN"
export const UP: Direction = "UP"


let initiated = false
let entries: TrackedEntryData[] = []
let lastScrollY: number
let root: RootData = {}
let domObserver: MutationObserver


export function update () {
  // console.log("::update")
  measureRootData()
  measureOffsets()
  onScroll()
}


const debouncedOnResize = debounce(update, 250)


function measureOffsets () {
  for (let i = 0; i < entries.length; i++) {
    Object.assign(entries[i].entry, getOffset(entries[i].entry.target))
  }
}


function measureRootData () {
  // console.log("::measureRootData")
  const w = window
  const html = document.documentElement

  root.scrollX = w.scrollX
  root.scrollY = w.scrollY
  root.scrollHeight = html.scrollHeight // @note maybe cache
  root.direction = w.scrollY >= lastScrollY ? DOWN : UP
  root.width = html.clientWidth // * clientWidth vs offsetWidth
  root.height = html.clientHeight // @note maybe cache
}


function onScroll () {
  const length = entries.length
  if (!length) return

  // console.log("::onScroll")

  // Update root data
  root.scrollX = window.scrollX
  root.scrollY = window.scrollY
  root.direction = window.scrollY >= lastScrollY ? DOWN : UP

  // Iterate in reverse order so that elements that are removed don't mess the indexes of other entries
  for (let i = length - 1; i >= 0; i--) {
    // Check the tracked item still exists. This is necessary because removeScrollListener can be called during this loop (eg in the tracked item callback) which mutates the tracked array and can change the length mid-loop.
    const obj = entries[i]
    if (!obj) continue

    const { entry, cb } = obj
    cb({ entry, root })
  }
}


export function addScrollListener (target: HTMLElement, cb: ScrollCallback) {
  // Don't subscribe the same callback + element multiple times
  if (entries.some((obj) => obj.entry.target === target && obj.cb === cb)) {
    console.error("addScrollListener: target already subscribed with callback")
    return
  }

  const entry: Entry = Object.assign({ target }, getOffset(target))
  entries.push({ entry, cb })

  if (!initiated) {
    initiated = true
    update()
    addEventListeners()
  }

  cb({ entry, root }) // Immediately apply callbacks for added target
}


// If a callback is passed, ubsubcribe just that callback, otherwise ubsubscribe the target element completely
export function removeScrollListener (target: HTMLElement, cb?: ScrollCallback) {
  if (cb) {
    entries = entries.filter((obj) => !(obj.entry.target === target && obj.cb === cb))
  } else {
    entries = entries.filter((obj) => !(obj.entry.target === target))
  }
}


export function removeAll () {
  initiated = false
  entries = []
  removeEventListeners()
}


function addEventListeners () {
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", update, { passive: true })
  domObserver = new MutationObserver(debouncedOnResize)
  domObserver.observe(document.documentElement, { attributes: false, childList: true, subtree: true })
}


function removeEventListeners () {
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", update)
  domObserver.disconnect()
}

// Right now rootMargin sets both vertical directions (top and bottom) evenly. Later we might want to add top and bottom values separately.
// Just like with IntersectionObserver, rootMargin is a negative value if you want the root ... @todo check this.
export const isIntersecting = (data: ScrollData, rootMargin: number = 0): boolean => {
  const { entry, root } = data
  const rootTop = root.scrollY + rootMargin
  const rootBottom = root.scrollY + root.height - rootMargin

  return entry.top < rootBottom && entry.top + entry.height > rootTop
}


// Just like with IO.entry.isIntersecting, if the target element is taller than the root you will never get a ratio of 1.
export const intersectionRatio = (data: ScrollData, rootMargin: number = 0): number => {
  if (!isIntersecting(data, rootMargin)) return 0

  const { entry, root } = data

  if (entry.height === 0) return 0

  const rootTop = root.scrollY + rootMargin
  const rootBottom = root.scrollY + root.height - rootMargin
  const overlap = Math.min(rootBottom - entry.top, entry.top + entry.height - rootTop, entry.height, root.height)

  return clamp(0, overlap / entry.height, 1)
}


// Like intersectionRatio but normalised so that you always get a linear 0 to 1 value; eg 0 when target element is about to enter the viewport to 1 when the vertical center of the target aligns with the vertical center of the root.
export const intersectionValue = (data: ScrollData, rootMargin: number = 0): number => {
  if (!isIntersecting(data, rootMargin)) return 0

  const { entry, root } = data
  const rootTopY = root.scrollY - (entry.height / 2) + rootMargin
  const rootBottomY = root.scrollY + (entry.height / 2) + root.height - rootMargin
  const rootHeight = rootBottomY - rootTopY
  const rootMiddleY = rootTopY + rootHeight / 2
  const entryMiddleY = entry.top + (entry.height / 2)

  if (entryMiddleY === rootMiddleY) return 1
  if (entryMiddleY < rootMiddleY) return 1 - (rootMiddleY - entryMiddleY) / (rootHeight / 2)
  if (entryMiddleY > rootMiddleY) return 1 + (rootMiddleY - entryMiddleY) / (rootHeight / 2)
}
