// @polyfill Object.assign required for all versions of Internet Explorer

import * as CSS from "csstype"

export const css = (el: HTMLElement, styles: CSS.Properties) => {
  Object.assign(el.style, styles)
  return el
}
