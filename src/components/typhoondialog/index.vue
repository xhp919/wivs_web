<template>
  <div class="TyphoonDialog">
    <div class="TyphoonDialog-Info">
      <div class="TyphoonDialog-Title">
        <div>
          <label v-html="infoLable"></label>
        </div>
        <input @click="cleTyphoonInfo" type="button" value="清空">
      </div>
      <div class="TyphoonDialog-Info-Table">
        <div>
          <table cellspacing="0" cellpadding="0">
            <tr class="TyphoonDialog-Info-tr">
              <th>时间</th>
              <th>气压</th>
              <th>风力</th>
              <th>移速</th>
            </tr>
          </table>
        </div>
        <div class="TyphoonDialog-Info-Content">
          <scroll-box ref="scrollBoxTable" barYWidth="5px" barXHeight="0px" y-slipper-class="TyphoonDialog-Bar-Slipper">
            <template v-slot:content>
              <tr v-for="(item, index) in infoItems.points" :key="index" @click="zoomToPoi(infoItems.id,infoItems.points.length-index-1)" @dblclick="showHist(infoItems.id,infoItems.points.length-index)" class="TyphoonDialog-Info-Row">
                <td>{{item.time}}</td>
                <td>{{item.pressure}}</td>
                <td>{{item.power}}</td>
                <td>{{item.movespeed}}</td>
              </tr>
            </template>
          </scroll-box>
        </div>
      </div>
    </div>
    <div class="TyphoonDialog-List">
      <div class="TyphoonDialog-Title">
        <div>
          <label>台风列表</label>
        </div>
        <select v-model="year">
          <option v-for="(yearItem,index) in yearBox" :key="index" v-html="yearItem"></option>
        </select>
        <input @click="cleTyphoonList" type="button" value="清空">
        <input @click="searchTyList('current')" style="width:5em;" type="button" value="当前台风">
        <input @click="searchTyList('history')" type="button" value="查询">
      </div>
      <div class="TyphoonDialog-List-List">
        <scroll-box ref="scrollBoxList" barYWidth="5px" barXHeight="0px" y-slipper-class="TyphoonDialog-Bar-Slipper">
          <template v-slot:content>
            <div v-for="item in currentItems" :key="item.tfid" class="TyphoonDialog-List-Item">
              <input type="checkbox" @click="createTy($event,item.tfid)" v-model="item.checked">
              <div @click="searchInfo(item.tfid)">
                {{item.tfid}} {{item.name}} {{item.enname}} {{item.strong}}
                <br>
                <i style="font-size:12px;">{{item.time}}</i>
              </div>
            </div>
            <div v-for="item in listItems" :key="item.tfid" class="TyphoonDialog-List-Item">
              <input type="checkbox" @click="createTy($event,item.tfid)" v-model="item.checked">
              <div @click="searchInfo(item.tfid)">
                {{item.tfid}} {{item.name}} {{item.enname}}
                <br>
                <i style="font-size:12px;">{{item.starttime}} {{item.endtime}}</i>
              </div>
            </div>
          </template>
        </scroll-box>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBox from '@components/scrollbox/index.vue'
import myJsonp from '@tools/myjsonp.js'
import createTyphoon from './createtyphoon.js'
import zoomToPoint from './zoomtopoint.js'
import showHistory from './showhistory.js'
import clickPoint from './clickpoint.js'

export default {
  name: 'typhoonDialog',
  data () {
    return {
      year: '',
      yearBox: [],
      currentItems: [],
      listItems: [],
      infoItems: [],
      isTyChecked: {},
      tyOverlay: {},
      timer: {},
      infoLable: '台风详情',
      isAnimationOn: false,
      zoomToPointTimer: null
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTable
    },
    TyphoonTable () {
      return this.$warehouse.compInstances.TyphoonTable
    },
    scrollBoxTable () {
      return this.$refs.scrollBoxTable
    },
    scrollBoxList () {
      return this.$refs.scrollBoxList
    }
  },
  components: {
    ScrollBox
  },
  mounted () {
    this.$warehouse.compInstances.typhoonDialog = this
    this.yearBox = this.getYears()
    this.MapTable.map.on('click', e => {
      let finallFeature
      this.MapTable.map.forEachFeatureAtPixel(e.pixel, (feature) => {
        if (feature.id_ !== undefined && typeof feature.id_ === 'string') {
          if (feature.id_.indexOf('typhoon') !== -1 && feature.id_.indexOf('pointIndex') !== -1 && feature.id_.indexOf('radius') === -1) {
            finallFeature = feature
          }
        }
      })
      if (finallFeature) {
        clickPoint(this, finallFeature)
      }
    })
  },
  methods: {
    getYears () {
      let currentYear = (new Date()).getFullYear()
      let yearBox = []
      let year = 1945
      while (currentYear >= year) {
        yearBox.push(currentYear)
        currentYear--
      };
      return yearBox
    },
    searchTyList (type) {
      let url
      let year = this.year
      if (type === 'current') {
        url = this.$wivsConfig.typhoon.api.current
      } else if (year === '') {
        return
      } else {
        url = `${this.$wivsConfig.typhoon.api.list}/${year}`
      }
      myJsonp(url, (data) => {
        if (data.length === 0 && type === 'current') {
          alert('当前无台风')
          return
        }
        this.currentItems = []
        this.listItems = []
        if (type === 'current') {
          for (let i in data) {
            if (this.isTyChecked[data[i].tfid]) {
              data[i].checked = true
            } else {
              data[i].checked = false
            }
            this.currentItems.push(data[i])
            this.scrollBoxList.content.scrollTop = 0
          }
        } else {
          for (let i in data) {
            if (this.isTyChecked[data[i].tfid]) {
              data[i].checked = true
            } else {
              data[i].checked = false
            }
            this.listItems.push(data[i])
            this.scrollBoxList.setScrollTop(0)
          }
        }
      })
    },
    searchInfo (id) {
      myJsonp(`${this.$wivsConfig.typhoon.api.info}/${id}`, (data) => {
        this.infoItems = {
          id: data[0].tfid,
          points: data[0].points.reverse()
        }
        this.infoLable = data[0].name
        this.scrollBoxTable.setScrollTop(0)
      })
    },
    cleTyphoonList () {
      this.currentItems = []
      this.listItems = []
      this.year = ''
    },
    cleTyphoonInfo () {
      this.infoItems = []
      this.infoLable = '台风详情'
    },
    createTy (e, id) {
      createTyphoon(this, e, id)
    },
    zoomToPoi (id, pointIndex) {
      zoomToPoint(this, id, pointIndex)
    },
    showHist (id, length) {
      showHistory(this, id, length)
    }
  }
}
</script>

<style scoped>
.TyphoonDialog {
  width: 100%;
  height: calc(100% - 1em);
  position: relative;
  padding: 0.6em 0em 0em 0em;
}
.TyphoonDialog-Info {
  width: 100%;
  height: 50%;
}
.TyphoonDialog-List {
  width: 100%;
  height: 50%;
}
.TyphoonDialog-Title {
  height: 2.5em;
  width: 100%;
  position: relative;
}
.TyphoonDialog-Title > div {
  display: inline-block;
  height: 100%;
  width: 6.5em;
  vertical-align: bottom;
}
.TyphoonDialog-Title > div label {
  font-size: 15px;
  line-height: 20px;
  vertical-align: middle;
  font-family: "YouYuan";
}
.TyphoonDialog-Title input[type="button"] {
  margin-left: 0.3em;
  text-align: center;
  vertical-align: middle;
  font-family: "YouYuan";
  width: 3em;
  height: 1.5em;
  border: 0;
  float: right;
  background-color: #ecf0f1;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.TyphoonDialog-Title input[type="button"]:hover {
  background-color: #d5dce0;
}
.TyphoonDialog-Title input[type="button"]:active {
  background-color: #95a5a6;
}
.TyphoonDialog-Title select {
  width: 4em;
  margin-left: 0.2em;
  margin-bottom: 0.4em;
}
.TyphoonDialog-Info-Table {
  position: relative;
  width: 100%;
  height: calc(100% - 2.5em);
}
.TyphoonDialog-Info-tr {
  width: 100%;
  height: 2em;
  box-sizing: border-box;
}
.TyphoonDialog-Info-tr th {
  background-color: #ecf0f1;
  color: #303133;
  font-size: 13px;
  font-family: "YouYuan";
  box-sizing: border-box;
}
.TyphoonDialog-Info-tr th:nth-child(1) {
  width: 9.4em;
  border-right: 1px solid #bdc3c7;
}
.TyphoonDialog-Info-tr th:nth-child(2) {
  width: 3.9em;
  border-right: 1px solid #bdc3c7;
}
.TyphoonDialog-Info-tr th:nth-child(3) {
  width: 3.88em;
  border-right: 1px solid #bdc3c7;
}
.TyphoonDialog-Info-tr th:nth-child(4) {
  width: 4.4em;
}
.TyphoonDialog-Info-Content {
  width: 100%;
  height: calc(100% - 2.5em);
  box-sizing: border-box;
  border-left: 1px solid #bdc3c7;
  border-bottom: 1px solid #bdc3c7;
}
.TyphoonDialog-Info-Row {
  background-color: transparent;
  cursor: default;
}
.TyphoonDialog-Info-Row:hover {
  background-color: #dfe6e9;
}
.TyphoonDialog-Info-Row td {
  font-size: 10px;
  box-sizing: border-box;
  line-height: 24px;
  text-align: center;
  border-bottom: 1px solid #bdc3c7;
  border-right: 1px solid #bdc3c7;
}
.TyphoonDialog-Info-Row td:nth-child(1) {
  width: 12em;
}
.TyphoonDialog-Info-Row td:nth-child(2) {
  width: 5.1em;
}
.TyphoonDialog-Info-Row td:nth-child(3) {
  width: 5em;
}
.TyphoonDialog-Info-Row td:nth-child(4) {
  width: 5em;
}
.TyphoonDialog-List-List {
  width: 100%;
  height: calc(100% - 2.5em);
  box-sizing: border-box;
  border-top: 1px solid #bdc3c7;
  border-left: 1px solid #bdc3c7;
  border-bottom: 1px solid #bdc3c7;
}
.TyphoonDialog-List-Item {
  box-sizing: border-box;
  width: 27.2em;
  padding: 0.5em;
  font-family: "YouYuan";
  border-right: 1px solid #bdc3c7;
  border-bottom: 1px solid #bdc3c7;
  background-color: transparent;
  cursor: default;
}
.TyphoonDialog-List-Item:hover {
  background-color: #dfe6e9;
}
.TyphoonDialog-List-Item input {
  vertical-align: top;
  margin-top: 0.3em;
  margin-right: 0.2em;
}
.TyphoonDialog-List-Item div {
  display: inline-block;
  font-size: 14px;
}
</style>
<style>
.TyphoonDialog-Bar-Slipper {
  background-color: #bdc3c7;
  border-radius: 15px;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.TyphoonDialog-Bar-Slipper:hover {
  background-color: #95a5a6;
}
</style>
