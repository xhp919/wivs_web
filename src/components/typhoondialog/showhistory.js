import myJsonp from '@tools/myjsonp.js'
import createLineStatic from './createlinestatic.js'
import createPointStatic from './createpointstatic.js'
import createForecastLine from './createforecastline.js'
import createForecastPoint from './createforecastpoint.js'

export default (_this, id, length) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  clearTimeout(_this.zoomToPointTimer)
  if (typhoonLayer.getSource().getFeatureById('typhoon:' + id) === undefined || _this.isAnimationOn) {
    return
  }
  let features = typhoonLayer.getSource().getFeatures()
  for (let index in features) {
    if (features[index].getId().indexOf('typhoon:' + id) !== -1) {
      typhoonLayer.getSource().removeFeature(features[index])
    }
  }
  let tyPopup = _this.TyphoonTable.tyPopupStore
  for (let j in tyPopup) {
    if (j.indexOf('typhoon:' + id) !== -1) {
      tyPopup[j].setPosition(undefined)
      delete tyPopup[j]
    }
  }
  myJsonp(`${_this.$wivsConfig.typhoon.api.info}/${id}`, (data) => {
    createLineStatic(_this, id, data, length)
    createPointStatic(_this, id, data, length)
    createForecastLine(_this, id, data, length)
    createForecastPoint(_this, id, data, length)
  })
}
