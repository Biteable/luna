/**
 * Returns layout offset dimensions relative to the document.
 * This is useful when you want to know the equivelant of el.getBoundingClientRect() excluding scale/translations caused by transforms.
 **/

interface OffsetData {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
}

const offset = (el: HTMLElement): OffsetData => {
  let top = 0
  let left = 0
  const width = el.offsetWidth
  const height = el.offsetHeight

  while (el) {
    top += el.offsetTop
    left += el.offsetLeft
    el = el.offsetParent as HTMLElement
  }

  const bottom = document.documentElement.clientHeight - height
  const right = document.documentElement.clientWidth - width

  return { top, bottom, left, right, width, height }
}

export { OffsetData }
export { offset }