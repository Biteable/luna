export const parseHTML = (str) => {
    const template = document.createElement("template");
    template.innerHTML = str.trim();
    return Array.from(template.content.childNodes);
};
// https://stackoverflow.com/a/35385518
// export function strToElement(str: string): HTMLElement {
//   const template = document.createElement("template")
//   template.innerHTML = str.trim() // Never return a text node of whitespace as the result
//   return template.content.firstChild as HTMLElement
// }
// export function strToElements(str: string) {
//   const template = document.createElement("template")
//   template.innerHTML = str
//   return Array.from(template.content.childNodes) as HTMLElement[]
// }
//# sourceMappingURL=parseHTML.js.map