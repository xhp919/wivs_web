export default (ctx, center, angle, type) => {
  if (type === '') {
    return
  }
  ctx.save()
  ctx.beginPath()
  ctx.translate(center[0], center[1])
  ctx.rotate(-angle)
  ctx.lineCap = 'square'
  if (type === '1') {
    ctx.strokeStyle = '#4a86e8'
  }
  if (type === '2') {
    ctx.strokeStyle = '#0000ff'
  }
  if (type === '3') {
    ctx.strokeStyle = '#ffff00'
  }
  if (type === '4') {
    ctx.strokeStyle = '#ff9900'
  }
  if (type === '5') {
    ctx.strokeStyle = '#ff0000'
  }
  let p = 10
  ctx.moveTo(0, 0)
  ctx.lineTo(-p, 0)
  ctx.moveTo(0, 0)
  ctx.lineTo(p, 0)
  if (type === '1' || type === '2' || type === '3' || type === '4') {
    ctx.moveTo(-p, 0)
    ctx.lineTo(-p, -p)
  }
  if (type === '3' || type === '4') {
    ctx.moveTo(-p * 0.75, 0)
    ctx.lineTo(-p * 0.75, -p)
  }
  if (type === '2' || type === '3' || type === '4') {
    ctx.moveTo(-p * 0.5, 0)
    ctx.lineTo(-p * 0.5, -p)
  }
  if (type === '4') {
    ctx.moveTo(-p * 0.25, 0)
    ctx.lineTo(-p * 0.25, -p)
  }
  if (type === '5') {
    ctx.moveTo(-p, 0)
    ctx.lineTo(-p, -p)
    ctx.lineTo(-p * 0.25, 0)
    ctx.lineTo(-p, 0)
  }
  ctx.stroke()
  ctx.restore()
}
