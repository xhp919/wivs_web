export default (point, uData, vData) => {
  let index = (90 - point[1]) * 360 + point[0]
  let u = uData[index]
  let v = vData[index]
  return [u, v]
}
