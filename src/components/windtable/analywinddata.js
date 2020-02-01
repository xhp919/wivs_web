export default (data) => {
  let uData
  let vData
  let windInfo
  for (let i in data) {
    windInfo =
      i.substring(0, 4) +
      '/' +
      i.substring(4, 6) +
      '/' +
      i.substring(6, 8) +
      ' ' +
      i.substring(8, 10) +
      ':00'
    uData = data[i][0].data // 水平分量速度
    vData = data[i][1].data // 垂直分量速度
  }
  return [windInfo, uData, vData]
}
