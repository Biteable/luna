interface Args {
  setup?: () => void,
  trigger?: () => void,
  end?: () => void,
  // watch?: [any],
}


let elsInTransition: HTMLElement[] = []


export function transition (el: HTMLElement, args: Args) {
  console.log("-----------------------------")

  const nextFrame = (cb: () => void) => requestAnimationFrame(() => requestAnimationFrame(cb))
  const transitionend = "transitionend"
  const transitionrun = "transitionrun"

  /*
    An element won't fire "transitionrun" and "transitionend" events if it's not goint to transition.
    This lack of events will happen when:
    - [ ] When the state doesn't change, ie you're transitioning to opacity: 1 and the opacity is already 1
    - [ ] A duration of 0? What about when there's a delay?
  */
  let willTransition: boolean

  const isTransitioning = elsInTransition.indexOf(el) !== -1
  if (!isTransitioning) elsInTransition.push(el)
  if (isTransitioning) {
    console.log("isTransitioning, overriding willTransition because already rtransitioning")
  }

  const removeFromElsInTransition = () => {
    const ix = elsInTransition.indexOf(el)
    if (ix !== -1) elsInTransition.splice(ix, 1)
  }

  const onTransitionRun = (e: Event) => {
    console.log("transitionrun")
    willTransition = true
    el.removeEventListener(transitionrun, onTransitionRun)
  }

  const onEnd = () => {
    if (args.end) args.end()
    el.removeEventListener(transitionend, onTransitionEnd)
    removeFromElsInTransition()
  }

  const onTransitionEnd = (e: Event) => {
    if (e.target === el) {
      console.log("onTransitionEnd")
      onEnd()
    }
  }

  // 1. Setup: apply initial styles
  // This is where you apply your "is-transitioning" class with transition timing, duration, and the css properties you want to, or take any measurements about the initial state of the element
  // It's here we add our listener for the transitionend event.
  // Lastly we read a property on the element that triggers reflow so attribute/class changes in the trigger step don't occur in the same paint frame as the setup changes. Could use 2x rAFs probably
  if (args.setup) args.setup()
  el.addEventListener(transitionend, onTransitionEnd)
  el.addEventListener(transitionrun, onTransitionRun)

  // void el.offsetWidth // @todo needed?

  // 2. Trigger
  // This is where you trigger the transition. For example, setting opacity 0 on an element you're fading out.
  if (args.trigger) args.trigger()

  // void el.offsetWidth // @todo needed?

  // 3. End
  // The transitionend event should handle this base on the css transition timing/duration you use, but when no transition is found the even won't fire. So we call it manually.
  nextFrame(() => {
    console.log("willTransition", willTransition)
    if (!willTransition && !isTransitioning) {
      console.log("exit early because !willTransition")
      onEnd()
    }
  })
}


// let listeners: [HTMLElement, () => any][] = []


// Prologue
// Remove any existing event listeners
// listeners.filter(([elem]) => elem === el)
//   .reverse() //
//   .forEach(listener => {
//     const [elem, cb] = listener
//     listeners.splice(listeners.indexOf(listener), 1)
//     elem.removeEventListener(transitionend, cb)
//   })


// function getDuration (el: HTMLElement): number {
//   const computedStyles = getComputedStyle(el)
//   const duration = computedStyles["transitionDuration"]
//   const delay = computedStyles["transitionDelay"]

//   return ((parseFloat(duration) + parseFloat(delay)) * 1000)
// }
