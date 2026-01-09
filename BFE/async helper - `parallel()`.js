/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function parallel(funcs){
  return function (callback, initData) {
    const promises = funcs.map((item) => {
      return new Promise((resolve, reject) => {
        item((error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        }, initData)
      })
    })

    Promise.all(promises).then((values) => {
      callback(undefined, values)
    }).catch((error) => {
      callback(error, undefined)
    })
  }
}
