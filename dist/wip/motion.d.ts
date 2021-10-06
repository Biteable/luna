interface Measurement {
    styles: any;
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}
declare const borderProperties: string[];
declare const colorProperties: string[];
declare const measure: (el: HTMLElement) => Measurement;
/**
 * calculateTransforms
 *
 * Calculates the transforms (scale, translate, etc) required to make the size, position, and a small set of other properties of an element described in `from` look like `to`.
*/
declare const calculateTransforms: (el: HTMLElement, to: Measurement, from: Measurement, parentTo?: Measurement, parentFrom?: Measurement) => {
    apply(): void;
};
declare function motion2(el: HTMLElement, trigger: string): void;
declare const motion: (el: HTMLElement, className: string) => void;
declare const runBtn: HTMLButtonElement;
declare const card: HTMLElement;
declare const motionBtns: HTMLButtonElement[];
declare const testEls: HTMLElement[];
