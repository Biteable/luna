import { query } from "../dom/query"
// import { addScrollListener, removeScrollListener, intersection, ScrollCallback } from "../wip/scrollListener"
import { draggable } from "../util/draggable"

console.log("Draggable demo")

const note = query(".note")
const handle = query(".drag1-handle")

note.innerText = "M"


const Handle = draggable(handle)
let left: number
let top: number

Handle.onStart((e) => {
  e.preventDefault() // Prevent the document itself from scrolling up and down. There are times where you might want that behaviour (eg when implementing a horizontal slider) so this code doesn't force an opinion.
  const styles = window.getComputedStyle(handle)
  left = parseFloat(styles.left)
  top = parseFloat(styles.top)
  requestAnimationFrame(() => {
    note.innerText = `onStart ${left} ${top}`
    handle.classList.add("is-dragging")
  })
})
Handle.onMove((e, dx, dy) => {
  requestAnimationFrame(() => {
    note.innerText = `onMove ${dx} ${dy}`
    handle.style.transform = `translateX(${dx}px) translateY(${dy}px)`
  })
})
Handle.onEnd((e, dx, dy) => {
  left += dx
  top += dy
  requestAnimationFrame(() => {
    note.innerText = `onEnd ${dx} ${dy} ${left} ${top}`
    handle.style.left = `${left}px`
    handle.style.top = `${top}px`
    handle.style.transform = ""
    handle.classList.remove("is-dragging")
  })
})
