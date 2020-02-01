import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'

export default {
  google_vector: () => {
    let layer = new TileLayer({ // 谷歌矢量地图
      source: new XYZ({
        url: 'http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2szh-CN!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965'
      })
    })
    return layer
  },
  google_image: () => { // 谷歌影像地图
    let layer = new TileLayer({
      source: new XYZ({
        url: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
      })
    })
    return layer
  },
  google_mark: () => { // 谷歌标注地图
    let layer = new TileLayer({
      source: new XYZ({
        url: 'http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}'
      })
    })
    return layer
  },
  gaode_vector: () => { // 高德矢量地图
    let layer = new TileLayer({
      source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
      })
    })
    return layer
  },
  gaode_image: () => { // 高德卫星地图
    let layer = new TileLayer({
      source: new XYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
      })
    })
    return layer
  },
  gaode_mark: () => { // 高德标注地图
    let layer = new TileLayer({
      source: new XYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
      })
    })
    return layer
  },
  osm_vector: () => { // osm矢量地图
    let layer = new TileLayer({
      source: new OSM()
    })
    return layer
  }
}
