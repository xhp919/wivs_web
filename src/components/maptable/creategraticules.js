import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import * as olProj from 'ol/proj'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'

export default (map, layer) => {
  let source = new VectorSource()
  layer.setSource(source)
  let style = new Style({
    stroke: new Stroke({
      color: '#3d85c6',
      width: 0.7,
      lineDash: [7]
    })
  })
  let zoom = map.getView().getZoom()
  let n = zoom * 7.5
  let long1 = -180
  let long2 = 180
  let lat1 = -85
  let lat2 = 85
  let longDis = long2 - long1
  let latDis = lat2 - lat1
  for (let i = 0; i < n; i++) {
    let longLineArray = []
    let latLineArray = []
    longLineArray.push(
      olProj.transform(
        [long1 + (longDis / n) * i, lat1],
        'EPSG:4326',
        'EPSG:3857'
      )
    )
    longLineArray.push(
      olProj.transform(
        [long1 + (longDis / n) * i, lat2],
        'EPSG:4326',
        'EPSG:3857'
      )
    )
    latLineArray.push(
      olProj.transform(
        [long1, lat1 + (latDis / n) * i],
        'EPSG:4326',
        'EPSG:3857'
      )
    )
    latLineArray.push(
      olProj.transform(
        [long2, lat1 + (latDis / n) * i],
        'EPSG:4326',
        'EPSG:3857'
      )
    )
    let longLineFeature = new Feature({
      geometry: new LineString(longLineArray)
    })
    let latLineFeature = new Feature({
      geometry: new LineString(latLineArray)
    })
    longLineFeature.setStyle(style)
    latLineFeature.setStyle(style)
    source.addFeature(longLineFeature)
    source.addFeature(latLineFeature)
  }
}
