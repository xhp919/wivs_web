export default (p, ne, se, nw, sw, n) => {
  let radiusPoints = []
  for (let i = 0; i <= n; i++) {
    radiusPoints.push([
      p[0] + ne * 1000 * Math.cos((i * Math.PI) / 2 / n),
      p[1] + ne * 1000 * Math.sin((i * Math.PI) / 2 / n)
    ])
  }
  for (let i = n; i >= 0; i--) {
    radiusPoints.push([
      p[0] - nw * 1000 * Math.cos((i * Math.PI) / 2 / n),
      p[1] + nw * 1000 * Math.sin((i * Math.PI) / 2 / n)
    ])
  }
  for (let i = 0; i <= n; i++) {
    radiusPoints.push([
      p[0] - sw * 1000 * Math.cos((i * Math.PI) / 2 / n),
      p[1] - sw * 1000 * Math.sin((i * Math.PI) / 2 / n)
    ])
  }
  for (let i = n; i >= 0; i--) {
    radiusPoints.push([
      p[0] + se * 1000 * Math.cos((i * Math.PI) / 2 / n),
      p[1] - se * 1000 * Math.sin((i * Math.PI) / 2 / n)
    ])
  }
  return radiusPoints
}
