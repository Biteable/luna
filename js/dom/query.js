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
// const find = (scope: HTMLElement | Document | string, selector?: string) => {
//   if (selector) {
//     return (scope as HTMLElement | Document).querySelector(selector) as HTMLElement
//   }
//   return document.querySelector(scope as string) as HTMLElement
// }
// const findAll = (scope: HTMLElement | Document | string, selector?: string) => {
//   if (selector) {
//     return [].slice.call((scope as HTMLElement | Document).querySelectorAll(selector)) as HTMLElement[]
//   }
//   return [].slice.call(document.querySelectorAll(scope as string)) as HTMLElement[]
// }
//# sourceMappingURL=query.js.map