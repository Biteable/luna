/*
  Aside from filling some missing functionality in IE, the only real difference is that most methods return the element so it can be chained

  IE's Element.classList:
  - doesn't support the `force` argument on `toggle`
  - doesn't support multiple arguments for `add` and `remove`
  - doesn't support `replace`

  Note that there's no IE support for Element.classList in IE9 and older.

  https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
*/
export const addClass = (el, className) => {
    el.classList.add(className);
    return el;
};
export const removeClass = (el, className) => {
    el.classList.remove(className);
    return el;
};
export const toggleClass = (el, className, force) => {
    el.classList.toggle(className, force);
    return el;
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
};
export const containsClass = (el, className) => {
    return el.classList.contains(className);
};
// Curried methods
// Awesome in pipe
// const addActiveClass = addsClass("active")
export const addsClass = (className) => {
    return (el) => addClass(el, className);
};
export const removesClass = (className) => {
    return (el) => removeClass(el, className);
};
export const togglesClass = (className, force) => {
    return (el) => toggleClass(el, className, force);
};
//# sourceMappingURL=class.js.map