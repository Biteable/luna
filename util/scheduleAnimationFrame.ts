import { throttle } from "./throttle"


let groups = {}


const processGroups = () => {
  // console.log("processGroups", groups)

  for (const namespace in groups) {
    // Order by DOM position
    const len = groups[namespace].length
    groups[namespace].sort((a, b) => {
      if (a.el === b.el) return 0
      if (a.el.compareDocumentPosition(b.el) & 2) return 1 // b comes before a
      return -1
    })
    .forEach((x, ix) => {
      x.cb(ix, len)
    })
  }

  // Reset
  groups = {}
}


const throttledProcess = throttle(processGroups, 1000 / 15) // 30 FPS grouping


export const stagger = (namespace: string, el: HTMLElement, cb: (staggerIndex: number, staggerTotal: number) => any) => {
  // Add to group with namespace
  if (!groups[namespace]) groups[namespace] = []
  groups[namespace].push({ el, cb })

  // Call throttled processor
  requestAnimationFrame(() => {
    processGroups()
  })
  // throttledProcess()
}

/*

Right now this code runs in the rAF becuase that's the only way we know these things are happening at the same time; they're in the same frame.

Could we do this with throttle, group our callbacks, and then call rAF once? Or not call it all and let our callbacks implement rAF?

*/


// let scheduledCallbacks = {}

// export const scheduleAnimationFrame = (el: HTMLElement, name: string, cb: (staggerIndex: number) => any) => {
//   // const groups: { key: string, group: { el: HTMLElement, cb: (staggerIndex: number) => any}[] } = {}

//   if (!scheduledCallbacks[name]) scheduledCallbacks[name]

//   scheduledCallbacks[name].push({ el: el, cb: cb })

//   requestAnimationFrame(() => {
//     // https://stackoverflow.com/a/22613028/373932


//     for (const comparitor in scheduledCallbacks) {
//       scheduledCallbacks[comparitor]
//         .sort((a, b) => {
//           if (a.el === b.el) return 0
//           if (a.el.compareDocumentPosition(b.el) & 2) return 1 // b comes before a
//           return -1
//         })
//       .forEach((x, ix) => {
//         x.cb(ix)
//       })
//       // console.log(`${property}: ${object[property]}`);
//     }


//     scheduledCallbacks = []
//   })

//   // scheduledCallbacks.push({ el: el, cb: cb })

//   // requestAnimationFrame(() => {
//   //   // https://stackoverflow.com/a/22613028/373932
//   //   scheduledCallbacks
//   //     .sort((a, b) => {
//   //       if (a.el === b.el) return 0
//   //       if (a.el.compareDocumentPosition(b.el) & 2) return 1 // b comes before a
//   //       return -1
//   //     })
//   //     .forEach((x, ix) => {
//   //       x.cb(ix)
//   //     })

//   //   scheduledCallbacks = []
//   // })
// }
