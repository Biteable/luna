// @todo consider supporting css property names like "z-index" (in addition to zIndex)
const style = (el, styles) => {
    // @polyfill Object.assign required for all versions of Internet Explorer
    Object.assign(el.style, styles);
    return el;
};
// Curried version
const styles = (styles) => (el) => style(el, styles);
export { style, styles };
//# sourceMappingURL=style.js.map