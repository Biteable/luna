/*

`unmount` is a cleanup opportunity where you can remove any event listeners that don't get automatically removed (for example window scroll/resize listeners). You should assume that the element is no longer in the DOM. It's not the place to run an animation to fade out an element, for example.


// Simple usage

component(".ComponentWithButton", (el) => {
  const button = el.querySelector("button")
  button.addEventListener("click", () => {
    console.log("You clicked a button inside me!", el)
  })
})


// scroll listener usage

import { addScrollListener, removeScrollListener } from ..
component(".SomethingOnScroll", (el, { unmount }) => {
  function onScroll () {
    // Do something in response to scroll events
    requestAnimationFrame(() => {
      // Update DOM
    })
  }

  addScrollListener(el, onScroll)

  unmount(() => {
    removeScrollListener(el, onScroll)
  })
})


// Responding to entering the viewport usage

component(".AnimateWhenFirstVisible", (el, on) => {
  // @todo handle setting initial visibility status to, say, opacity 0 then calling an intersection function once in a new paint frame
})

*/


import { debounce } from "../util/debounce"
import { exists } from "../util/exists"


// let initiated: boolean = false
let entries: Entry[] = []
let domObserver: MutationObserver = undefined

// Register of elements with public methods
let register: Map<HTMLElement, any> = new Map()

type MountFn = (el: HTMLElement, actions: Actions) => void

interface EntryInstance {
  el: HTMLElement
  onunmount: () => void
}

interface Entry {
  selector: string
  onmount: MountFn
  liveList: HTMLCollection,
  instances: EntryInstance[]
}

interface Actions {
  unmount: (onUnmount: () => void) => void
  setMethods: (obj: any) => void
  getMethods: (el: HTMLElement) => any
}


export function component(selector: string, onmount: MountFn) {
  return {
    observe() {
      registerComponent(selector, onmount)
    },
    disconnect() {
      unregisterComponent(selector)
    },
  }
}


export function update() {
  entries = entries.map(entry => {
    const mountedEls: HTMLElement[] = []

    // Handle elements removed from the DOM
    entry.instances = entry.instances.reduce((instances, instance) => {
      const { el, onunmount } = instance
      // Check that element exists in the document
      if (exists(el)) {
        mountedEls.push(el)
        instances.push(instance)
      } else {
        onunmount()
      }
      return instances
    }, [])

      // Handle elements newly added to the DOM
      ; ([].slice.call(entry.liveList) as HTMLElement[]).forEach(el => {
        if (!mountedEls.includes(el)) {
          // Mount new found component elements
          entry.instances.push(mountInstance(el, entry.onmount))
        }
      })

    return entry
  })
}


function registerComponent(selector: string, onmount: MountFn) {
  if (!selector.startsWith(".") || selector.includes(" ")) {
    console.error(`Class selectors only please; eg ".Component"`)
    return
  }

  // Skip of already registered
  if (entries.some((entry) => entry.selector === selector)) return

  // Find matching elements in the DOM
  const liveList = document.getElementsByClassName(selector.slice(1))
  const els = [].slice.call(liveList)

  // Iterate elements and mount each as a component instance
  const instances = els.map((el: HTMLElement) => mountInstance(el, onmount))

  // Push to entries
  entries.push({ selector, onmount, liveList, instances })

  //
  if (!domObserver) {
    const onDomMutation = debounce(update, 250)
    domObserver = new MutationObserver(onDomMutation)
    domObserver.observe(document.documentElement, { attributes: false, childList: true, subtree: true })
  }
}


function mountInstance(el: HTMLElement, onmount: MountFn) {
  const instance: EntryInstance = {
    el: el,
    onunmount: () => { }
  }

  const actions: Actions = {
    unmount: (cb) => {
      instance.onunmount = cb // Mutate instance onunmount callback
    },
    setMethods: (obj) => {
      register.set(el, obj)
    },
    getMethods: (el) => new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(register)
        const methods = register.get(el)
        if (methods) resolve(methods)
        else reject()
      }, 0); // Push to end of stack to ensure all components are init'ed
    })
  }

  onmount(el, actions) // Call mount function on element

  return instance
}


function unregisterComponent(selector: string) {
  const entry = entries.find((entry) => entry.selector === selector)
  if (!entry) return
  const index = entries.indexOf(entry)
  entries[index].instances.forEach(({ el }) => {
    register.delete(el)
  })
  entries.splice(index, 1)
}
