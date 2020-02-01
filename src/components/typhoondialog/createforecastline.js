import * as olProj from 'ol/proj'
import LineString from 'ol/geom/LineString'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'

export default (_this, id, data, length) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  let forecast = data[0].points[length - 1].forecast
  for (let i in forecast) {
    let color
    let tm = forecast[i].tm
    let forecastPoints = forecast[i].forecastpoints
    switch (tm) {
      case '中国':
        color = '#ff0000'
        break
      case '中国香港':
        color = '#ff9900'
        break
      case '中国台湾':
        color = '#ff00ff'
        break
      case '日本':
        color = '#00ff00'
        break
      case '美国':
        color = '#a64d79'
        break
    }
    let points = []
    for (let j in forecastPoints) {
      points.push(
        olProj.transform(
          [
            JSON.parse(forecastPoints[j].lng),
            JSON.parse(forecastPoints[j].lat)
          ],
          'EPSG:4326',
          'EPSG:3857'
        )
      )
    }
    let lineGeom = new LineString(points)
    let lineFeature = new Feature({
      geometry: lineGeom
    })
    let lineStyle = new Style({
      stroke: new Stroke({
        color: color,
        lineDash: [5],
        width: 1
      })
    })
    lineFeature.setStyle(lineStyle)
    lineFeature.setId(`typhoon:${id}:forecastLine:${tm}`)
    typhoonLayer.getSource().addFeature(lineFeature)
  }
}
