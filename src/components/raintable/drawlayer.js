import clearLayer from './clearLayer.js'
import * as olProj from 'ol/proj'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import VectorSource from 'ol/source/Vector'

export default (_this, data) => {
  clearLayer(_this)
  var rainSource = new VectorSource()
  for (let i = 0; i < data.length; i++) {
    let dot = []
    for (let j = 0; j < data[i].latAndLong.length; j++) {
      dot.push(
        olProj.transform(
          [data[i].latAndLong[j][1], data[i].latAndLong[j][0]],
          'EPSG:4326',
          'EPSG:3857'
        )
      )
    }
    let rainFeature = new Feature({
      geometry: new Polygon([dot])
    })
    let color
    let rainType
    let rainLevel
    let symbol = parseFloat(data[i].symbol)
    if (symbol >= 0 && symbol < 10) {
      color = '#80fd50'
      rainType = '0~10ml'
      rainLevel = 0
    } else if (symbol >= 10 && symbol < 25) {
      color = '#3aa402'
      rainType = '10~25ml'
      rainLevel = 10
    } else if (symbol >= 25 && symbol < 50) {
      color = '#9fc5e8'
      rainType = '25~50ml'
      rainLevel = 25
    } else if (symbol >= 50 && symbol < 100) {
      color = '#0300ff'
      rainType = '50~100ml'
      rainLevel = 50
    } else if (symbol >= 100 && symbol < 250) {
      color = '#fa00fc'
      rainType = '100~250ml'
      rainLevel = 100
    } else if (symbol >= 250) {
      rainType = '>250ml'
      color = '#810040'
      rainLevel = 250
    }
    let rainFeatureStyle = new Style({
      fill: new Fill({
        color
      })
    })
    rainFeature.setStyle(rainFeatureStyle)
    rainFeature.rain = rainType
    rainFeature.level = rainLevel
    rainSource.addFeature(rainFeature)
  }
  _this.MapTable.layers.rainLayer.setSource(rainSource)
}
