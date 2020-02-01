export default (windSpeed) => {
  let angle
  if (windSpeed[0] === 0) {
    if (windSpeed[1] >= 0) {
      angle = Math.PI / 2
    } else {
      angle = Math.PI / 2 + Math.PI
    }
  } else {
    if (
      (windSpeed[0] > 0 && windSpeed[1] > 0) ||
      (windSpeed[0] > 0 && windSpeed[1] < 0)
    ) {
      angle = Math.atan(windSpeed[1] / windSpeed[0])
    } else if (windSpeed[0] < 0 && windSpeed[1] > 0) {
      angle = Math.PI + Math.atan(windSpeed[1] / windSpeed[0])
    } else if (windSpeed[0] < 0 && windSpeed[1] < 0) {
      angle = -Math.PI + Math.atan(windSpeed[1] / windSpeed[0])
    }
  }
  return angle
}
