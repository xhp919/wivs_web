import * as olProj from 'ol/proj'
import cleRadius from './cleradius.js'
import calcRadiusPoints from './calcradiuspoints.js'
import Polygon from 'ol/geom/Polygon'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'

export default (_this, id, data, cursor, type) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  let radius7 = data[0].points[cursor].radius7.split('|')
  let radius10 = data[0].points[cursor].radius10.split('|')
  let radius12 = data[0].points[cursor].radius12.split('|')
  let currentPoint = olProj.transform(
    [
      JSON.parse(data[0].points[cursor].lng),
      JSON.parse(data[0].points[cursor].lat)
    ],
    'EPSG:4326',
    'EPSG:3857'
  )
  if (type === 'animation') {
    cleRadius(_this, id)
  }
  if (radius7.length !== 1) {
    let radius7Points = calcRadiusPoints(
      currentPoint,
      parseFloat(radius7[0]),
      parseFloat(radius7[1]),
      parseFloat(radius7[2]),
      parseFloat(radius7[3]),
      20
    )
    let radius7Geom = new Polygon([radius7Points])
    let radius7Feature = new Feature({
      geometry: radius7Geom
    })
    let radius7Style = new Style({
      fill: new Fill({
        color: 'rgba(230,145,56,0.5)'
      })
    })
    radius7Feature.setStyle(radius7Style)
    if (type === 'animation') {
      radius7Feature.setId('typhoon:' + id + ':radius:7')
    } else {
      radius7Feature.setId('typhoon:' + id + ':radius:7' + ':pointIndex:' + cursor)
    }
    typhoonLayer.getSource().addFeature(radius7Feature)
  }
  if (radius10.length !== 1) {
    let radius10Points = calcRadiusPoints(
      currentPoint,
      parseFloat(radius10[0]),
      parseFloat(radius10[1]),
      parseFloat(radius10[2]),
      parseFloat(radius10[3]),
      20
    )
    let radius10Geom = new Polygon([radius10Points])
    let radius10Feature = new Feature({
      geometry: radius10Geom
    })
    let radius10Style = new Style({
      fill: new Fill({
        color: 'rgba(127,96,0,0.5)'
      })
    })
    radius10Feature.setStyle(radius10Style)
    if (type === 'animation') {
      radius10Feature.setId('typhoon:' + id + ':radius:10')
    } else {
      radius10Feature.setId('typhoon:' + id + ':radius:10' + ':pointIndex:' + cursor)
    }
    typhoonLayer.getSource().addFeature(radius10Feature)
  }
  if (radius12.length !== 1) {
    let radius12Points = calcRadiusPoints(
      currentPoint,
      parseFloat(radius12[0]),
      parseFloat(radius12[1]),
      parseFloat(radius12[2]),
      parseFloat(radius12[3]),
      20
    )
    let radius12Geom = new Polygon([radius12Points])
    let radius12Feature = new Feature({
      geometry: radius12Geom
    })
    let radius12Style = new Style({
      fill: new Fill({
        color: 'rgba(152,0,0,0.5)'
      })
    })
    radius12Feature.setStyle(radius12Style)
    if (type === 'animation') {
      radius12Feature.setId('typhoon:' + id + ':radius:12')
    } else {
      radius12Feature.setId('typhoon:' + id + ':radius:12' + ':pointIndex:' + cursor)
    }
    typhoonLayer.getSource().addFeature(radius12Feature)
  }
}
