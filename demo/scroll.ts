import { query, queryAll } from "../dom/query"
import { add as addScrollListener, intersection, up, down } from "../wip/scrollwatch"
import { interpolateRGB, RGBA } from "../wip/color"
import { easeInOutQuad, easeOutQuad, easeInQuad } from "../util/easings"
import { clamp } from "../math/clamp"
import { offset } from "../dom/offset"

const paragraphs = queryAll("p")
console.log(paragraphs)

const reddish = [255, 72, 0] as RGBA
const rebeccapurple = [102, 51, 153] as RGBA
const greenyellow = [173, 255, 47] as RGBA

paragraphs.forEach(el => {
  let prev: number

  addScrollListener(el, (data) => {
    const { value } = intersection(data)

    // @note Run also when value is 0
    // @note Avoid writing if the previous value hasn't changed

    if (value === prev) return
    prev = value

    const easedValue = easeInOutQuad(value)

    // @note do as little as possible in the rAF
    requestAnimationFrame(() => {
      el.style.transform = `translateX(${200 * easedValue}px)`
      el.style.color = `rgba(${interpolateRGB(reddish, greenyellow, easedValue).join(",")})`
    })
  })
})


// ---

const nav = query("nav")

let lastScrollY: number = window.scrollY
let lastY: number = 0
let y: number = 0

addScrollListener(nav, ({ offset, root }) => {
  y = clamp(0, y + root.scrollY - lastScrollY, offset.height)

  if (lastY !== y) {
    requestAnimationFrame(() => {
      nav.style.transform = `translateY(-${y}px)`
    })
  }

  lastScrollY = root.scrollY
  lastY = y
})