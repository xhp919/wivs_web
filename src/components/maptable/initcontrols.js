import './control_custom.css'
import Zoom from 'ol/control/Zoom'
import ZoomSlider from 'ol/control/ZoomSlider'
import ScaleLine from 'ol/control/ScaleLine'
import MousePosition from 'ol/control/MousePosition'
import * as olCoordinate from 'ol/coordinate'
import OverviewMap from 'ol/control/OverviewMap'
import mapLayer from './maplayer'
import createOlControl from './createolcontrol.js'
import FullScreen from 'ol/control/FullScreen'
import createGraticules from './creategraticules.js'
import VectorSource from 'ol/source/Vector'
import Geolocation from 'ol/Geolocation'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import * as olProj from 'ol/proj'
import wgs84ToGcj02 from './wgs84togcj02.js'
import Circle from 'ol/geom/Circle'
import Point from 'ol/geom/Point'
import drawInteraction from './drawinteraction.js'
import LineString from 'ol/geom/LineString'
import doubleClickZoom from './doubleclickzoom.js'
import Vue from 'vue'
import Dialog from '@components/dialog/index.vue'
import Overlay from 'ol/Overlay'
import getFloor from '../windtable/getfloor.js'
import getSpeed from '../windtable/getspeed.js'
import getResulSpeed from '../windtable/getresulspeed.js'
import getDirection from '../windtable/getdirection.js'
import getWindType from '../windtable/getwindtype.js'

export default (_this) => {
  let map = _this.map
  map.addControl(new Zoom({ // 缩放控件
    zoomInTipLabel: '放大',
    zoomOutTipLabel: '缩小',
    className: 'ol-zoom-custom'
  }))

  map.addControl(new ZoomSlider()) // 滑块控件

  map.addControl(new ScaleLine({
    units: 'metric'
  }))

  map.addControl(new MousePosition({ // 鼠标位置控件
    className: 'ol-mousePosition-custom',
    projection: 'EPSG:4326',
    undefinedHTML: '未知',
    coordinateFormat: (coord) => {
      return olCoordinate.toStringHDMS(coord)
    }
  }))

  map.addControl(new OverviewMap({ // 鹰眼控件
    className: 'ol-overviewmap ol-overviewMap-custom',
    layers: [
      mapLayer[_this.$wivsConfig.map.vector]()
    ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,
    tipLabel: '鹰眼'
  }))
  let setOverviewMap = () => {
    let ifOn = true
    let overviewMap = document.getElementsByClassName('ol-overviewmap')[0]
    overviewMap.removeChild(overviewMap.lastElementChild)
    let overviewMapBtn = document.createElement('button')
    overviewMapBtn.title = '鹰眼'
    overviewMapBtn.innerHTML = '\u00BB'
    overviewMap.appendChild(overviewMapBtn)
    overviewMapBtn.onclick = () => {
      if (ifOn) {
        overviewMap.style.right = '-28.4em'
        ifOn = false
        overviewMapBtn.innerHTML = '\u00AB'
      } else {
        overviewMap.style.right = '0em'
        ifOn = true
        overviewMapBtn.innerHTML = '\u00BB'
      }
    }
  }
  setOverviewMap()

  let zoomToExtentContainer = createOlControl('ol-zoomtoextent-custom') // 复位控件
  let zoomToExtent = document.createElement('button')
  zoomToExtent.innerHTML = 'E'
  zoomToExtent.title = '复位'
  zoomToExtentContainer.appendChild(zoomToExtent)
  let setzoomToExtent = () => {
    let view = map.getView()
    zoomToExtent.onclick = () => {
      view.animate({
        center: _this.$wivsConfig.map.viewOpt.center,
        zoom: 4,
        duration: 250
      })
    }
  }
  setzoomToExtent()

  let switchControlContainer = createOlControl('ol-switchcontrol-custom') // 图层切换控件
  let switchControl = document.createElement('button')
  switchControl.innerHTML = 'S'
  switchControl.title = '切换图层'
  switchControlContainer.appendChild(switchControl)
  let setSwitch = () => {
    let ifOn = false
    let vectorLayer = _this.layers.vectorLayer
    let imageLayer = _this.layers.imageLayer
    let markLayer = _this.layers.markLayer
    switchControl.onclick = () => {
      ifOn = !ifOn
      _this.currentLayer = !_this.currentLayer
      vectorLayer.setVisible(!ifOn)
      imageLayer.setVisible(ifOn)
      markLayer.setVisible(ifOn)
    }
  }
  setSwitch()

  let graticulesControlContainer = createOlControl('ol-graticulescontrol-custom') // 经纬网控件
  let graticulesControl = document.createElement('button')
  graticulesControl.innerHTML = '▦'
  graticulesControl.title = '经纬网'
  graticulesControlContainer.appendChild(graticulesControl)
  let setGraticules = () => {
    let ifOn = false
    let graticulesLayer = _this.layers.graticulesLayer
    graticulesControl.onclick = () => {
      if (ifOn) {
        graticulesLayer.setSource(new VectorSource())
        ifOn = false
      } else {
        createGraticules(map, graticulesLayer)
        ifOn = true
      }
    }
    map.on('moveend', () => {
      if (ifOn) {
        createGraticules(map, graticulesLayer)
      }
    })
    map.getView().on('change:resolution', () => {
      if (ifOn) {
        createGraticules(map, graticulesLayer)
      }
    })
  }
  setGraticules()

  let geolocationControlContainer = createOlControl('ol-geolocationcontrol-custom') // 定位控件
  let geolocationControl = document.createElement('button')
  geolocationControl.innerHTML = '⨀'
  geolocationControl.title = '定位'
  geolocationControlContainer.appendChild(geolocationControl)
  let setGeolocation = () => {
    let accuracyFeature = new Feature()
    let positionFeature = new Feature()
    positionFeature.setStyle(new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: '#3399CC'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2
        })
      })
    }))
    let geolocationLayer = _this.layers.geolocationLayer
    geolocationLayer.setSource(new VectorSource({
      features: [accuracyFeature, positionFeature]
    }))
    let geolocation = new Geolocation({
      projection: map.getView().getProjection(),
      tracking: true,
      trackingOptions: {
        maximumAge: 10000,
        enableHighAccuracy: true,
        timeout: 600000
      }
    })
    geolocationControl.onclick = () => {
      if (!geolocation.getTracking()) {
        geolocation.setTracking(true)
        return
      }
      if (geolocation.getPosition() === undefined) {
        alert('定位失败，无法获取位置')
        return
      }
      let coordinates1 = olProj.transform(geolocation.getPosition(), 'EPSG:3857', 'EPSG:4326')
      if (coordinates1) {
        let coordinates2 = wgs84ToGcj02(coordinates1[0], coordinates1[1])
        map.getView().animate({
          center: coordinates2,
          zoom: 14,
          duration: 3000
        })
      }
    }
    geolocation.on('change:accuracyGeometry', () => {
      let coordinates1 = olProj.transform(geolocation.getPosition(), 'EPSG:3857', 'EPSG:4326')
      let coordinates2 = wgs84ToGcj02(coordinates1[0], coordinates1[1])
      let accuracy = geolocation.getAccuracy()
      accuracyFeature.setGeometry(new Circle(coordinates2, accuracy))
    })
    geolocation.on('change:position', () => {
      let coordinates1 = olProj.transform(geolocation.getPosition(), 'EPSG:3857', 'EPSG:4326')
      let coordinates2 = wgs84ToGcj02(coordinates1[0], coordinates1[1])
      positionFeature.setGeometry(coordinates2 ? new Point(coordinates2) : null)
    })
  }
  setGeolocation()

  map.addControl(new FullScreen({
    className: 'ol-fullscreen-custom',
    tipLabel: '全屏'
  })) // 全屏控件

  let measureControlContainer = createOlControl('ol-measurecontrol-custom') // 测量控件
  let lenghtControl = document.createElement('button')
  lenghtControl.innerHTML = '〜'
  lenghtControl.title = '长度'
  let areaControl = document.createElement('button')
  areaControl.innerHTML = '▭'
  areaControl.title = '面积'
  let clearControl = document.createElement('button')
  clearControl.innerHTML = '×'
  clearControl.title = '清除'
  measureControlContainer.appendChild(lenghtControl)
  measureControlContainer.appendChild(areaControl)
  measureControlContainer.appendChild(clearControl)
  let setMeasure = () => {
    let drawLayer = _this.layers.drawLayer
    let drawObj = {
      draw: null,
      sketch: null,
      ifDrawOn: false,
      helpTipEle: null,
      helpTip: null,
      measureTipEle: {},
      measureTip: {},
      drawId: 0
    }
    lenghtControl.onclick = () => {
      drawInteraction(map, drawLayer, drawObj, 'LineString')
    }
    areaControl.onclick = () => {
      drawInteraction(map, drawLayer, drawObj, 'Polygon')
    }
    clearControl.onclick = () => {
      drawLayer.getSource().clear()
      if (drawObj.helpTip !== null) {
        drawObj.helpTip.setPosition(undefined)
      }
      drawObj.sketch = null
      drawObj.helpTipEle.style.display = 'none'
      map.removeInteraction(drawObj.draw)
      for (let m in drawObj.measureTip) {
        drawObj.measureTip[m].setPosition(undefined)
        delete drawObj.measureTip[m]
      }
      for (let n in drawObj.measureTipEle) {
        if (drawObj.measureTipEle[n].parentNode != null) {
          drawObj.measureTipEle[n].parentNode.removeChild(
            drawObj.measureTipEle[n]
          )
        }
      }
      map.removeInteraction(drawObj.draw)
      drawObj.drawId = 0
    }
    map.on('pointermove', (e) => {
      if (drawObj.helpTip !== null) {
        drawObj.helpTipEle.innerHTML = '单击开始绘制'
        drawObj.helpTip.setPosition(e.coordinate)
      }
      if (drawObj.sketch !== null) {
        if (drawObj.sketch.getGeometry() instanceof LineString) {
          drawObj.helpTipEle.innerHTML = '单击继续绘制线<br/>双击结束绘制'
        } else {
          drawObj.helpTipEle.innerHTML = '单击继续绘制多边形<br/>双击结束绘多边形'
        }
      }
    })
    map.on('dblclick', (e) => {
      if (drawObj.ifDrawOn === false) {
        doubleClickZoom(map, e.pixel)
      }
    })
  }
  setMeasure()

  let searchControlContainer = createOlControl('ol-searchcontrol-custom') // 查询控件
  let searchControl = document.createElement('button')
  searchControl.innerHTML = '?'
  searchControl.title = '查询'
  searchControlContainer.appendChild(searchControl)
  let setSearchControl = () => {
    let ifOn = false
    let mapEle = document.getElementById('map')
    let searchEle = document.createElement('div')
    searchEle.className = 'toolTip'
    let searchOverlay = new Overlay({
      element: searchEle,
      offset: [-15, 0],
      positioning: 'center-right'
    })
    map.addOverlay(searchOverlay)
    searchControl.onclick = () => {
      if (!ifOn) {
        mapEle.style.cursor = 'help'
        ifOn = true
      } else {
        mapEle.style.cursor = 'default'
        searchOverlay.setPosition(undefined)
        ifOn = false
      }
    }
    map.on('pointermove', (e) => {
      if (ifOn) {
        let rainLevel = 0
        let radiusLevel = 0
        searchEle.innerHTML = ''
        searchOverlay.setPosition(undefined)
        let windTable = _this.$warehouse.compInstances.WindTable
        if (windTable.checkedDynamic || windTable.checkedStatic) {
          let coord4326 = windTable.transform3_4(map.getCoordinateFromPixel(e.pixel))
          let fp1 = getFloor(coord4326)[0]
          let fp2 = getFloor(coord4326)[1]
          let windSpeed = getSpeed(coord4326, fp1, fp2, windTable.uData, windTable.vData)
          let resulSpeed = getResulSpeed(windSpeed)
          let direction = getDirection(windSpeed)
          let type = getWindType(resulSpeed)
          let level
          if (type === '1') {
            level = '1-2级'
          }
          if (type === '2') {
            level = '3-4级'
          }
          if (type === '3') {
            level = '5-6级'
          }
          if (type === '4') {
            level = '7-8级'
          }
          if (type === '5') {
            level = '>8级'
          }
          searchEle.innerHTML += '风速：' + resulSpeed + 'm/s<br/>'
          searchEle.innerHTML += '风向：' + direction + '<br/>'
          searchEle.innerHTML += '风级：' + level + '<br/>'
        }
        map.forEachFeatureAtPixel(e.pixel, (feature) => {
          if (feature.rain !== undefined) {
            if (rainLevel <= feature.level && searchEle.innerHTML.indexOf('降水量：' + feature.rain) === -1) {
              rainLevel = feature.level
              searchEle.innerHTML += '降水量：' + feature.rain + '<br/>'
            }
          }
          if (feature.id_ !== undefined && typeof feature.id_ === 'string') {
            if (
              feature.id_.indexOf('typhoon') !== -1 &&
              feature.id_.indexOf('pointIndex') !== -1 &&
              feature.id_.indexOf('radius') === -1 &&
              feature.id_.indexOf('forecastTm') === -1
            ) {
              let featureId = feature.id_.split(':')
              let pointIndex = parseInt(featureId[3])
              searchEle.innerHTML = '第' + (pointIndex + 1) + '点<br/>'
            } else if (feature.id_.indexOf('radius') !== -1) {
              let featureId = feature.id_.split(':')
              if (radiusLevel <= parseInt(featureId[3])) {
                radiusLevel = parseInt(featureId[3])
                searchEle.innerHTML += radiusLevel + '级风圈' + '<br/>'
              }
            } else if (feature.id_.indexOf('forecastTm') !== -1) {
              let featureId = feature.id_.split(':')
              let pointIndex = parseInt(featureId[3])
              let forecastTm = featureId[7]
              searchEle.innerHTML = forecastTm + '第' + (pointIndex + 1) + '台风预测点<br/>'
            }
          }
          if (feature.pressure !== undefined) {
            searchEle.innerHTML += '气压值：' + feature.pressure + 'Pa<br/>'
          }
        })
        if (searchEle.innerHTML !== '') {
          searchOverlay.setPosition(e.coordinate)
        }
      }
    })
  }
  setSearchControl()

  let createDialogControl = () => {
    let fatherContainer = document.getElementsByClassName('ol-overlaycontainer-stopevent')[0]
    let dialogControl = document.createElement('div')
    dialogControl.id = 'Dialog'
    fatherContainer.appendChild(dialogControl)
    let DialogComponent = Vue.extend(Dialog)
    new DialogComponent().$mount('#Dialog')
  }
  createDialogControl()
}
