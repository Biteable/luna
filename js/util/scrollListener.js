import { offset as getOffset } from "../dom/offset";
import { clamp } from "./clamp";
import { debounce } from "./debounce";
let initiated = false;
let tracked = [];
let lastScrollY;
let root = {};
let domObserver;
export const DOWN = "DOWN";
export const UP = "UP";
export function update() {
    // console.log("::update")
    measureRootData();
    measureOffsets();
    onScroll();
}
const debouncedOnResize = debounce(update, 250);
function measureOffsets() {
    // console.log("::measureOffsets")
    const length = tracked.length;
    for (var i = 0; i < length; i++) {
        const target = tracked[i].target;
        tracked[i].offset = getOffset(target);
    }
}
function measureRootData() {
    // console.log("::measureRootData")
    const w = window;
    const html = document.documentElement;
    root.scrollX = w.scrollX;
    root.scrollY = w.scrollY;
    root.scrollHeight = html.scrollHeight; // @note maybe cache
    root.direction = w.scrollY >= lastScrollY ? DOWN : UP;
    root.width = html.clientWidth; // * clientWidth vs offsetWidth
    root.height = html.clientHeight; // @note maybe cache
}
function onScroll() {
    const length = tracked.length;
    if (!length)
        return;
    // console.log("::onScroll")
    // Update scroll position specific root data
    root.scrollX = window.scrollX;
    root.scrollY = window.scrollY;
    root.direction = window.scrollY >= lastScrollY ? DOWN : UP;
    for (var i = 0; i < length; i++) {
        // Check the tracked item still exists. This is necessary because removeScrollListener can be called during this loop (eg in the tracked item callback) which mutates the tracked array and can change the length mid-loop.
        if (!tracked[i])
            continue;
        const { target, cb, offset } = tracked[i];
        cb({ target, offset, root });
    }
}
export function addScrollListener(target, cb) {
    // Don't subscribe the same callback + element multiple times
    if (tracked.some((x) => x.target === target && x.cb === cb))
        return;
    const offset = getOffset(target); // @todo measure at a better time?
    tracked.push({ target, cb, offset });
    if (!initiated) {
        initiated = true;
        update();
        addEventListeners();
    }
    cb({ target, offset, root }); // Immediately apply callbacks for added target
}
// if cb, ubsub just that cb, otherwise ubsubs all from el
// Remove items from array, removing references to function and elements allowing garbage collection
export function removeScrollListener(target, cb) {
    if (cb) {
        tracked = tracked.filter((x) => !(x.target === target && x.cb === cb));
    }
    else {
        tracked = tracked.filter((x) => !(x.target === target));
    }
    // Call onScroll again. This is necessary because removeScrollListener can be called during iteration of the tracked array and can change the length mid-loop.
    onScroll();
}
export function removeAll() {
    initiated = false;
    tracked = [];
    removeEventListeners();
}
function addEventListeners() {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    domObserver = new MutationObserver(debouncedOnResize);
    domObserver.observe(document.documentElement, { attributes: false, childList: true, subtree: true });
}
function removeEventListeners() {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", update);
    domObserver.disconnect();
}
export function intersection({ target, offset, root }, threshold = 0) {
    // Ratio ... 1 is possible even for very tall els, unlike Intersection Observer
    const scrollY = root.scrollY;
    const rootTop = root.scrollY + threshold; // But never smaller than root.height / 2
    const rootHeight = root.height;
    const rootBottom = root.scrollY + root.height - threshold; // But never smaller than root.height / 2
    const targetTop = offset.top;
    const targetHeight = offset.height;
    const targetBottom = offset.top + offset.height;
    // Some part of the target is in the viewport when the targetTop edge is < rootBottom and the targetBottom edge > rootTop
    const isIntersecting = targetTop < rootBottom && targetBottom > rootTop;
    // Same as IO.entry.isIntersecting
    // If the target is taller than the root you will never get a ratio of 1
    const ratio = isIntersecting
        ? (Math.min(rootBottom - targetTop, targetBottom - rootTop, targetHeight, rootHeight)) / targetHeight
        : 0;
    // Like ratio but normalised*
    // Smooths out the intersection ratio so you always get a linear 0 to 1 to 0 with a guaranteed 1 in the middle and no dead spots where it sits at 1 for a long period of time
    const valueRangeHeight = targetHeight + rootHeight;
    const valueRangeTopY = scrollY - targetHeight;
    const valueRangeMiddleY = valueRangeTopY + valueRangeHeight / 2;
    // This never seems to completely get to 1, it's 0.0025 off in observations
    const value = targetTop > valueRangeMiddleY
        ? 1 - (targetTop - valueRangeMiddleY) / (valueRangeHeight / 2)
        : (targetTop - valueRangeTopY) / (valueRangeHeight / 2);
    return {
        target,
        isIntersecting,
        ratio: clamp(0, ratio, 1),
        value: clamp(0, value, 1),
    };
}
//# sourceMappingURL=scrollListener.js.map