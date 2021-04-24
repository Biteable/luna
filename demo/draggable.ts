import { query } from "../dom/query"
import { draggable } from "../util/draggable"


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
