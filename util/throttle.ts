export default function (fn: Function, threshhold?: number, scope?: Object) {
  threshhold || (threshhold = 250)
  var last: any
  var deferTimer: any

  return function () {
    var context = scope || this

    var now = +new Date(),
      args = arguments
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}