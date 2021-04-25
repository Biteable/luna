import { query } from "../dom/query"
import { draggable } from "../util/draggable"
import { clamp } from "../util/clamp"

const note = query(".note")
note.innerText = "M"


{
  // Drag anywhere example

  let left: number
  let top: number

  const handle = query(".drag-anywhere-handle")
  console.log(handle)

  const Drag = draggable(handle)

  Drag.onstart((e) => {
    e.preventDefault() // Prevent the document itself from scrolling up and down. There are times where you might want that behaviour (eg when implementing a horizontal slider) so draggable leaves this up to you.

    // At the start of a drag we measure and save the left/top offsets
    const styles = window.getComputedStyle(handle)
    left = parseFloat(styles.left)
    top = parseFloat(styles.top)

    requestAnimationFrame(() => {
      handle.classList.add("is-dragging")
    })
  })

  Drag.onmove((e, dx, dy) => {
    // dx and xy represent the change from the initial start position
    // During a drag we set these in a transform
    requestAnimationFrame(() => {
      handle.style.transform = `translateX(${dx}px) translateY(${dy}px)`
    })
  })

  Drag.onend((e, dx, dy) => {
    // At the end of a drag we save the new left/top offsets by adding the dx/dy
    left += dx
    top += dy
    // And finally remove the transforms and reset the left/top to the final position
    requestAnimationFrame(() => {
      handle.style.left = `${left}px`
      handle.style.top = `${top}px`
      handle.style.transform = ""
      handle.classList.remove("is-dragging")
    })
  })
}


{
  // Drag constrained to area

  // In this example we track the left and top positions of the handle as percentages (0-1) relative to its container. This keeps the math simple and lets us clamp the values between 0 and 1.

  const handle = query(".drag-constrained-handle")
  const container = query(".drag-constrained")
  const Drag = draggable(handle)

  let handleInitialLeft: number
  let handleInitialTop: number
  let containerWidth: number
  let containerHeight: number
  let handleLeftPercent: number
  let handleTopPercent: number

  Drag.onstart(() => {
    const containerRect = container.getBoundingClientRect()

    // Record initial ppsitions and dimensions
    handleInitialLeft = handle.offsetLeft
    handleInitialTop = handle.offsetTop
    containerWidth = containerRect.width
    containerHeight = containerRect.height

    requestAnimationFrame(() => {
      handle.classList.add("is-dragging")
    })
  })

  Drag.onmove((e, dx, dy) => {
    // Calculate the position of the handle as a percentage from 0 to 1
    const left = (handleInitialLeft + dx) / containerWidth
    const top = (handleInitialTop + dy) / containerHeight

    // Clamp to no less that 0 and no greater than 1 and save to variables
    handleLeftPercent = clamp(0, left, 1)
    handleTopPercent = clamp(0, top, 1)

    // Run DOM writes in rAF
    requestAnimationFrame(() => {
      handle.style.left = "0"
      handle.style.top = "0"
      handle.style.transform = `
        translateX(${handleLeftPercent * containerWidth}px)
        translateY(${handleTopPercent * containerHeight}px)
      `
    })
  })

  Drag.onend(() => {
    // Remove transforms and use left/top to set final position
    requestAnimationFrame(() => {
      handle.style.left = handleLeftPercent * 100 + "%"
      handle.style.top = handleTopPercent * 100 + "%"
      handle.style.transform = ""
      handle.classList.remove("is-dragging")
    })
  })
}
