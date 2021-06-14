const find = (scope: HTMLElement | Document, selector: string) => scope.querySelector(selector) as HTMLElement

const findAll = (scope: HTMLElement | Document, selector: string) => [].slice.call(scope.querySelectorAll(selector)) as HTMLElement[]

const query = (selector: string) => find(document, selector)

const queryAll = (selector: string) => findAll(document, selector)

// Curried versions

const finds = (scope: HTMLElement | Document, selector: string) => () => find(scope, selector)

const findsAll = (scope: HTMLElement | Document, selector: string) => () => findAll(scope, selector)

const queries = (selector: string) => () => query(selector)

const queriesAll = (selector: string) => () => queryAll(selector)


export { query, queryAll, find, findAll }
export { queries, queriesAll, finds, findsAll }
