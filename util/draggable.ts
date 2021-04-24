

export function draggable (el: HTMLElement) {
  // let isDragging = false
  let startX: number
  let startY: number

  el.addEventListener("mousedown", onStart)
  el.addEventListener("touchstart", onStart)

  let start: () => any
  let move: (dx: number, dy: number) => any
  let end: (dx: number, dy: number) => any

  return {
    start (cb: () => any) { start = cb },
    move (cb: (dx: number, dy: number) => any) { move = cb },
    end (cb: (dx: number, dy: number) => any) { end = cb },
    removeListeners () {
      el.removeEventListener("mousedown", onStart)
      el.removeEventListener("touchstart", onStart)
    }
  }

  function onStart (e: MouseEvent | TouchEvent) {
    [startX, startY] = positions(e)
    start()
    onMove(e)
    addBodyListeners()
  }

  function onMove (e: MouseEvent | TouchEvent) {
    e.preventDefault()
    const [clientX, clientY] = positions(e)
    const dx = clientX - startX
    const dy = clientY - startY
    // I think this is needed on iOS?
    // Can't remember
    // if (!isDragging) {
    //   start(dx, dy)
    //   isDragging = true
    // } else {
    move(dx, dy)
    // }
    // console.log("Moving...", dx, dy, e.type)
  }

  function onEnd (e: MouseEvent | TouchEvent) {
    const [clientX, clientY] = positions(e)
    const dx = clientX - startX
    const dy = clientY - startY
    // console.log("Move ended.")
    end(dx, dy)
    // isDragging = false
    startX = undefined
    startY = undefined
    removeBodyListeners()
  }

  function positions (e: MouseEvent | TouchEvent) {
    if (e.type.indexOf("mouse") === 0) {
      e = e as MouseEvent
      return [e.clientX, e.clientY]
    } else {
      e = e as TouchEvent
      if (e.touches.length > 0) {
        return [e.touches[0].clientX, e.touches[0].clientY]
      }
    }
    return [NaN, NaN]
  }

  function addBodyListeners () {
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onEnd)
    window.addEventListener("mouseleave", onEnd)
    window.addEventListener("touchmove", onMove)
    window.addEventListener("touchend", onEnd)
  }

  function removeBodyListeners () {
    window.removeEventListener("mousemove", onMove)
    window.removeEventListener("mouseup", onEnd)
    window.removeEventListener("mouseleave", onEnd)
    window.removeEventListener("touchmove", onMove)
    window.removeEventListener("touchend", onEnd)
  }
}
