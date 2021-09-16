import { query, queryAll } from "../dom"
import { addScrollListener, intersectionValue, ScrollCallback, intersectionRatio } from "../util/scrollListener"
import { interpolateRGB, RGBA } from "../wip/color"
import { easeInOutQuad, easeOutQuad, easeInQuad } from "../util/easings"
import { clamp } from "../util/clamp"
import { stagger } from "../util/stagger"


const reddish = [255, 72, 0] as RGBA
const rebeccapurple = [102, 51, 153] as RGBA
const greenyellow = [173, 255, 47] as RGBA


const paragraphs = queryAll("p")
paragraphs.forEach((el, ix, arr) => {
  let prevValue: number

  if (ix === 40) {
    el.style.outline = "5px solid black"
  }

  const onScroll: ScrollCallback = (data) => {
    const { root } = data
    const value = intersectionValue(data, 0)

    // @note Runs also when value is 0
    // @note Avoids writing if the previous value hasn't changed
    if (value === prevValue) return
    prevValue = value

    // @note color transitions based on total page scroll
    const scrollComplete = root.scrollY / (root.scrollHeight - root.height)
    const color1 = interpolateRGB(reddish, [200, 200, 200], scrollComplete)
    const color2 = interpolateRGB(greenyellow, [0, 0, 0], scrollComplete)


    const easedValue = easeInOutQuad(value)

    if (ix === 40) {
      console.log(value)
    }

    // @note interpolate colour based on intersection value
    // @note do as little as possible in the rAF
    // requestAnimationFrame(() => {
    //   el.style.transform = `translateX(${200 * easedValue}px)`
    //   el.style.color = `rgba(${interpolateRGB(color1, color2, easedValue).join(",")})`
    // })

    // @note don't do this on every frame like I am in this demo. Stagger isn't very performant and is best saved for use cases where you set a class once and want to stagger the fade in.
    // const staggerNamespace = `p-${data.offset.top}`
    // stagger(staggerNamespace, el, (i, len) => {
    //   requestAnimationFrame(() => {
    //     el.style.transform = `translateX(${100 * easedValue}px) translateY(${i * 16}px)`
    //     el.style.color = `rgba(${interpolateRGB(color1, color2, easedValue).join(",")})`
    //   })
    // })

    // const staggerNamespace = `p-${data.entry.top}`
    // stagger(staggerNamespace, el, (i, len) => {
      requestAnimationFrame(() => {
        el.style.transform = `translateX(${100 * easedValue}px)`
        el.style.color = `rgba(${interpolateRGB(color1, color2, easedValue).join(",")})`
      })
    // })

    // scheduleAnimationFrame(el, (staggerIndex) => {
    //   // setTimeout(() => {
    //     el.style.transform = `translateX(${200 * easedValue * (staggerIndex * 10)}px)`
    //     el.style.color = `rgba(${interpolateRGB(color1, color2, easedValue).join(",")})`
    //   // }, )
    // })
  }
  addScrollListener(el, onScroll)
})


// ---

const nav = query("nav")

let lastScrollY: number = window.scrollY
let lastY: number = 0
let y: number = 0

addScrollListener(nav, ({ entry, root }) => {
  y = clamp(0, y + root.scrollY - lastScrollY, entry.height)

  if (lastY !== y) {
    requestAnimationFrame(() => {
      nav.style.transform = `translateY(-${y}px)`
    })
  }

  lastScrollY = root.scrollY
  lastY = y
})
