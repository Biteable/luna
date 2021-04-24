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

  let onStart: OnStartEvent = noop
  let onMove: OnMoveEvent = noop
  let onEnd: OnEndEvent = noop

  return {
    onStart (cb: OnStartEvent) { onStart = cb },
    onMove (cb: OnMoveEvent) { onMove = cb },
    onEnd (cb: OnEndEvent) { onEnd = cb },
    removeListeners () {
      el.removeEventListener("mousedown", _onStart)
      el.removeEventListener("touchstart", _onStart)
    }
  }


  function _onStart (e: MouseEvent | TouchEvent) {
    [startX, startY] = positions(e)
    onStart(e)
    addBodyListeners()
  }


  function _onMove (e: MouseEvent | TouchEvent) {
    const [clientX, clientY] = positions(e)
    dX = clientX - startX
    dY = clientY - startY
    onMove(e, dX, dY)
  }


  function _onEnd (e: MouseEvent | TouchEvent) {
    // This is called by both mouseup and touchend, the latter of which does not have touch positions in the event so we can't get the last position the user *was* touching from this event.
    onEnd(e, dX, dY)
    startX = undefined
    startY = undefined
    dX = undefined
    dY = undefined
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


  // We bind events to window because window continues to fire events when the cursor is outside the viewport.


  function addBodyListeners () {
    window.addEventListener("mousemove", _onMove)
    window.addEventListener("mouseup", _onEnd)
    window.addEventListener("touchmove", _onMove)
    window.addEventListener("touchend", _onEnd)
  }


  function removeBodyListeners () {
    window.removeEventListener("mousemove", _onMove)
    window.removeEventListener("mouseup", _onEnd)
    window.removeEventListener("touchmove", _onMove)
    window.removeEventListener("touchend", _onEnd)
  }
}
