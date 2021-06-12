/*

offset(el: HTMLElement)
=======================

Returns element offsets and dimensions relative to the html element, excluding any transforms (eg `translateX`, `scaleY` etc) have been applied.

This is designed with the same properties as `Element.getBoundingClientRect()` but the use case is subtly different.

Imagine an element `el` that's `100px` wide and has a css transform `scale(0.5)`. `Element.offsetWidth` returns the value `100` while `Element.getBoundingClientRect().width` returns `50`.

See also `Element.scrollWidth`

> If you need to know the actual size of the content, regardless of how much of it is currently visible, you need to use the Element.scrollWidth and Element.scrollHeight properties. These return the width and height of the entire content of an element, even if only part of it is presently visible due to the use of scroll bars.
> -- https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements


*/
const offset = (el) => {
    let top = 0;
    let left = 0;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    while (el) {
        top += el.offsetTop;
        left += el.offsetLeft;
        el = el.offsetParent;
    }
    /*
      clientWidth vs offsetWidth
      tl; dr clientWidth is the inner containing area excluding the scrollbar, probably what we want for the root dimensions
  
      https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
      https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth
    */
    const bottom = document.documentElement.clientHeight - height;
    const right = document.documentElement.clientWidth - width;
    return { top, bottom, left, right, width, height };
};
export { offset };
//# sourceMappingURL=offset.js.map