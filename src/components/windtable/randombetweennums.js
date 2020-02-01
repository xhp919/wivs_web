export default (l, min, max, r, ifInt) => {
  let num
  let range = max - min
  let rand = Math.random()
  if (l === '[' && r === ')') {
    if (ifInt) {
      if (Math.floor(max) === max) {
        num = Math.floor(
          Math.ceil(min) + rand * (Math.floor(max) - Math.ceil(min))
        )
      } else {
        num = Math.floor(
          Math.ceil(min) + rand * (Math.floor(max) + 1 - Math.ceil(min))
        )
      }
    } else {
      num = min + rand * range
    }
  }
  if (l === '(' && r === ']') {
    if (ifInt) {
      if (Math.ceil(min) === min) {
        num = Math.ceil(
          Math.floor(max) - rand * (Math.floor(max) - Math.ceil(min))
        )
      } else {
        num = Math.ceil(
          Math.floor(max) - rand * (Math.floor(max) - (Math.ceil(min) - 1))
        )
      }
    } else {
      num = max - rand * range
    }
  }
  if (l === '[' && r === ']') {
    if (ifInt) {
      num = Math.floor(
        Math.ceil(min) + rand * (Math.floor(max) + 1 - Math.ceil(min))
      )
    } else {
      num = Math.floor(
        min * Math.pow(10, 18) +
        rand * (max * Math.pow(10, 18) + 1 - min * Math.pow(10, 18))
      )
      num = num * Math.pow(10, -18)
    }
  }
  if (l === '(' && r === ')') {
    if (ifInt) {
      if (Math.ceil(min) === min) {
        num = Math.floor(
          Math.ceil(min) + 1 + rand * (Math.floor(max) - Math.ceil(min) - 1)
        )
      } else {
        num = Math.floor(
          Math.ceil(min) + rand * (Math.floor(max) - Math.ceil(min))
        )
      }
    } else {
      num = Math.floor(
        min * Math.pow(10, 18) +
        1 +
        rand * (max * Math.pow(10, 18) - min * Math.pow(10, 18) - 1)
      )
      num = num * Math.pow(10, -18)
    }
  }
  return num
}
