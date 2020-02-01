import mapLayer from './maplayer.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import CircleStyle from 'ol/style/Circle'

export default (_this) => {
  let map = _this.map
  let addLayer = (layerName, layer) => {
    _this.layers[layerName] = layer
    map.addLayer(_this.layers[layerName])
  }
  addLayer('vectorLayer', mapLayer[_this.$wivsConfig.map.vector]()) // 矢量地图图层
  let imageLayer = mapLayer[_this.$wivsConfig.map.image]()
  imageLayer.setVisible(false)
  addLayer('imageLayer', imageLayer) // 影像地图图层
  let markLayer = mapLayer[_this.$wivsConfig.map.mark]()
  markLayer.setVisible(false)
  addLayer('markLayer', markLayer) // 标注地图图层
  addLayer('temLayer', new VectorLayer({
    source: new VectorSource()
  })) // 气温图层
  addLayer('rainLayer', new VectorLayer({
    source: new VectorSource()
  })) // 降水图层
  addLayer('cloudLayer', new ImageLayer({
    source: new Static({
      crossOrigin: '',
      imageExtent: []
    }),
    visible: false
  })) // 云图图层
  addLayer('radarLayer', new ImageLayer({
    source: new Static({
      crossOrigin: '',
      imageExtent: []
    }),
    visible: false
  })) // 雷达图图层
  addLayer('pressLayer', new VectorLayer({
    source: new VectorSource()
  })) // 气压图层
  addLayer('borderLayer', new VectorLayer({
    source: new VectorSource()
  })) // 城市边界图层
  addLayer('typhoonLayer', new VectorLayer({
    source: new VectorSource()
  })) // 台风图层
  addLayer('graticulesLayer', new VectorLayer({
    source: new VectorSource()
  })) // 经纬网图层
  addLayer('cordonLayer', new VectorLayer({
    source: new VectorSource()
  })) // 台风警戒线图层
  addLayer('drawLayer', new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#FF4500',
        width: 1.5
      }),
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: '#FF4500'
        })
      })
    })
  })) // 绘制图层
  let createWindCanvas = () => { // 风场画布图层
    let fatherContainer = document.getElementsByClassName(
      'ol-overlaycontainer'
    )[0]
    let canvas = _this.layers['WindCanvas'] = document.createElement('canvas')
    canvas.id = 'WindCanvas'
    let size = map.getSize()
    canvas.width = size[0]
    canvas.height = size[1]
    fatherContainer.appendChild(canvas)
  }
  createWindCanvas()
  addLayer('geolocationLayer', new VectorLayer({
    source: new VectorSource()
  })) // 定位图层
}
