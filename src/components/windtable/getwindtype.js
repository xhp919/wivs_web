export default (ResulSpeed) => {
  let type
  if (ResulSpeed >= 0.0 && ResulSpeed <= 0.2) {
    type = ''
  }
  if (ResulSpeed >= 0.3 && ResulSpeed <= 1.5) {
    type = '1'
  }
  if (ResulSpeed >= 1.6 && ResulSpeed <= 3.3) {
    type = '2'
  }
  if (ResulSpeed >= 3.4 && ResulSpeed <= 5.4) {
    type = '3'
  }
  if (ResulSpeed >= 5.5 && ResulSpeed <= 7.9) {
    type = '4'
  }
  if (ResulSpeed >= 8.0) {
    type = '5'
  }
  return type
}
