export interface OffsetData {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}
export declare const offset: (el: HTMLElement) => OffsetData;
