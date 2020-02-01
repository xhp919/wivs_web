import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import CircleStyle from 'ol/style/Circle'
import Polygon from 'ol/geom/Polygon'
import LineString from 'ol/geom/LineString'
import Observable from 'ol/Observable'
import Draw from 'ol/interaction/Draw'
import Overlay from 'ol/Overlay'
import * as olSphere from 'ol/sphere'
import * as olProj from 'ol/proj'

let createHelpTip = (map, drawObj) => { // 创造帮助提示框
  drawObj.helpTipEle = document.createElement('div')
  drawObj.helpTipEle.className = 'toolTip'
  drawObj.helpTip = new Overlay({
    element: drawObj.helpTipEle,
    offset: [15, 12],
    positioning: 'center-left'
  })
  map.addOverlay(drawObj.helpTip)
}

let createMeasureTip = (map, id, drawObj) => { // 创造测量结果显示框
  drawObj.measureTipEle[id] = document.createElement('div')
  drawObj.measureTipEle[id].className = 'toolTip ol-unselectable measureTip'
  drawObj.measureTip[id] = new Overlay({
    element: drawObj.measureTipEle[id],
    offset: [0, -15],
    positioning: 'bottom-center'
  })
  map.addOverlay(drawObj.measureTip[id])
}

let formatLength = (map, line) => { // 计算长度
  let length
  let coordinates = line.getCoordinates()
  length = 0
  let sourceProj = map.getView().getProjection()
  for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
    let c1 = olProj.transform(coordinates[i], sourceProj, 'EPSG:4326')
    let c2 = olProj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326')
    length += olSphere.getDistance(c1, c2)
  }
  let output
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm'
  }
  return output
}

let formatArea = (polygon) => { // 计算面积
  let area
  let geom = polygon.clone()
  area = Math.abs(olSphere.getArea(geom))
  let output
  if (area > 10000) {
    output =
      Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
  }
  return output
}

export default (map, drawLayer, drawObj, type) => {
  drawObj.drawId++
  let id = drawObj.drawId
  let listener
  if (drawObj.helpTip != null) {
    drawObj.helpTip.setPosition(undefined)
    drawObj.helpTip = null
  }
  map.removeInteraction(drawObj.draw)
  drawObj.draw = new Draw({
    source: drawLayer.getSource(),
    type: type,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  })
  map.addInteraction(drawObj.draw)
  createHelpTip(map, drawObj)
  createMeasureTip(map, id, drawObj)
  drawObj.draw.on('drawstart', (e) => {
    drawObj.ifDrawOn = true
    drawObj.sketch = e.feature
    listener = drawObj.sketch.getGeometry().on('change', (e) => {
      let geom = e.target
      let output
      let tooltipCoord
      if (geom instanceof Polygon) {
        output = formatArea(geom)
        tooltipCoord = geom.getInteriorPoint().getCoordinates()
      } else if (geom instanceof LineString) {
        output = formatLength(map, geom)
        tooltipCoord = geom.getLastCoordinate()
      }
      drawObj.measureTipEle[id].innerHTML = output
      drawObj.measureTip[id].setPosition(tooltipCoord)
    })
  })
  drawObj.draw.on('drawend', (e) => {
    e.feature.setId(id)
    let closer = document.createElement('sup')
    closer.className = 'closer'
    closer.innerHTML = 'x'
    closer.onclick = () => {
      drawObj.measureTip[id].setPosition(undefined)
      drawLayer.getSource().removeFeature(drawLayer.getSource().getFeatureById(id))
      drawObj.measureTipEle[id].parentNode.removeChild(drawObj.measureTipEle[id])
    }
    drawObj.measureTipEle[id].appendChild(closer)
    drawObj.sketch = null
    let observable = new Observable()
    observable.un('change', listener)
    map.removeInteraction(drawObj.draw)
    if (drawObj.helpTip != null) {
      drawObj.helpTip.setPosition(undefined)
      drawObj.helpTip = null
    }
    if (drawObj.helpTipEle) {
      drawObj.helpTipEle.parentNode.removeChild(drawObj.helpTipEle)
    }
    setTimeout(() => {
      drawObj.ifDrawOn = false
    })
  })
}
