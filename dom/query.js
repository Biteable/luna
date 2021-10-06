export const find = (scope, selector) => scope.querySelector(selector);
export const findAll = (scope, selector) => [].slice.call(scope.querySelectorAll(selector));
export const query = (selector) => find(document, selector);
export const queryAll = (selector) => findAll(document, selector);
//# sourceMappingURL=query.js.map