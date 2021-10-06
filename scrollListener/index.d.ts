interface RootData {
    scrollX?: number;
    scrollY?: number;
    scrollHeight?: number;
    direction?: Direction;
    width?: number;
    height?: number;
}
interface Entry {
    target: HTMLElement;
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}
interface ScrollData {
    root: RootData;
    entry: Entry;
}
export declare type ScrollCallback = (data: ScrollData) => any;
declare type Direction = "DOWN" | "UP";
export declare const DOWN: Direction;
export declare const UP: Direction;
export declare function update(): void;
export declare function addScrollListener(target: HTMLElement, cb: ScrollCallback): void;
export declare function removeScrollListener(target: HTMLElement, cb?: ScrollCallback): void;
export declare function removeAll(): void;
export declare const isIntersecting: (data: ScrollData, rootMargin?: number) => boolean;
export declare const intersectionRatio: (data: ScrollData, rootMargin?: number) => number;
export declare const intersectionValue: (data: ScrollData, rootMargin?: number) => number;
export {};
