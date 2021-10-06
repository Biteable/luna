export const debounce = (func: any, wait: number, immediate: boolean = false) => {
  let timeout: number
  return function () {
    var context = this, args = arguments
    window.clearTimeout(timeout)
    timeout = window.setTimeout(function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
    if (immediate && !timeout) func.apply(context, args)
  }
}
