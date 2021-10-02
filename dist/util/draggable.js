export function draggable(el) {
    let startX;
    let startY;
    let dX;
    let dY;
    el.addEventListener("mousedown", _onStart);
    el.addEventListener("touchstart", _onStart);
    const noop = () => { };
    let onstart = noop;
    let onmove = noop;
    let onend = noop;
    return {
        onstart(cb) { onstart = cb; },
        onmove(cb) { onmove = cb; },
        onend(cb) { onend = cb; },
        removeListeners() {
            el.removeEventListener("mousedown", _onStart);
            el.removeEventListener("touchstart", _onStart);
        }
    };
    function _onStart(e) {
        [startX, startY] = positions(e);
        if (onstart(e) !== false)
            addGlobalListeners(); // return false to abort drag
    }
    function _onMove(e) {
        const [clientX, clientY] = positions(e);
        dX = clientX - startX;
        dY = clientY - startY;
        onmove(e, dX, dY);
    }
    function _onEnd(e) {
        // This is called by both mouseup and touchend. However touchend does not have touch positions in the event so we can't get the last position the user *was* touching from this event.
        onend(e, dX, dY);
        startX = undefined;
        startY = undefined;
        dX = undefined;
        dY = undefined;
        removeGlobalListeners();
    }
    function positions(e) {
        if (e.type.indexOf("mouse") === 0) {
            e = e;
            return [e.clientX, e.clientY];
        }
        else {
            e = e;
            if (e.touches.length > 0) {
                return [e.touches[0].clientX, e.touches[0].clientY];
            }
        }
        return [NaN, NaN];
    }
    // We bind events to window because window continues to fire events when the cursor is outside the viewport.
    function addGlobalListeners() {
        window.addEventListener("mousemove", _onMove);
        window.addEventListener("mouseup", _onEnd);
        window.addEventListener("touchmove", _onMove);
        window.addEventListener("touchend", _onEnd);
    }
    function removeGlobalListeners() {
        window.removeEventListener("mousemove", _onMove);
        window.removeEventListener("mouseup", _onEnd);
        window.removeEventListener("touchmove", _onMove);
        window.removeEventListener("touchend", _onEnd);
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
//# sourceMappingURL=draggable.js.map