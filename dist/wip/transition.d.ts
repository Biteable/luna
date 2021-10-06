interface Args {
    setup?: () => void;
    trigger?: () => void;
    end?: () => void;
}
export declare function transition(el: HTMLElement, args: Args): void;
export {};
