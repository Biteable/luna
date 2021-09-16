export const find = (scope: HTMLElement | Document, selector: string) => scope.querySelector(selector) as HTMLElement

export const findAll = (scope: HTMLElement | Document, selector: string) => [].slice.call(scope.querySelectorAll(selector)) as HTMLElement[]

export const query = (selector: string) => find(document, selector)

export const queryAll = (selector: string) => findAll(document, selector)
