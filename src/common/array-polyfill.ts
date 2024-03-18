/* eslint-disable prefer-rest-params */
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function () {
      const depth = typeof arguments[0] === 'undefined' ? 1 : Number(arguments[0]) || 0
      const result: any = []
      const forEach = result.forEach

      const flatDeep = function (arr, depth) {
        forEach.call(arr, function (val) {
          if (depth > 0 && Array.isArray(val)) {
            flatDeep(val, depth - 1)
          } else {
            result.push(val)
          }
        })
      }

      flatDeep(this, depth)
      return result
    }
  })
}
