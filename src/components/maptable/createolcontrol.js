export default (customClass) => {
  let fatherContainer = document.getElementsByClassName('ol-overlaycontainer-stopevent')[0]
  let childContainer = document.createElement('div')
  if (customClass !== '') {
    childContainer.className = customClass + ' ol-unselectable ol-control'
  } else {
    childContainer.className = 'ol-unselectable ol-control'
  }
  fatherContainer.appendChild(childContainer)
  return childContainer
}
