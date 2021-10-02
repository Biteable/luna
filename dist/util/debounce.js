export const debounce = (func, wait, immediate = false) => {
    let timeout;
    return function () {
        var context = this, args = arguments;
        window.clearTimeout(timeout);
        timeout = window.setTimeout(function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        }, wait);
        if (immediate && !timeout)
            func.apply(context, args);
    };
};
//# sourceMappingURL=debounce.js.map