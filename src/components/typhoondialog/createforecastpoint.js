import * as olProj from 'ol/proj'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import getTyColor from './gettycolor.js'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'

export default (_this, id, data, length) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  let forecast = data[0].points[length - 1].forecast
  for (let i in forecast) {
    let tm = forecast[i].tm
    let forecastPoints = forecast[i].forecastpoints
    for (let j in forecastPoints) {
      if (j === 0) {
        continue
      }
      let point = olProj.transform(
        [
          JSON.parse(forecastPoints[j].lng),
          JSON.parse(forecastPoints[j].lat)
        ],
        'EPSG:4326',
        'EPSG:3857'
      )
      let pointGeom = new Point(point)
      let pointFeature = new Feature({
        geometry: pointGeom
      })
      let strong = forecastPoints[j].strong
      let color = getTyColor(strong)
      let pointStyle = new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: color
          }),
          radius: 5
        })
      })
      pointFeature.setStyle(pointStyle)
      pointFeature.setId(
        'typhoon:' +
          id +
          ':pointIndex:' +
          j +
          ':forecastPoint:' +
          (length - 1) +
          ':forecastTm:' +
          tm
      )
      typhoonLayer.getSource().addFeature(pointFeature)
    }
  }
}
