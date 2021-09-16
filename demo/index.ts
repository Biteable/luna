import { query, queryAll, find, findAll } from "../dom/query"
import { style, styles } from "../dom/style"
import { addClass, addsClass, removeClass, removesClass } from "../dom/class"
import { pipe, pipes } from "../util/pipe"

const el = query("#one")
const els = queryAll(".many")

// const child = find(el, ".child")

// Add styles to a single el.
style(el, { top: "100px", left: "" })

// Piping
pipe(el,
  styles({ left: "" }),
  removesClass("previous"),
  addsClass("current"),
  styles({ top: "100%", opacity: "1" })
)

// Same as:
const setCurrent = pipes(
  styles({ left: "" }),
  removesClass("previous"),
  addsClass("current"),
  styles({ top: "100%", opacity: "1" })
)
setCurrent(el)


// Many
els.map(x => style(x, { left: "" }))        // Remove inline styles from all
  .map(x => removeClass(x, "active"))       // Remove active class from all
  .filter(x => x === el)                    // Filter list to just #one
  .map(el => addClass(el, "active"))        // Add active class to #one
  .map(el => style(el, { left: "100px" }))  // Add styles to #one

// Many using curried functions
els.map(styles({ left: "" }))
  .map(removesClass("active"))
  .filter(x => x === el)
  .map(addsClass("active"))
  .map(styles({ left: "100px" }))
