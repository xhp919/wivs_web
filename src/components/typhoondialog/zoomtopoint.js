import myJsonp from '@tools/myjsonp.js'
import * as olProj from 'ol/proj'
import Overlay from 'ol/Overlay'
import createRadius from './createradius.js'

export default (_this, id, pointIndex) => {
  let map = _this.MapTable.map
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  clearTimeout(_this.zoomToPointTimer)
  _this.zoomToPointTimer = setTimeout(() => {
    if (_this.TyphoonTable.tyPopupStore['typhoon:' + id + ':pointIndex:' + pointIndex] || _this.tyOverlay[id] === undefined) {
      return
    }
    let tyLength = typhoonLayer.getSource().getFeatureById('typhoon:' + id).tyLength
    if (pointIndex >= tyLength) {
      return
    }
    myJsonp(`${_this.$wivsConfig.typhoon.api.info}/${id}`, (data) => {
      let pointObj = data[0].points[pointIndex]
      let position = olProj.transform(
        [JSON.parse(pointObj.lng), JSON.parse(pointObj.lat)], 'EPSG:4326', 'EPSG:3857')
      map.getView().animate({
        center: position,
        zoom: 8,
        duration: 2000
      })
      let tyPopupEle = document.createElement('div')
      tyPopupEle.className = 'pupContainer'
      let tyPopup = (_this.TyphoonTable.tyPopupStore['typhoon:' + id + ':pointIndex:' + pointIndex] = new Overlay({
        element: tyPopupEle,
        offset: [0, -20],
        positioning: 'bottom-center'
      }))
      let closerContainter = document.createElement('div')
      closerContainter.className = 'closerContainter'
      let closer = document.createElement('div')
      closer.innerHTML = 'X'
      closer.onclick = () => {
        _this.TyphoonTable.tyPopupStore['typhoon:' + id + ':pointIndex:' + pointIndex].setPosition(undefined)
        delete _this.TyphoonTable.tyPopupStore['typhoon:' + id + ':pointIndex:' + pointIndex]
        let features = typhoonLayer.getSource().getFeatures()
        for (let index in features) {
          if (
            features[index].getId().indexOf('typhoon:' + id) !== -1 &&
            features[index].getId().indexOf('radius:') !== -1 &&
            features[index]
              .getId()
              .indexOf(':pointIndex:' + pointIndex) !== -1
          ) {
            typhoonLayer.getSource().removeFeature(features[index])
          }
        }
      }
      closerContainter.appendChild(closer)
      tyPopupEle.appendChild(closerContainter)
      map.addOverlay(tyPopup)
      createRadius(_this, id, data, pointIndex, 'static')
      let title = document.createElement('div')
      title.innerHTML = `<p style='font-size:12px'><b>${data[0].name} ${pointObj.time}</b></p>`
      let center = document.createElement('div')
      center.innerHTML = `<p style='font-size:10px'>中心位置：经度${pointObj.lng} 纬度${pointObj.lat}</p>`
      let speed = document.createElement('div')
      speed.innerHTML = `<p style='font-size:10px'>风速风力：${pointObj.speed}米/秒，${pointObj.power}级（${pointObj.strong}）</p>`
      let centerPressure = document.createElement('div')
      centerPressure.innerHTML = `<p style='font-size:10px'>中心气压：${pointObj.pressure}百帕</p>`
      let moveSpeedDir = document.createElement('div')
      moveSpeedDir.innerHTML = `<p style='font-size:10px'>移速移向：${pointObj.movespeed}公里/小时，${pointObj.movedirection}</p>`
      let radius7
      let radius10
      let radius12
      if (pointObj.radius7 !== '') {
        let info = pointObj.radius7.split('|')
        radius7 = '东北' + info[0] + '|东南' + info[1] + '|西北' + info[2] + '|西南' + info[3]
      } else {
        radius7 = '无'
      }
      if (pointObj.radius10 !== '') {
        let info = pointObj.radius10.split('|')
        radius10 = '东北' + info[0] + '|东南' + info[1] + '|西北' + info[2] + '|西南' + info[3]
      } else {
        radius10 = '无'
      }
      if (pointObj.radius12 !== '') {
        let info = pointObj.radius12.split('|')
        radius12 = '东北' + info[0] + '|东南' + info[1] + '|西北' + info[2] + '|西南' + info[3]
      } else {
        radius12 = '无'
      }
      let radius = document.createElement('div')
      radius.innerHTML = `<p style='font-size:10px'>风圈半径：7级(${radius7})</br>&#12288 &#12288 &#12288 &#8197 10级(${radius10})</br>&#12288 &#12288 &#12288 &#8197 12级(${radius12})</p>`
      tyPopupEle.appendChild(title)
      tyPopupEle.appendChild(center)
      tyPopupEle.appendChild(speed)
      tyPopupEle.appendChild(centerPressure)
      tyPopupEle.appendChild(moveSpeedDir)
      tyPopupEle.appendChild(radius)
      tyPopup.setPosition(position)
    })
  }, 300)
}
