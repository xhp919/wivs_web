import * as olProj from 'ol/proj'
import LineString from 'ol/geom/LineString'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'

export default (_this, id, data, length) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  let points = []
  for (let index in data[0].points.slice(0, length)) {
    points.push(
      olProj.transform(
        [
          JSON.parse(data[0].points[index].lng),
          JSON.parse(data[0].points[index].lat)
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
      color: '#0066ff',
      width: 1
    })
  })
  lineFeature.setStyle(lineStyle)
  lineFeature.setId('typhoon:' + id)
  lineFeature.tyLength = length
  typhoonLayer.getSource().addFeature(lineFeature)
}
