export default (map, pixel) => {
  let coordinate = map.getCoordinateFromPixel(pixel)
  let currentCenter = map.getView().getCenter()
  let currentResolution = map.getView().getResolution()
  let resolution = currentResolution * 0.5
  let x =
    coordinate[0] -
    (resolution * (coordinate[0] - currentCenter[0])) / currentResolution
  let y =
    coordinate[1] -
    (resolution * (coordinate[1] - currentCenter[1])) / currentResolution
  let center = [x, y]
  let newZoom = map.getView().getZoom() + 1
  if (newZoom <= 21) {
    map.getView().animate({
      center: center,
      resolution: resolution,
      duration: 250
    })
  }
}
