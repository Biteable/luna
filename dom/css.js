// @polyfill Object.assign required for all versions of Internet Explorer
export const css = (el, styles) => {
    Object.assign(el.style, styles);
    return el;
};
//# sourceMappingURL=css.js.map