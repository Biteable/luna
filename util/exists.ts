export const exists = (node: HTMLElement) => {
  return document.documentElement.contains(node)
}