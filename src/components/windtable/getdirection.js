export default (windSpeed) => {
  let direction
  if (windSpeed[0] === 0) {
    if (windSpeed[1] >= 0) {
      direction = '南'
    } else {
      direction = '北'
    }
  } else {
    if (windSpeed[0] > 0 && windSpeed[1] > 0) {
      direction = '西南'
    } else if (windSpeed[0] > 0 && windSpeed[1] < 0) {
      direction = '西北'
    } else if (windSpeed[0] < 0 && windSpeed[1] > 0) {
      direction = '东南'
    } else if (windSpeed[0] < 0 && windSpeed[1] < 0) {
      direction = '东北'
    } else if (windSpeed[0] > 0 && windSpeed[1] === 0) {
      direction = '西'
    } else if (windSpeed[0] < 0 && windSpeed[1] === 0) {
      direction = '东'
    }
  }
  return direction
}
