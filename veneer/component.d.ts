declare type MountFn = (el: HTMLElement, actions: Actions) => void;
interface Actions {
    unmount: (onUnmount: () => void) => void;
    setMethods: (obj: any) => void;
    getMethods: (el: HTMLElement) => any;
}
export declare function component(selector: string, onmount: MountFn): {
    observe(): void;
    disconnect(): void;
};
export declare function update(): void;
export {};
