import './control_phone.css'
import Zoom from 'ol/control/Zoom'
import ScaleLine from 'ol/control/ScaleLine'
import MousePosition from 'ol/control/MousePosition'
import * as olCoordinate from 'ol/coordinate'
import createOlControl from '../maptable/createolcontrol.js'
import createGraticules from '../maptable/creategraticules.js'
import VectorSource from 'ol/source/Vector'
import Geolocation from 'ol/Geolocation'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import * as olProj from 'ol/proj'
import wgs84ToGcj02 from '../maptable/wgs84togcj02.js'
import Circle from 'ol/geom/Circle'
import Point from 'ol/geom/Point'
import Vue from 'vue'
import Dialog from './dialog/index.vue'
import TyDialog from './tydialog/index.vue'
import TyInfo from './tyinfo/index.vue'
import drawInteraction from '../maptable/drawinteraction.js'
import LineString from 'ol/geom/LineString'
import doubleClickZoom from '../maptable/doubleclickzoom.js'

export default (_this) => {
  let map = _this.map
  map.addControl(new Zoom({ // 缩放控件
    zoomInTipLabel: '放大',
    zoomOutTipLabel: '缩小',
    className: 'ol-zoom-custom'
  }))

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
  graticulesControl.innerHTML = 'G'
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
  geolocationControl.innerHTML = 'L'
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

  let measureControlContainer = createOlControl('ol-measurecontrol-custom') // 测量控件
  let lenghtControl = document.createElement('button')
  lenghtControl.innerHTML = '〜'
  lenghtControl.title = '长度'
  let areaControl = document.createElement('button')
  areaControl.innerHTML = '口'
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

  let createDialogControl = () => {
    let fatherContainer = document.getElementById('mapPhone')
    let dialogControl = document.createElement('div')
    dialogControl.id = 'Dialog'
    fatherContainer.appendChild(dialogControl)
    let DialogComponent = Vue.extend(Dialog)
    new DialogComponent().$mount('#Dialog')
  }
  createDialogControl()

  let createTyDialog = () => {
    let fatherContainer = document.getElementById('mapPhone')
    let dialogControl = document.createElement('div')
    dialogControl.id = 'TyDialog'
    fatherContainer.appendChild(dialogControl)
    let DialogComponent = Vue.extend(TyDialog)
    new DialogComponent().$mount('#TyDialog')
  }
  createTyDialog()

  let createTyInfo = () => {
    let fatherContainer = document.getElementById('mapPhone')
    let dialogControl = document.createElement('div')
    dialogControl.id = 'TyInfo'
    fatherContainer.appendChild(dialogControl)
    let DialogComponent = Vue.extend(TyInfo)
    new DialogComponent().$mount('#TyInfo')
  }
  createTyInfo()
}
