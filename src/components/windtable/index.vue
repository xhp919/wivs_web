<template>
  <div class="WindTable">
    <div>
      <label for="dynamicWind">动态风场：</label>
      <input id="dynamicWind" type="checkbox" :checked="checkedDynamic" @click="isDyWindChecked"/>
      <label class="WindTable-Info" v-html="dynamicWindInfo"></label>
    </div>
    <div>
      <label for="staticWind">风速风向：</label>
      <input id="staticWind" type="checkbox" :checked="checkedStatic" @click="isStWindChecked"/>
      <label class="WindTable-Info" v-html="staticWindInfo"></label>
    </div>
    <div>
      <label>图例：</label>
      <div class="WindTable-Legend">
        <div>
          <div class="WindTable-Legend-Group">
            <img src="/img/l1.png">
            <label>：1-2级</label>
          </div>
          <div class="WindTable-Legend-Group">
            <img src="/img/l2.png">
            <label>：3-4级</label>
          </div>
        </div>
        <div>
          <div class="WindTable-Legend-Group">
            <img src="/img/l3.png">
            <label>：5-6级</label>
          </div>
          <div class="WindTable-Legend-Group">
            <img src="/img/l4.png">
            <label>：7-8级</label>
          </div>
        </div>
        <div>
          <div class="WindTable-Legend-Group">
            <img src="/img/l5.png">
            <label>：>8级</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as olProj from 'ol/proj'
import randomBetweenNums from './randombetweennums.js'
import analyWindData from './analywinddata.js'
import getFloor from './getfloor.js'
import getSpeed from './getspeed.js'
import calcNextPoint from './calcnextpoint.js'
import getResulSpeed from './getresulspeed.js'
import getWindType from './getwindtype.js'
import getAngle from './getangle.js'
import createWindSymbol from './createwindsymbol.js'

export default {
  data () {
    return {
      windData: null,
      uData: null,
      vData: null,
      time1: null,
      checkedDynamic: false,
      checkedStatic: false,
      dynamicWindInfo: '',
      staticWindInfo: '',
      windPoints: [],
      stop: null,
      lng1: null,
      lat1: null,
      lng2: null,
      lat2: null,
      lng1_: null,
      lat1_: null,
      lng2_: null,
      lat2_: null
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTable
    },
    canvas () {
      return this.MapTable.layers.WindCanvas
    },
    ctx () {
      return this.canvas.getContext('2d')
    }
  },
  mounted () {
    this.$warehouse.compInstances.WindTable = this
    let map = this.MapTable.map
    let timer = null
    map.on('moveend', () => {
      let viewCenterLng = Math.floor(olProj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[0])
      let viewCenterLat = Math.floor(olProj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[1])
      this.lng1 = viewCenterLng - 86
      this.lat1 = viewCenterLat - 44
      if (this.lat1 > 85) {
        this.lat1 = 85
      }
      if (this.lat1 < 85) {
        this.lat1 = -85
      }
      this.lng2 = viewCenterLng + 86
      this.lat2 = viewCenterLat + 44
      if (this.lat2 > 85) {
        this.lat2 = 85
      }
      if (this.lat2 < -85) {
        this.lat2 = -85
      }
      let extent = olProj.transformExtent(
        map.getView().calculateExtent(map.getSize()),
        'EPSG:3857',
        'EPSG:4326'
      )
      this.lng1_ = extent[0]
      this.lat1_ = extent[1]
      this.lng2_ = extent[2]
      this.lat2_ = extent[3]
      if (this.checkedStatic && timer === null) {
        this.creStaWind(this.windData)
      }
    })
    map.on('movestart', () => {
      if (this.checkedStatic) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    })
    map.getView().on('change:resolution', () => {
      if (this.checkedStatic && map.getView().getZoom() !== 4 && map.getView().getZoom() !== 22) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    })
    map.on('change:size', e => {
      clearTimeout(timer)
      let size = map.getSize()
      this.canvas.width = size[0]
      this.canvas.height = size[1]
      timer = setTimeout(() => {
        if (this.checkedStatic) {
          this.creStaWind(this.windData)
          clearTimeout(timer)
          timer = null
        }
      }, 30)
    })
  },
  methods: {
    isDyWindChecked () {
      if (this.checkedDynamic) {
        window.cancelAnimationFrame(this.stop)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.checkedDynamic = false
        this.dynamicWindInfo = ''
      } else {
        this.checkedDynamic = true
        let time2 = new Date().getMinutes()
        if (!this.checkedStatic || time2 - this.time1 >= 10) {
          this.$axios({
            method: 'get',
            url: this.$wivsConfig.wind.api
          }).then((res) => {
            this.windData = res.data
            this.time1 = new Date().getMinutes()
            this.startWind()
          })
        } else {
          this.startWind()
        }
      }
    },
    isStWindChecked () {
      if (this.checkedStatic) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.checkedStatic = false
        this.staticWindInfo = ''
      } else {
        this.checkedStatic = true
        window.cancelAnimationFrame(this.stop)
        let time2 = new Date().getMinutes()
        if (!this.checkedDynamic || time2 - this.time1 >= 10) {
          this.$axios({
            method: 'get',
            url: this.$wivsConfig.wind.api
          }).then((res) => {
            this.windData = res.data
            this.time1 = new Date().getMinutes()
            this.creStaWind()
          })
        } else {
          this.creStaWind()
        }
      }
    },
    startWind () {
      this.checkedStatic = false
      this.staticWindInfo = ''
      let data = this.windData
      let lng1 = this.lng1
      let lng2 = this.lng2
      let lat1 = this.lat1
      let lat2 = this.lat2
      let analyRes = analyWindData(data)
      this.dynamicWindInfo = analyRes[0]
      this.uData = analyRes[1]
      this.vData = analyRes[2]
      let randomPoints = []
      let steps = []
      let willDos = []
      let pointStores = []
      for (let i = 0; i < 1000; i++) {
        let randomPoint = [
          randomBetweenNums('[', lng1, lng2, ']', false),
          randomBetweenNums('[', lat1, lat2, ']', false)
        ]
        randomPoints.push(randomPoint)
        steps.push(0)
        willDos.push(randomBetweenNums('[', 20, 50, ']', true))
        pointStores.push([this.transform4_3(randomPoint)])
      }
      let start = () => {
        for (let i in pointStores) {
          this.createWind(i, this.uData, this.vData, randomPoints, pointStores, steps, willDos)
        }
        this.draw(pointStores)
        this.stop = window.requestAnimationFrame(start)
      }
      this.stop = window.requestAnimationFrame(start)
    },
    createWind (i, uData, vData, randomPoints, pointStores, steps, willDos) {
      steps[i] = steps[i] + 1
      let fp1 = getFloor(randomPoints[i])[0]
      let fp2 = getFloor(randomPoints[i])[1]
      let windSpeed = getSpeed(randomPoints[i], fp1, fp2, uData, vData)
      let pointNext = calcNextPoint(randomPoints[i], windSpeed[0], windSpeed[1], 4000)
      pointStores[i].push(this.transform4_3(pointNext))
      if (steps[i] === willDos[i]) {
        let lng1 = this.lng1
        let lng2 = this.lng2
        let lat1 = this.lat1
        let lat2 = this.lat2
        randomPoints[i] = [
          randomBetweenNums('[', lng1, lng2, ']', false),
          randomBetweenNums('[', lat1, lat2, ']', false)
        ]
        steps[i] = 0
        willDos[i] = randomBetweenNums('[', 20, 50, ']', true)
        pointStores[i] = [this.transform4_3(randomPoints[i])]
      } else {
        randomPoints[i] = pointNext
      }
    },
    creStaWind () {
      let map = this.MapTable.map
      this.checkedDynamic = false
      this.dynamicWindInfo = ''
      let data = this.windData
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      let lng1 = this.lng1_
      let lng2 = this.lng2_
      let lat1 = this.lat1_
      let lat2 = this.lat2_
      let analyRes = analyWindData(data)
      this.staticWindInfo = analyRes[0]
      this.uData = analyRes[1]
      this.vData = analyRes[2]
      let lngD = lng2 - lng1
      let latD = lat2 - lat1
      let mapXSize = map.getSize()[0]
      let mapYSize = map.getSize()[1]
      // 根据屏幕大小设置行列的风向标数目
      let n = Math.floor(mapXSize / 26)
      let m = Math.floor(mapYSize / 23)
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
          let point = [lng1 + (lngD / n) * i, lat1 + (latD / m) * j]
          let [fp1, fp2] = getFloor(point)
          let windSpeed = getSpeed(point, fp1, fp2, this.uData, this.vData)
          let ResulSpeed = getResulSpeed(windSpeed)
          let type = getWindType(ResulSpeed)
          let angle = getAngle(windSpeed)
          let center = this.coordToPixel(this.transform4_3(point))
          createWindSymbol(this.ctx, center, angle, type)
        }
      }
    },
    draw (pointStores) {
      let canvas = this.canvas
      let ctx = this.ctx
      let currentLayer = this.MapTable.currentLayer
      let color
      if (currentLayer) {
        color = 'rgb(0, 60, 136)'
      } else {
        color = 'rgb(235, 235, 235)'
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineCap = 'round'
      ctx.lineWidth = 0.7
      ctx.strokeStyle = color
      for (let i in pointStores) {
        ctx.beginPath()
        if (pointStores[i].length > 20) {
          pointStores[i].splice(0, 1)
        }
        let ps = pointStores[i]
        for (let j = 0; j < ps.length; j++) {
          let p = ps[j]
          p = this.coordToPixel(p)
          if (j === 0) {
            ctx.moveTo(p[0], p[1])
          } else {
            ctx.lineTo(p[0], p[1])
          }
        }
        ctx.stroke()
      }
    },
    transform4_3 (coordinate) {
      return olProj.transform(coordinate, 'EPSG:4326', 'EPSG:3857')
    },
    transform3_4 (coordinate) {
      return olProj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')
    },
    coordToPixel (coordinate) {
      let map = this.MapTable.map
      return map.getPixelFromCoordinate(coordinate)
    }
  }
}
</script>

<style scoped>
.WindTable {
  color: #303133;;
}
.WindTable > div {
  font-size: 1.3em;
  line-height: 1.6em;
}
.WindTable > div input {
  vertical-align: middle;
}
.WindTable-Info {
  display: inline-block;
  width: 10em;
  height: 1.6em;
  text-align: center;
  vertical-align: middle;
  font-size: 0.9em;
}
.WindTable-Legend {
  padding-left: 1em;
}
.WindTable-Legend label {
  font-size: 0.8em;
}
.WindTable-Legend img {
  position: relative;
  top: 0.23em;
}
.WindTable-Legend-Group {
  display: inline-block;
  width: 7.2em;
}
</style>
