declare type OnStartEvent = (e: Event) => any;
declare type OnMoveEvent = (e: Event, dx: number, dy: number) => any;
declare type OnEndEvent = (e: Event, dx: number, dy: number) => any;
export declare function draggable(el: HTMLElement): {
    onstart(cb: OnStartEvent): void;
    onmove(cb: OnMoveEvent): void;
    onend(cb: OnEndEvent): void;
    removeListeners(): void;
};
export {};
