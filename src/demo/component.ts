import { find, findAll } from "../dom"
import { component } from "../veneer/component"


const Apple = component(".Apple", (el, { setMethods }) => {
  console.log("Init 🍏")
  const state = {
    clicks: 0
  }

  const button = find(el, "button")
  const count = find(el, "small")
  const click = () => {
    state.clicks++
    count.innerText = state.clicks.toString()
    console.log(`🍏 ${state.clicks} clicks`)
  }
  button.addEventListener("click", click)

  setMethods({ click })
})


const Banana = component(".Banana", (el, { getMethods }) => {
  // console.log("Init 🍌", el)
  const button = find(el, "button")

  const SaladBowl = el.closest(".SaladBowl") as HTMLElement
  if (SaladBowl) {
    button.addEventListener("click", () => getMethods(SaladBowl).then(salad => salad.logFruit()))
  } else {
    console.log("Not in a salad bowl")
  }
})


const SaladBowl = component(".SaladBowl", (el, { getMethods, setMethods }) => {
  const apples = findAll(el, ".Apple") // There's no magic here. If you mess with DOM after this query (eg delete the apple nodes) you'll still have a reference to these Apples
  const buttons = findAll(el, "[data-click-apple]")
  const disconnect = find(el, "[data-disconnect-apples]")

  // Click last apple on mount/init
  getMethods(apples[apples.length - 1]).then(methods => methods.click())

  buttons.forEach((btn, ix) => {
    btn.addEventListener("click", () => {
      getMethods(apples[ix]).then(methods => methods.click())
    })
  })

  setMethods({
    logFruit: () => console.log(findAll(el, ".Apple, .Banana")),
  })

  disconnect.addEventListener("click", Apple.disconnect) // Disconnected Apples can still change their own state based on their own eventListeners
})

// Initiate
SaladBowl.observe()
Apple.observe()
Banana.observe()





























// const Banana = component(".Banana", (el) => {
//   console.log("Init 🍌", el)

//   requestAnimationFrame(() => {
//     el.style.opacity = "0"
//   })

//   let visible: boolean

//   addScrollListener(el, (data) => {
//     if (intersectionRatio(data) > 0.5) {

//       // This prevents this running twice. Which is indicative of removeScrollListener not acting fast enough
//       if (visible) return
//       visible = true

//       removeScrollListener(el) // Remove all scroll listeners on this element

//       stagger("Banana", el, (ix) => {
//         console.log("intersecting", el, ix)

//         setTimeout(() => {
//           requestAnimationFrame(() => {
//             style(el, {
//               opacity: "",
//               transition: "all 0.5s ease-out",
//             })
//           })
//         }, 20 + 100 * ix)
//       })
//     }
//   })
// })
