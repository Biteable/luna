/*
Stagger

Helps you sequence callbaks together

Sometimes it's hard to orchestrate mutiple things together. Let's say you're trying to detect when mutiple elements enter the screen at the same time (could be IO, could be on page load, whatever) and animate them in one after the other in a sequence. This staggering can be tricky to manage since you typically need to defer that behaviour up onto a parent element that understands the positions of all its children.

This is a different approach. You can just call `stagger` with a namespace (to ensure you scope staggering to like elements -- for example one group for animating in your main navigation items, and another group for animating your boor previews on screen), the element you want effect, and a callback which recieves the index (0 based order) of the element in its group of any other elements in the same stagger namespace that will do their thing in the same animation frame.
*/
let groups = {};
export function stagger(namespace, el, cb) {
    // Add el and callback to a group using namespace as key
    if (!groups[namespace])
        groups[namespace] = [];
    groups[namespace].push({ el, cb });
    // This is the mechanism for determining different callbacks that should run at the same time. Previously we used requestAnimationFrame but this is preferred.
    // > Using 0 as the value for setTimeout() schedules the execution of the specified callback function as soon as possible but only after the main code thread has been run.
    // ref: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals#immediate_timeouts
    setTimeout(processGroups, 0);
}
function processGroups() {
    // Iterate each group separately
    for (const namespace in groups) {
        const length = groups[namespace].length;
        groups[namespace]
            .sort(sortByDocumentPosition) // Order elements by DOM position
            .forEach((x, ix) => {
            x.cb(ix, length); // Call callback with index and group length as arguments
        });
    }
    // Reset groups
    groups = {};
}
function sortByDocumentPosition(a, b) {
    if (a.el === b.el)
        return 0;
    if (a.el.compareDocumentPosition(b.el) & 2)
        return 1; // b comes before a
    return -1;
}
//# sourceMappingURL=stagger.js.map