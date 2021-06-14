const find = (scope, selector) => scope.querySelector(selector);
const findAll = (scope, selector) => [].slice.call(scope.querySelectorAll(selector));
const query = (selector) => find(document, selector);
const queryAll = (selector) => findAll(document, selector);
// Curried versions
const finds = (scope, selector) => () => find(scope, selector);
const findsAll = (scope, selector) => () => findAll(scope, selector);
const queries = (selector) => () => query(selector);
const queriesAll = (selector) => () => queryAll(selector);
export { query, queryAll, find, findAll };
export { queries, queriesAll, finds, findsAll };
//# sourceMappingURL=query.js.map