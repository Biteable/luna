/*
  Aside from filling some missing functionality in IE, the only real difference is that most methods return the element so it can be chained

  IE's Element.classList:
  - doesn't support the `force` argument on `toggle`
  - doesn't support multiple arguments for `add` and `remove`
  - doesn't support `replace`

  Note that there's no IE support for Element.classList in IE9 and older.

  https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
*/

export const addClass = (el: HTMLElement, className: string) => {
  el.classList.add(className)
  return el
}

export const removeClass = (el: HTMLElement, className: string) => {
  el.classList.remove(className)
  return el
}

export const toggleClass = (el: HTMLElement, className: string, force?: boolean) => {
  el.classList.toggle(className, force)
  return el

  // Internet Explorer doesn't support the force argument
  // If you need IE support, replace with the below
  /*
    if (force === undefined) {
      el.classList.toggle(className)
    } else {
      force
        ? el.classList.remove(className)
        : el.classList.add(className)
    }
    return el
  */
}

export const containsClass = (el: HTMLElement, className: string) => {
  return el.classList.contains(className)
}

// Curried methods
// Awesome in pipe
// const addActiveClass = addsClass("active")

export const addsClass = (className: string) => {
  return (el: HTMLElement) => addClass(el, className)
}

export const removesClass = (className: string) => {
  return (el: HTMLElement) => removeClass(el, className)
}

export const togglesClass = (className: string, force?: boolean) => {
  return (el: HTMLElement) => toggleClass(el, className, force)
}
