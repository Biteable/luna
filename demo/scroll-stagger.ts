import { queryAll } from "../dom/query"
import { addScrollListener, removeScrollListener, intersection, ScrollCallback } from "../wip/scrollListener"
// import { scheduleAnimationFrame } from "../util/scheduleAnimationFrame"
import { stagger } from "../util/scheduleAnimationFrame"


queryAll(".card").forEach((el, ix, arr) => {
  let done: boolean
  const onscroll: ScrollCallback = (data) => {
    if (intersection(data).ratio > 0.75) {
      // removeScrollListener(el, onscroll) // @todo fix...
      // el.classList.add("is-visible")
      if (done) return
      done = true

      const namespace = "card" + data.offset.top
      stagger(namespace, el, (ix) => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            el.classList.add("is-visible")
          })
        }, ix * 100)
      })
    }
  }
  addScrollListener(el, onscroll)
})
