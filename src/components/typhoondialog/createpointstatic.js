import * as olProj from 'ol/proj'
import getTyColor from './gettycolor.js'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import taifeng from '../../assets/taifeng.gif'

export default (_this, id, data, length) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  for (let index in data[0].points.slice(0, length)) {
    let color = getTyColor(data[0].points[index].strong)
    let point = olProj.transform(
      [
        JSON.parse(data[0].points[index].lng),
        JSON.parse(data[0].points[index].lat)
      ],
      'EPSG:4326',
      'EPSG:3857'
    )
    let pointGeom = new Point(point)
    if (index === (length - 1).toString()) {
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
}
