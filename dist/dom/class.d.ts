export declare const addClass: (el: HTMLElement, ...classNames: string[]) => HTMLElement;
export declare const removeClass: (el: HTMLElement, ...classNames: string[]) => HTMLElement;
export declare const toggleClass: (el: HTMLElement, className: string, force?: boolean) => HTMLElement;
export declare const containsClass: (el: HTMLElement, className: string) => boolean;
export declare const addsClass: (...classNames: string[]) => (el: HTMLElement) => HTMLElement;
export declare const removesClass: (...classNames: string[]) => (el: HTMLElement) => HTMLElement;
export declare const togglesClass: (className: string, force?: boolean) => (el: HTMLElement) => HTMLElement;
