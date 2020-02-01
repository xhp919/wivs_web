import getUV from './getuv.js'

export default (p, fp1, fp2, uData, vData) => {
  let speed
  let speed1 = getUV(fp1, uData, vData)
  let speed2 = getUV(fp2, uData, vData)
  if (fp1[0] === fp2[0] && fp1[1] === fp2[1]) {
    speed = speed1
  } else {
    if (speed1[0] === speed2[0] && speed1[1] !== speed2[1]) {
      speed = [
        speed1[0],
        speed1[1] +
          ((p[1] - fp1[1]) / (fp2[1] - fp1[1])) * (speed2[1] - speed1[1])
      ]
    } else if (speed1[0] !== speed2[0] && speed1[1] === speed2[1]) {
      speed = [
        speed1[0] +
          ((p[0] - fp1[0]) / (fp2[0] - fp1[0])) * (speed2[0] - speed1[0]),
        speed1[1]
      ]
    } else if (speed1[0] === speed2[0] && speed1[1] === speed2[1]) {
      speed = speed1
    } else {
      speed = [
        speed1[0] +
          ((p[0] - fp1[0]) / (fp2[0] - fp1[0])) * (speed2[0] - speed1[0]),
        speed1[1] +
          ((p[1] - fp1[1]) / (fp2[1] - fp1[1])) * (speed2[1] - speed1[1])
      ]
    }
  }
  return speed
}
