export default (pointNow, u, v, t) => {
  let ea = 6378137 // 赤道半径(m)
  let eb = 6356725 // 极半径(m)
  let x = u * t
  let y = v * t
  let ec = eb + ((ea - eb) * (90.0 - pointNow[1])) / 90.0
  let ed = ec * Math.cos((pointNow[1] * Math.PI) / 180)
  let newLng =
    ((x / ed + (pointNow[0] * Math.PI) / 180.0) * 180.0) / Math.PI
  if (isNaN(newLng)) {
    newLng = pointNow[0]
  }
  let newLat =
    ((y / ec + (pointNow[1] * Math.PI) / 180.0) * 180.0) / Math.PI
  if (isNaN(newLat) || newLat > 90.0 || newLat < -90.0) {
    newLat = pointNow[1]
  }
  return [newLng, newLat]
}
