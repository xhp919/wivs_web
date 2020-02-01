import * as olProj from 'ol/proj'
import getTyColor from './gettycolor.js'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import LineString from 'ol/geom/LineString'
import Stroke from 'ol/style/Stroke'
import taifeng from '../../assets/taifeng.gif'

export default (_this, id, data, cursor) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  let points = []
  for (let index in data[0].points.slice(0, cursor)) {
    let color = getTyColor(data[0].points[index].strong)
    let point = olProj.transform(
      [
        JSON.parse(data[0].points[index].lng),
        JSON.parse(data[0].points[index].lat)
      ],
      'EPSG:4326',
      'EPSG:3857'
    )
    points.push(point)
    let pointGeom = new Point(point)
    if (typhoonLayer.getSource().getFeatureById(`typhoon:${id}:gif:''`) === null) {
      let gifFeature = new Feature({
        geometry: pointGeom
      })
      let gifStyle = new Style({
        image: new Icon({
          src: taifeng
        })
      })
      gifFeature.setStyle(gifStyle)
      gifFeature.setId(`typhoon:${id}:gif:''`)
      typhoonLayer.getSource().addFeature(gifFeature)
    } else {
      typhoonLayer.getSource().getFeatureById(`typhoon:${id}:gif:''`).setGeometry(pointGeom)
    }
    let pointFeature = new Feature({
      geometry: pointGeom
    })
    let pointStyle = new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: color
        }),
        radius: 5
      })
    })
    pointFeature.setStyle(pointStyle)
    pointFeature.setId(`typhoon:${id}:pointIndex:${index}`)
    typhoonLayer.getSource().addFeature(pointFeature)
  }
  let lineGeom = new LineString(points)
  if (typhoonLayer.getSource().getFeatureById(`typhoon:${id}`) === null) {
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
    lineFeature.setId(`typhoon:${id}`)
    lineFeature.tyLength = cursor
    typhoonLayer.getSource().addFeature(lineFeature)
  } else {
    typhoonLayer.getSource().getFeatureById(`typhoon:${id}`).setGeometry(lineGeom)
    typhoonLayer.getSource().getFeatureById(`typhoon:${id}`).tyLength = cursor
  }
}
