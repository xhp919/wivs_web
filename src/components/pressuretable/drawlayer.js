import clearLayer from './clearlayer.js'
import * as olProj from 'ol/proj'
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'
import Fill from 'ol/style/Fill'
import LineString from 'ol/geom/LineString'
import Stroke from 'ol/style/Stroke'

let getPoints = (oldPoints) => { // 将点数据转成ol可识别的点数据
  let newPoints = []
  for (let i = 1; i <= oldPoints.length - 1; i += 2) {
    let point = [oldPoints[i], oldPoints[i - 1]]
    point = olProj.transform(point, 'EPSG:4326', 'EPSG:3857')
    newPoints.push(point)
  }
  return newPoints
}

export default (_this, data) => {
  clearLayer(_this)
  _this.pressureInfo = data.time
  let low = data.low
  let high = data.high
  let isoline = data.isoline
  let lowPoints = getPoints(low.points)
  let highPoints = getPoints(high.points)
  let presSource = new VectorSource()
  for (let i in lowPoints) {
    let lowPointGeom = new Point(lowPoints[i])
    let lowPointFeature = new Feature({
      geometry: lowPointGeom
    })
    let text = String(low.value[i])
    let lowPointStyle = new Style({
      text: new Text({
        textAlign: 'center',
        textBaseline: 'middle',
        font: 'normal 12px 微软雅黑',
        text: text,
        fill: new Fill({
          color: '#3399ff'
        })
      })
    })
    lowPointFeature.setStyle(lowPointStyle)
    presSource.addFeature(lowPointFeature)
  }
  for (let j in highPoints) {
    let highPointGeom = new Point(highPoints[j])
    let highPointFeature = new Feature({
      geometry: highPointGeom
    })
    let text = String(high.value[j])
    let highPointStyle = new Style({
      text: new Text({
        textAlign: 'center',
        textBaseline: 'middle',
        font: 'normal 12px 微软雅黑',
        text: text,
        fill: new Fill({
          color: '#ff0033'
        })
      })
    })
    highPointFeature.setStyle(highPointStyle)
    presSource.addFeature(highPointFeature)
  }
  for (let m in isoline) {
    let isoPoints = getPoints(isoline[m].points)
    let isoGeom = new LineString(isoPoints)
    let isoFeature = new Feature({
      geometry: isoGeom
    })
    let text = String(isoline[m].value)
    let isoStyle = new Style({
      stroke: new Stroke({
        color: '#00cc66',
        width: 1
      }),
      text: new Text({
        textAlign: 'center',
        textBaseline: 'middle',
        font: 'normal 10px 微软雅黑',
        text: text,
        fill: new Fill({
          color: '#6B8E23'
        })
      })
    })
    isoFeature.setStyle(isoStyle)
    isoFeature.pressure = text
    presSource.addFeature(isoFeature)
  }
  _this.MapTable.layers.pressLayer.setSource(presSource)
}
