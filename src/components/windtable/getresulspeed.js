export default (windSpeed) => {
  let ResulSpeed = parseFloat(
    Math.sqrt(
      Math.pow(windSpeed[0], 2) + Math.pow(windSpeed[1], 2)
    ).toFixed(1)
  )
  return ResulSpeed
}
