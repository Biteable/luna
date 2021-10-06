import { query, queryAll, find, findAll, addClass, removeClass, css } from "../dom"
import { motion, motion2 } from "../wip/motion"

// const el = query("#one")
// const els = queryAll(".many")

// // Add styles to a single el.
// css(el, { top: "100px", left: "" })

// // Many
// els
//   .map(x => css(x, { left: "" }))      // Remove inline css from all
//   .map(x => removeClass(x, "active"))   // Remove active class from all
// // .filter(x => x === el)                // Filter list to just #one
// // .map(x => addClass(x, "active"))      // Add active class to #one
// // .map(x => css(x, { left: "100px" }))  // Add styles to #one

// // Single
// addClass(el, "active")
// css(el, { left: "100px" })


const runBtn = document.querySelector("[data-run]") as HTMLButtonElement
const card = document.querySelector(".befaux .card") as HTMLElement

const motionBtns = Array.from(document.querySelectorAll("[data-motion]")) as HTMLButtonElement[]
const testEls = Array.from(document.querySelectorAll(".befaux > div")) as HTMLElement[]

motionBtns.forEach((el, ix) => {
  el.addEventListener("click", () => {
    console.log(testEls[ix], el)
    motion2(testEls[ix], "end")
  })
})

runBtn.addEventListener("click", () => {
  motion(card, "end")
})
