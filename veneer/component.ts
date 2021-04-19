import { exists } from "../util/exists"

let initiated = false
const registeredComponents: { [name: string]: registeredComponent } = {}



function initDomObserver () {
  if (initiated) return
  initiated = true
  // const debouncedCallback = debounce(onDomChange, 250)
  // const observer = new MutationObserver(debouncedCallback)
  // observer.observe(document.documentElement, { attributes: false, childList: true, subtree: true })
}


function onDomChange () {
  // if (debug) console.log("DOM change")
  // Object.keys(registeredComponents).forEach(updateComponents)
}


type mountFn = (el: HTMLElement, hooks: componentHooks) => unmountFn
type unmountFn = void | (() => void)
type mountedEntry = [HTMLElement, unmountFn, () => void]


interface registeredComponent {
  selector: string
  mountFn: mountFn,
  liveList: HTMLCollection | undefined
  mounted: mountedEntry[]
}

interface componentHooks {
  enterViewport: (threshold: string | number, callback: (entry: IntersectionObserverEntry) => void) => void
  intersection: (args: IntersectionObserverInit, callback: (entry: IntersectionObserverEntry, disconnect: () => void) => void) => void
}

function registerComponent (selector: string, mountFn: mountFn) {
  const classname = classnameFromSelector(selector)

  // An empty liveList is HTMLCollection [] while no liveList at is undefined
  registeredComponents[selector] = {
    selector,
    mountFn,
    mounted: [],
    liveList: classname
      ? document.getElementsByClassName(classname)
      : undefined
  }

  updateComponents(selector)
  initDomObserver()
}


function updateComponents (selector: string) {
  const component = registeredComponents[selector]
  if (!component) console.error("Component not found in registered components")

  // 1. Handle elements that have been removed from the DOM
  component.mounted = component.mounted.map((x) => {
    const [el, unmount, disconnect] = x
    if (exists(el)) return x

    // Call unmount and unset the references to the el and fn byt returning undefined
    // if (debug) console.log(`Unmounting `, el)
    if (typeof unmount === "function") unmount()

    disconnect()
    return undefined
  }).filter((x) => x !== undefined) // Remove undefined values from array

  // 2. Handle elements newly added to the DOM
  const foundEls = component.liveList !== undefined
    ? Array.from(component.liveList) as HTMLElement[]
    : Array.from(document.querySelectorAll(selector)) as HTMLElement[]

  foundEls.forEach(foundEl => {
    if (component.mounted.find(([mountedEl]) => mountedEl === foundEl)) return // Skip if already mounted
    if (foundEl.getAttribute("data-veneer") == "ignore") return

    component.mounted.push(mount(foundEl, component.mountFn))
  })
}


function mount (el: HTMLElement, mountFn: mountFn): mountedEntry {
  let intersectionObserver: IntersectionObserver
  let enterViewportObserver: IntersectionObserver
  const disconnectIntersectionObserver = () => { if (intersectionObserver) intersectionObserver.disconnect() }
  const disconnectEnterViewportObserver = () => { if (enterViewportObserver) enterViewportObserver.disconnect() }

  const hooks: componentHooks = {

    // Runs callback once only when component instance enters viewport
    enterViewport (threshold = "50px", callback) {
      const options: IntersectionObserverInit = {}
      switch (typeof threshold) {
        case "string":
          options.rootMargin = threshold // Handle px and %
          break
        case "number":
          options.threshold = threshold
          break
      }
      enterViewportObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry) // run component callback
            enterViewportObserver.disconnect() // immediately disconnect
          }
        })
      }, options)
      enterViewportObserver.observe(el)
    },

    // Complete intersection observer API for custom behaviour
    intersection ({ threshold = [0.0, 0.25, 0.5, 0.75, 1.0] }, callback) {
      const options = { threshold }
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          callback(entry, disconnectIntersectionObserver)
        })
      }, options)
      intersectionObserver.observe(el)
    }

  }

  return [
    el,
    mountFn(el, hooks),
    () => {
      disconnectIntersectionObserver()
      disconnectEnterViewportObserver()
    }
  ]
}


function component (selector: string, mountFn: mountFn) {
  if (Object.keys(registeredComponents).includes(selector)) {
    // Maybe compare mountFn, if selector and mountFn already mounted: log note,
    // If same selector with different mountFn: log error
    return
  }

  registerComponent(selector, mountFn)
}




function classnameFromSelector (selector: string) {
  const regex = /^\.([\w|-]+)$/
  const match = selector.match(regex)
  return match ? match[1] : ""
}


export { component }


// ---------------------------------------------------------------------------------------

// Example component usage
// =======================


// import { component } from "veneer"


// component(".Donations", (el, hooks: any) => {
//   const { enterViewport } = hooks

//   // This stuff happens when the component mounts in the DOM
//   el.style.opacity = "0"
//   el.style.backgroundColor = "#FBEEE1"
//   el.style.transform = "translateY(100px)"

//   // This stuff happens the first time the element enters the viewport, and only once
//   const threshold = "-100px" // rootMargin can be "px" or "%", intersection threshold can be any intersectionRatio
//   enterViewport(threshold, () => {
//     el.style.transition = "all 0.3s ease-out"
//     void el.offsetWidth
//     el.style.opacity = ""
//     el.style.backgroundColor = "#DB9455"
//     el.style.transform = ""
//   })

//   // This stuff happens on intersection change
//   // intersection({ threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }, (entry, disconnect) => {
//   //   console.log(entry.intersectionRatio, entry.isIntersecting)
//   //   if (entry.intersectionRatio == 1) disconnect()
//   // })

//   // This stuff happens on unmount, after the component is removed from the DOM. Use it to clean up event listeners and so on
//   return () => { } // unmount
// })


// component(".MediaHeader", (el, hooks: any) => {
//   const { enterViewport } = hooks

//   const text = el.querySelector(".MediaHeader__text") as HTMLElement
//   const player = el.querySelector(".MediaHeader__player") as HTMLElement


//   // This stuff happens when the component mounts in the DOM
//   text.style.opacity = "0"
//   text.style.transform = "translateX(-100px)"
//   player.style.opacity = "0"
//   player.style.transform = "translateX(100px)"

//   enterViewport("-100px", () => {
//     text.style.transition = "all 0.3s ease-out"
//     player.style.transition = "all 0.3s ease-out"
//     void el.offsetWidth
//     text.style.opacity = ""
//     text.style.transform = ""
//     player.style.opacity = ""
//     player.style.transform = ""
//   })

//   // This stuff happens on intersection change
//   // intersection({ threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }, (entry, disconnect) => {
//   //   console.log(entry.intersectionRatio, entry.isIntersecting)
//   //   if (entry.intersectionRatio == 1) disconnect()
//   // })

//   // This stuff happens on unmount, after the component is removed from the DOM. Use it to clean up event listeners and so on
//   return () => { } // unmount
// })






// ---------------------------------------------------------------------------------------

/*

Veneer watches for DOM changes and automatically mounts (and unmounts) components.
Veneer components have access to methods that leverage Intersection Observer functionlity so it's trivial to write custom behaviour on `enterViewport`.
Observers are automatially cleaned up for you!



import { component } from "veneer"


// Simple usage

component(".ComponentWithButton", (el) => {
  const button = el.querySelector("button")
  button.addEventListener("click", () => {
    console.log("You clicked me!")
  })
})


// Global event listener usage

component(".SomethingOnScroll", (el) => {
  window.addEventListener("scroll", onScroll, { passive: true })
  function onScroll () {
    // Do something in response to scroll events
  }

  // Returned function is the "unmount" function, called automatically when the element is removed from the DOM
  return () => {
    window.removeEventListener("scroll", onScroll)
  }
})


// Responding to entering the viewport usage

component(".AnimateWhenFirstVisible", (el, on) => {
  on.enterViewport("-100px", () => {
    el.classList.add("transition-into-position")
  })
})


// Advanced usage

component(".CustomIntersections", (el, hooks) => {
  const { intersection, enterViewport } = hooks

  enterViewport(() => {
    el.classList.add("transition-into-position")
  })

  intersection({ threshold: [0.0, 0.25, 0.5, 0.75, 1.0] }, (entry, disconnect) => {
    // Complete intersection observer entry API
    // Maybe do some parallax stuff
    // Maybe play/pause a video
    if (entry.intersectionRatio == 1) disconnect() // disconnect the observer if you need to
  })

  return () => { } // unmount global listeners as necessary
})

*/
