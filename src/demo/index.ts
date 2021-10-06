import { query, queryAll, find, findAll, addClass, removeClass, css } from "../dom"

const el = query("#one")
const els = queryAll(".many")

// Add styles to a single el.
css(el, { top: "100px", left: "" })

// Many
els
  .map(x => css(x, { left: "" }))      // Remove inline css from all
  .map(x => removeClass(x, "active"))   // Remove active class from all
// .filter(x => x === el)                // Filter list to just #one
// .map(x => addClass(x, "active"))      // Add active class to #one
// .map(x => css(x, { left: "100px" }))  // Add styles to #one

// Single
addClass(el, "active")
css(el, { left: "100px" })
