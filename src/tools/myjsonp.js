export default (url, callback) => {
  let time = new Date()
  window[`jsonpcallbackhandle${time.getTime()}`] = (data) => {
    callback(data)
    delete window[`jsonpcallbackhandle${time.getTime()}`]
  }
  let script = document.createElement('script')
  script.src = `${url}?callback=jsonpcallbackhandle${time.getTime()}`
  document.getElementsByTagName('head')[0].appendChild(script)
  document.getElementsByTagName('head')[0].removeChild(script)
}
