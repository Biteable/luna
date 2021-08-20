import { queryAll } from "../dom/query"
import { addScrollListener, removeScrollListener, intersection, ScrollCallback } from "../util/scrollListener"
import { stagger } from "../util/stagger"


queryAll(".card").forEach((el) => {
  // let done = false
  const onscroll: ScrollCallback = (data) => {
    if (intersection(data).ratio > 0.2) {
      // Remove immediately so we do this only once on a matching intersection
      removeScrollListener(el, onscroll)
      // if (done) return
      // done = true

      // Create a namespace that so that only elements with this same namespace that also have a stagger callback scheduled for the same paint frame get treated as stagger siblings
      const namespace = "card" + data.entry.top

      // Call stagger. In this case we are delaying the adding of a classname so that elements animate in a sequence
      stagger(namespace, el, (ix) => {
        // ix is the (0 based) index of this element in it's siblings
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
