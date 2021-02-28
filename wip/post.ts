// DRAFT

function post (action: string, body: string, cb: (response: any) => any) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== XMLHttpRequest.DONE) return // Only run if the request is complete
    if (xhr.status >= 200 && xhr.status < 300) {
      cb(JSON.parse(xhr.responseText)) // Request is successful
    }
  }
  xhr.open("POST", action, true)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
  xhr.send(body) // body should be serialised
}