import * as olProj from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Stroke from 'ol/style/Stroke'
import LineString from 'ol/geom/LineString'

let cordonDot24 = () => { // 24小时警戒线点
  return [
    olProj.transform([127, 34], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([127, 22], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([120, 18], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([120, 11], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([113, 4.5], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([105, 0], 'EPSG:4326', 'EPSG:3857')
  ]
}

let cordonDot48 = () => { // 48小时警戒线点
  return [
    olProj.transform([132, 34], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([132, 15], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([120, 0], 'EPSG:4326', 'EPSG:3857'),
    olProj.transform([105, 0], 'EPSG:4326', 'EPSG:3857')
  ]
}

let cordonIcon24 = () => { // 24小时警戒线图标
  return new Feature({
    geometry: new Point(olProj.transform([127, 30], 'EPSG:4326', 'EPSG:3857'))
  })
}

let cordonIcon48 = () => { // 48小时警戒线图标
  return new Feature({
    geometry: new Point(olProj.transform([132, 30], 'EPSG:4326', 'EPSG:3857'))
  })
}

let cordonIcon24Style = () => {
  return new Style({
    image: new Icon({
      src: '/img/hour24.png'
    })
  })
}

let cordonIcon48Style = () => {
  return new Style({
    image: new Icon({
      src: '/img/hour48.png'
    })
  })
}

let cordonFeature24Style = () => {
  return new Style({
    stroke: new Stroke({
      color: '#FF0000',
      width: 1
    })
  })
}

let cordonFeature48Style = () => {
  return new Style({
    stroke: new Stroke({
      color: '#FF8C00',
      width: 1
    })
  })
}

export default (_this, cordonType) => {
  let cordonLayer = _this.MapTable.layers.cordonLayer
  if (cordonType === 'remove24') {
    cordonLayer.getSource().removeFeature(cordonLayer.getSource().getFeatureById('cordon24'))
    cordonLayer.getSource().removeFeature(cordonLayer.getSource().getFeatureById('cordonIcon24'))
    return
  } else if (cordonType === 'remove48') {
    cordonLayer.getSource().removeFeature(cordonLayer.getSource().getFeatureById('cordon48'))
    cordonLayer.getSource().removeFeature(cordonLayer.getSource().getFeatureById('cordonIcon48'))
    return
  }
  let dotArry
  let cordonStyle
  let cordonIconStyle
  let cordonIcon
  if (cordonType === 'cordon24') {
    dotArry = cordonDot24()
    cordonStyle = cordonFeature24Style()
    cordonIcon = cordonIcon24()
    cordonIcon.setId('cordonIcon24')
    cordonIconStyle = cordonIcon24Style()
  } else if (cordonType === 'cordon48') {
    dotArry = cordonDot48()
    cordonStyle = cordonFeature48Style()
    cordonIcon = cordonIcon48()
    cordonIcon.setId('cordonIcon48')
    cordonIconStyle = cordonIcon48Style()
  }
  cordonIcon.setStyle(cordonIconStyle)
  let cordonFeature = new Feature({
    geometry: new LineString(dotArry)
  })
  cordonFeature.setStyle(cordonStyle)
  cordonFeature.setId(cordonType)
  cordonLayer.getSource().addFeature(cordonFeature)
  cordonLayer.getSource().addFeature(cordonIcon)
}
