import { query, queryAll } from "../dom/query"
import { addScrollListener, intersection, ScrollCallback } from "../wip/scrollListener"
import { interpolateRGB, RGBA } from "../wip/color"
import { easeInOutQuad, easeOutQuad, easeInQuad } from "../util/easings"
import { clamp } from "../math/clamp"
import { scheduleAnimationFrame } from "../util/scheduleAnimationFrame"

const paragraphs = queryAll("p")
console.log(paragraphs)

const reddish = [255, 72, 0] as RGBA
const rebeccapurple = [102, 51, 153] as RGBA
const greenyellow = [173, 255, 47] as RGBA

// paragraphs.forEach(el => {
//   let prev: number
//   const onScroll: ScrollCallback = (data) => {
//     const { value } = intersection(data)

//     // @note Runs also when value is 0
//     // @note Avoids writing if the previous value hasn't changed

//     if (value === prev) return
//     prev = value

//     const easedValue = easeInOutQuad(value)


//     // @note do as little as possible in the rAF
//     requestAnimationFrame(() => {
//       el.style.transform = `translateX(${200 * easedValue}px)`
//       el.style.color = `rgba(${interpolateRGB(reddish, greenyellow, easedValue).join(",")})`
//     })
//   }
//   addScrollListener(el, onScroll)
// })

paragraphs.forEach(el => {
  let prev: number
  const onScroll: ScrollCallback = (data) => {
    const { root } = data
    const { value } = intersection(data)

    // @note Runs also when value is 0
    // @note Avoids writing if the previous value hasn't changed

    if (value === prev) return
    prev = value

    // @note color transitions based on total page scroll
    const scrollComplete = root.scrollY / (root.scrollHeight - root.height)
    const color1 = interpolateRGB(reddish, [200, 200, 200], scrollComplete)
    const color2 = interpolateRGB(greenyellow, [0, 0, 0], scrollComplete)


    const easedValue = easeInOutQuad(value)

    // @note interpolate colour based on intersection value
    // @note do as little as possible in the rAF
    // requestAnimationFrame(() => {
    //   el.style.transform = `translateX(${200 * easedValue}px)`
    //   el.style.color = `rgba(${interpolateRGB(color1, color2, easedValue).join(",")})`
    // })
    scheduleAnimationFrame(el, (staggerIndex) => {
      // setTimeout(() => {
        el.style.transform = `translateX(${200 * easedValue * (staggerIndex * 10)}px)`
        el.style.color = `rgba(${interpolateRGB(color1, color2, easedValue).join(",")})`
      // }, )
    })
  }
  addScrollListener(el, onScroll)
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