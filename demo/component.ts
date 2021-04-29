import { find } from "../dom/query"
import { component } from "../veneer/component"
import { addScrollListener, removeScrollListener, intersection } from "../util/scrollListener"
import { style } from "../dom/style"
import { stagger } from "../util/stagger"


const Apple = component(".Apple", (el) => {
  const button = find(el, "button")
  button.addEventListener("click", () => {
    console.log("Apple")
  })
})


const Banana = component(".Banana", (el) => {
  console.log("init", el)

  requestAnimationFrame(() => {
    el.style.opacity = "0"
  })

  let visible: boolean

  addScrollListener(el, (data) => {
    if (intersection(data).ratio > 0.5) {

      // This prevents this running twice. Which is indicative of removeScrollListener not acting fast enough
      if (visible) return
      visible = true

      removeScrollListener(el) // Remove all scroll listeners on this element

      stagger("Banana", el, (ix) => {
        console.log("intersecting", el, ix)

        setTimeout(() => {
          requestAnimationFrame(() => {
            style(el, {
              opacity: "",
              transition: "all 0.5s ease-out",
            })
          })
        }, 20 + 100 * ix)
      })
    }
  })
})


// Initiate
Apple.observe()
Banana.observe()