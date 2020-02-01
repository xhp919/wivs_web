export default (p) => {
  let fp1 = []
  let fp2 = []
  if (Math.floor(p[0]) !== p[0]) {
    if (Math.floor(p[0]) === 359) {
      fp1[0] = Math.floor(p[0])
      fp2[0] = 0
    } else {
      fp1[0] = Math.floor(p[0])
      fp2[0] = fp1[0] + 1
    }
  } else {
    fp1[0] = p[0]
    fp2[0] = fp1[0]
  }
  if (Math.floor(p[1]) !== p[1]) {
    fp1[1] = Math.floor(p[1])
    fp2[1] = fp1[1] + 1
  } else {
    fp1[1] = p[1]
    fp2[1] = fp1[1]
  }
  return [fp1, fp2]
}
