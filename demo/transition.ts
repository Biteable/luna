import { transition } from "../wip/transition"
import { query } from "../dom/query"
import { addClass, removeClass } from "../dom/class"
// import {  }


const nav = query("nav")
const showBtn = query("[data-action=show]")
const hideBtn = query("[data-action=hide]")

document.addEventListener("keyup", (e) => {
  if (e.key === "s") show()
  if (e.key === "j") show()
  if (e.key === "h") hide()
})

showBtn.addEventListener("click", show)
hideBtn.addEventListener("click", hide)


function show () {
  transition(nav, {
    setup: () => {
      console.log("show::setup")
    },
    trigger: () => {
      console.log("show::trigger")
      addClass(nav, "is-transitioning", "is-visible")
    },
    end: () => {
      console.log("show::end")
      removeClass(nav, "is-transitioning")
    },
  })
}

function hide () {
  transition(nav, {
    setup: () => { console.log("hide::start") },
    trigger: () => {
      console.log("hide::trigger")
      addClass(nav, "is-transitioning")
      removeClass(nav, "is-visible")
    },
    end: () => {
      console.log("hide::end")
      removeClass(nav, "is-transitioning")
    },
  })
}