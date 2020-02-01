let getXhr = (type, url) => {
  let xhr
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else if (window.ActiveXObject) {
    try {
      xhr = new window.ActiveXObject('Msxml2.XMLHTTP')
    } catch (e) {
      try {
        xhr = new window.ActiveXObject('Microsoft.XMLHTTP')
      } catch (e) {}
    }
  }
  xhr.open(type, url)
  xhr.send(null)
  return xhr
}

export default (type, url, callback) => {
  let xhr = getXhr(type, url)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr)
    }
  }
}
