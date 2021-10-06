declare type Callback = (staggerIndex: number, staggerTotal: number) => any;
export declare function stagger(namespace: string, el: HTMLElement, cb: Callback): void;
export {};
