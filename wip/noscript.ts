// If a browser fails the support test, load 0 javcsript and expose all the content in the noscript tags

import { queryAll } from "../dom/query"

queryAll("noscript").forEach(el => {
  el.insertAdjacentHTML("beforebegin", el.innerHTML)
  el.remove()
})