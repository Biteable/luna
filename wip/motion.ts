/*
  FLIP
  https://www.framer.com/blog/posts/magic-motion/
  https://github.com/julianshapiro/velocity
  https://codepen.io/njmcode/pen/axoyD?editors=0010

  Measure the first layout
  Update the CSS and measure the last layout
  Apply the inverted delta as a transform to make the last layout look like the first
  Play the animation

  @TODO
  - [ ] Browser don't do a good job of transitioning from color: #specific to color: currentColor.
        If we go down the path of transition functions for all values (colours included) and use request animation frame, this isn't a problem. Alternatively, we could trigger our transitions by writing a style tag to the dom with all values we need to transition to.
  - [ ] There's no window.getComputedStyle($0).borderRadius in Firefox, need to get each corner individually
  - [ ] Border radius and box shadow need to be interpolated
  - [ ] What properties don't cause layout? We can transition all of these
  - [ ] How do we handle elements that already have transforms on them? Does this just work?
  - [ ] Disable existing transitions // const transitionTimingFunction =
  - [ ] apply transition styles
  - [ ] apply transition timing function
  - [ ] Research the best time to do this in a frame

*/


interface Measurement {
  styles: any,
  rect: {
    top: number
    left: number
    width: number
    height: number
  }
}


const borderProperties = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
]
const colorProperties = [
  "color",
  "backgroundColor",
]

const measure = (el: HTMLElement): Measurement => {
  // Returning window.getComputedStyle(el) doesn't always lock the values as they were at the time we measured.
  // Here we're just pulling out the ones we want.

  const computed = window.getComputedStyle(el)
  const styles = {
    opacity: computed.opacity
  }
  borderProperties.forEach(prop => {
    styles[prop] = computed[prop]
  })
  colorProperties.forEach(prop => {
    styles[prop] = computed[prop]
  })

  const boundingRect = el.getBoundingClientRect()
  const rect = {
    left: boundingRect.left,
    right: boundingRect.right,
    top: boundingRect.top,
    bottom: boundingRect.bottom,
    width: boundingRect.width,
    height: boundingRect.height,
  }

  return { styles, rect }
}


/**
 * calculateTransforms
 *
 * Calculates the transforms (scale, translate, etc) required to make the size, position, and a small set of other properties of an element described in `from` look like `to`.
*/
const calculateTransforms = (
  el: HTMLElement,
  to: Measurement,
  from: Measurement,
  parentTo?: Measurement,
  parentFrom?: Measurement
) => {
  const hasParent = !!parentTo
  // Calculate transforms to put back in from position

  const scaleX = to.rect.width / from.rect.width
  const scaleY = to.rect.height / from.rect.height

  const transforms = []
  if (hasParent) {
    const parentScaleX = parentTo.rect.width / parentFrom.rect.width
    const parentScaleY = parentTo.rect.height / parentFrom.rect.height

    // x/y translations must take into account the position change relative to the parent
    const translateX = ((to.rect.left - parentTo.rect.left) / parentTo.rect.width) - ((from.rect.left - parentFrom.rect.left) / parentFrom.rect.width)
    const translateY = ((to.rect.top - parentTo.rect.top) / parentTo.rect.height) - ((from.rect.top - parentFrom.rect.top) / parentFrom.rect.height)

    transforms.push(`translateX(${translateX * 100}px)`)
    transforms.push(`translateY(${translateY * 100}px)`)
    transforms.push(`scaleX(${scaleX / parentScaleX})`)
    transforms.push(`scaleY(${scaleY / parentScaleY})`)
  } else {
    transforms.push(`translateX(${to.rect.left - from.rect.left}px)`)
    transforms.push(`translateY(${to.rect.top - from.rect.top}px)`)
    transforms.push(`scaleX(${scaleX})`)
    transforms.push(`scaleY(${scaleY})`)
  }

  return {
    apply () {
      if (el.classList.contains("circle")) console.log(el, to.styles, from.styles)

      // el.style.willChange = "transform, opacity"
      el.style.transformOrigin = "0 0"
      el.style.transform = transforms.join(" ")
      el.style.opacity = to.styles.opacity

      borderProperties.forEach(prop => {
        // @TODO still assumes single value corners and px units
        // @TODO account for % and dual corner values
        const val = parseFloat(to.styles[prop])
        el.style[prop] = `${val / scaleX}px ${val / scaleY}px`;
      })

      const styles = ["color", "backgroundColor"]
      styles.forEach((prop) => {
        el.style[prop] = to.styles[prop]
      })
    }
  }
}

function motion2 (el: HTMLElement, trigger: string) {
  requestAnimationFrame(() => {

    // F.L.I.P.
    const elementsTree = makeBranches(el)
    const elementsArr = elementsFromTree(elementsTree)

    // F. (First)
    measureFirstFrames(elementsTree)

    // L. (Last)
    // Set to end/final state and measure last frame
    el.classList.add(trigger)
    measureLastFrames(elementsTree)

    // I. (Invert)
    // Transform el so that it resembles the first frame
    invert(elementsTree)

    // return

    // P. (Play)
    const event = "transitionend"
    const onTransitionEnd = (e: Event) => {
      if (e.target === el) {
        cleanup(elementsArr)
        el.removeEventListener(event, onTransitionEnd)
      }
    }
    el.addEventListener(event, onTransitionEnd)

    requestAnimationFrame(() => {
      play(elementsArr)
    })
  })


  interface Branch {
    el: HTMLElement
    frame: {
      first: Measurement
      last: Measurement
    },
    children: Branch[]
  }


  function play (els: HTMLElement[]) {
    // const transition = "all 3s ease-out"
    const transition = "all 0.6s cubic-bezier(.17,.05,.42,1)"

    els.forEach(el => {
      el.style.transition = transition
      el.style.transformOrigin = ""
      el.style.transform = ""
      el.style.opacity = ""
      borderProperties.forEach(prop => {
        el.style[prop] = "";
      })
      el.style.willChange = ""

      const styles = ["color", "backgroundColor"]
      styles.forEach((prop) => {
        el.style[prop] = ""
      })
    })
  }


  function cleanup (els: HTMLElement[]) {
    els.forEach(el => {
      el.style.transition = ""
    })
  }


  function elementsFromTree (branch: Branch) {
    const els = []
    const pushBranchEl = (branch: Branch) => {
      els.push(branch.el)
      branch.children.forEach(pushBranchEl)
    }
    pushBranchEl(branch)
    return els
  }


  function invert (branch: Branch, parentBranch?: Branch) {
    const transforms = parentBranch
      ? calculateTransforms(branch.el, branch.frame.first, branch.frame.last, parentBranch.frame.first, parentBranch.frame.last)
      : calculateTransforms(branch.el, branch.frame.first, branch.frame.last)

    transforms.apply()

    branch.children.forEach(child => { invert(child, branch) })
  }


  function measureFirstFrames (branch: Branch) {
    branch.frame.first = measure(branch.el)
    branch.children.forEach(measureFirstFrames)
  }


  function measureLastFrames (branch: Branch) {
    branch.frame.last = measure(branch.el)
    branch.children.forEach(measureLastFrames)
  }


  function makeBranches (el: HTMLElement): Branch {
    return {
      el: el,
      frame: {
        first: null,
        last: null
      },
      children: (Array.from(el.children) as HTMLElement[]).map(makeBranches)
    }
  }
}


const motion = (el: HTMLElement, className: string) => {
  const childEls = Array.from(el.children) as HTMLElement[]

  // requestAnimationFrame(() => {})
  let first
  let childsFirst
  let last
  let childsLast

  requestAnimationFrame(() => {
    // FLIP

    // F. (First)
    // Measure first frame
    first = measure(el)
    childsFirst = childEls.map(measure)

    // L. (Last)
    // Set to end/final state and measure last frame
    el.classList.add(className)
    last = measure(el)
    childsLast = childEls.map(measure)

    // I. (Invert)
    // Transform el so that it resembeles the first frame
    applyTransforms()

    // P. (Play)
    unapply(el)
    childEls.forEach(el => unapply(el))

    // Testing: add transition styles
    // const transition = "all 1s ease-out"
    const transition = "all 0.7s cubic-bezier(.17,.05,.42,1)"
    el.style.transition = transition
    childEls.forEach(el => el.style.transition = transition)
  })


  function applyTransforms () {
    const parentTransforms = calculateTransforms(el, first, last)
    const childrenTransforms = childEls.map((el, ix) => {
      return calculateTransforms(el, childsFirst[ix], childsLast[ix], first, last)
    })

    parentTransforms.apply()
    childrenTransforms.forEach(x => { x.apply() })
  }

  function unapply (el: HTMLElement) {
    el.style.transformOrigin = ""
    el.style.transform = ""
    el.style.borderRadius = "";
  }
}

const runBtn = document.querySelector("[data-run]") as HTMLButtonElement
const card = document.querySelector(".befaux .card") as HTMLElement

const motionBtns = Array.from(document.querySelectorAll("[data-motion]")) as HTMLButtonElement[]
const testEls = Array.from(document.querySelectorAll(".befaux > div")) as HTMLElement[]

motionBtns.forEach((el, ix) => {
  el.addEventListener("click", () => {
    motion2(testEls[ix], "end")
  })
})

runBtn.addEventListener("click", () => {
  motion(card, "end")
})
