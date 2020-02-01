export default (strong) => {
  let color
  switch (strong) {
    case '热带低压':
      color = '#00ff00'
      break
    case '热带风暴':
      color = '#0000ff'
      break
    case '强热带风暴':
      color = '#ffff00'
      break
    case '台风':
      color = '#ff9900'
      break
    case '强台风':
      color = '#ff00ff'
      break
    case '超强台风':
      color = '#ff0000'
      break
    default:
      color = '#ffffff'
      break
  }
  return color
}
