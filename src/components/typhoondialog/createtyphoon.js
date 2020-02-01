import myJsonp from '@tools/myjsonp.js'
import createPopup from './createpopup.js'
import * as olProj from 'ol/proj'
import createLinePointAnimation from './createlinepointanimation.js'
import createRadius from './createradius.js'
import cleRadius from './cleradius.js'
import createForecastLine from './createforecastline.js'
import createForecastPoint from './createforecastpoint.js'
import createLineStatic from './createlinestatic.js'
import createPointStatic from './createpointstatic.js'

export default (_this, e, id) => {
  let map = _this.MapTable.map
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  if (e.target.checked) {
    _this.isTyChecked[id] = true
    myJsonp(`${_this.$wivsConfig.typhoon.api.info}/${id}`, (data) => {
      let center = olProj.transform(
        [JSON.parse(data[0].centerlng), JSON.parse(data[0].centerlat)],
        'EPSG:4326',
        'EPSG:3857'
      )
      if (_this.TyphoonTable.checkedAnimationRoute) {
        map.getView().animate({
          center,
          zoom: 4,
          duration: 250
        })
        let cursor = 1
        createPopup(_this, id, data)
        _this.timer[id] = setInterval(() => {
          if (cursor <= data[0].points.length) {
            _this.isAnimationOn = true
            createLinePointAnimation(_this, id, data, cursor)
            createRadius(_this, id, data, cursor - 1, 'animation')
            cursor += 1
          } else {
            clearInterval(_this.timer[id])
            _this.isAnimationOn = false
            createForecastLine(_this, id, data, data[0].points.length)
            createForecastPoint(_this, id, data, data[0].points.length)
            cleRadius(_this, id)
          }
        }, 100)
      } else {
        map.getView().animate({
          center,
          zoom: 4,
          duration: 250
        })
        createPopup(_this, id, data)
        createLineStatic(_this, id, data, data[0].points.length)
        createPointStatic(_this, id, data, data[0].points.length)
        createForecastLine(_this, id, data, data[0].points.length)
        createForecastPoint(_this, id, data, data[0].points.length)
      }
    })
  } else {
    clearInterval(_this.timer[id])
    delete _this.timer[id]
    delete _this.isTyChecked[id]
    _this.tyOverlay[id].setPosition(undefined)
    delete _this.tyOverlay[id]
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
  }
}
