type OnStartEvent = (e: Event) => any
type OnMoveEvent = (e: Event, dx: number, dy: number) => any
type OnEndEvent = (e: Event, dx: number, dy: number) => any


export function draggable (el: HTMLElement) {
  let startX: number
  let startY: number
  let dX: number
  let dY: number

  el.addEventListener("mousedown", _onStart)
  el.addEventListener("touchstart", _onStart)

  const noop = () => {}

  let onstart: OnStartEvent = noop
  let onmove: OnMoveEvent = noop
  let onend: OnEndEvent = noop

  return {
    onstart (cb: OnStartEvent) { onstart = cb },
    onmove (cb: OnMoveEvent) { onmove = cb },
    onend (cb: OnEndEvent) { onend = cb },
    removeListeners () {
      el.removeEventListener("mousedown", _onStart)
      el.removeEventListener("touchstart", _onStart)
    }
  }


  function _onStart (e: MouseEvent | TouchEvent) {
    [startX, startY] = positions(e)
    if (onstart(e) !== false) addGlobalListeners() // return false to abort drag
  }


  function _onMove (e: MouseEvent | TouchEvent) {
    const [clientX, clientY] = positions(e)
    dX = clientX - startX
    dY = clientY - startY
    onmove(e, dX, dY)
  }


  function _onEnd (e: MouseEvent | TouchEvent) {
    // This is called by both mouseup and touchend. However touchend does not have touch positions in the event so we can't get the last position the user *was* touching from this event.
    onend(e, dX, dY)
    startX = undefined
    startY = undefined
    dX = undefined
    dY = undefined
    removeGlobalListeners()
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


  // We bind events to window because window continues to fire events when the cursor is outside the viewport.


  function addGlobalListeners () {
    window.addEventListener("mousemove", _onMove)
    window.addEventListener("mouseup", _onEnd)
    window.addEventListener("touchmove", _onMove)
    window.addEventListener("touchend", _onEnd)
  }


  function removeGlobalListeners () {
    window.removeEventListener("mousemove", _onMove)
    window.removeEventListener("mouseup", _onEnd)
    window.removeEventListener("touchmove", _onMove)
    window.removeEventListener("touchend", _onEnd)
  }
}


// function isLeftClick(e: Event) {
//   if (e.type.indexOf("mouse") === 0) {
//     return (e as MouseEvent).button === 0
//   }
// }

// function isCtrlKeyPressed(e: Event) {
//   if (e.type.indexOf("mouse") === 0) {
//     return (e as MouseEvent).ctrlKey
//   }
// }
