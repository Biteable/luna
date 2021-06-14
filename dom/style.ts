// @todo consider supporting css property names like "z-index" (in addition to zIndex)

const style = (el: HTMLElement, styles: {}) => {
  // @polyfill Object.assign required for all versions of Internet Explorer
  Object.assign(el.style, styles)
  return el
}

// Curried version

const styles = (styles: {}) => (el: HTMLElement) => style(el, styles)

export { style, styles }