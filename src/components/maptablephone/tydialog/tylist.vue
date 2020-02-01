<template>
  <div class="TyList">
    <div class="TyList-Head">
      <select v-model="year">
        <option v-for="(yearItem,index) in yearBox" :key="index" v-html="yearItem"></option>
      </select>
      <input @click="searchTyList('history')" type="button" value="查询">
      <input @click="searchTyList('current')" style="width:5em;" type="button" value="当前台风">
      <input @click="cleTyphoonList" type="button" value="清空">
    </div>
    <div class="TyList-List" ref="tyList">
      <div v-for="item in currentItems" :key="item.tfid" class="TyList-List-Item">
        <input type="checkbox" @click="createTy($event,item.tfid)" v-model="item.checked">
        <div @click="searchInfo(item.tfid)">
          {{item.tfid}} {{item.name}} {{item.enname}} {{item.strong}}
          <br>
          <i style="font-size:12px;">{{item.time}}</i>
        </div>
      </div>
      <div v-for="item in listItems" :key="item.tfid" class="TyList-List-Item">
        <input type="checkbox" @click="createTy($event,item.tfid)" v-model="item.checked">
        <div @click="searchInfo(item.tfid)">
          {{item.tfid}} {{item.name}} {{item.enname}}
          <br>
          <i style="font-size:12px;">{{item.starttime}} {{item.endtime}}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myJsonp from '@tools/myjsonp.js'
import createTyphoon from '@components/typhoondialog/createtyphoon.js'
import clickPoint from '@components/typhoondialog/clickpoint.js'

export default {
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
      return this.$warehouse.compInstances.MapTablePhone
    },
    TyphoonTable () {
      return this.$warehouse.compInstances.TyphoonTable
    },
    TyphoonInfo () {
      return this.$warehouse.compInstances.TyphoonInfo
    },
    tyList () {
      return this.$refs.tyList
    }
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
          }
        } else {
          for (let i in data) {
            if (this.isTyChecked[data[i].tfid]) {
              data[i].checked = true
            } else {
              data[i].checked = false
            }
            this.listItems.push(data[i])
          }
        }
        this.tyList.scrollTop = 0
      })
    },
    searchInfo (id) {
      myJsonp(`${this.$wivsConfig.typhoon.api.info}/${id}`, (data) => {
        this.TyphoonInfo.infoItems = {
          id: data[0].tfid,
          points: data[0].points.reverse()
        }
        this.TyphoonInfo.infoLable = data[0].name
        this.TyphoonInfo.tyInfoContent.scrollTop = 0
        this.TyphoonInfo.tyInfo.style.bottom = '0'
      })
    },
    cleTyphoonList () {
      this.currentItems = []
      this.listItems = []
      this.year = ''
    },
    createTy (e, id) {
      createTyphoon(this, e, id)
    }
  }
}
</script>

<style scoped>
.TyList {
  position: relative;
  width: 100%;
  height: 70%;
}
.TyList-Head {
  width: 100%;
  height: 2.5em;
  padding: 0 0.3em;
}
.TyList-Head input[type='button'] {
  border: 0;
  border-radius: 0.1em;
  padding: 0.1em;
  margin: 0 0.4em;
}
.TyList-List {
  width: 100%;
  height: 85%;
  border: 1px solid lightgray;
  box-sizing: border-box;
  margin: 0 0.1em;
  overflow: hidden;
  overflow-y: scroll;
}
.TyList-List-Item {
  box-sizing: border-box;
  width: 25.7em;
  padding: 0 0.2em;
  font-family: "YouYuan";
  border-right: 1px solid #bdc3c7;
  border-bottom: 1px solid #bdc3c7;
  background-color: transparent;
  cursor: default;
}
.TyList-List-Item:active {
  background-color: #dfe6e9;
}
.TyList-List-Item input {
  vertical-align: top;
  margin-top: 0.3em;
  margin-right: 0.2em;
}
.TyList-List-Item div {
  display: inline-block;
  font-size: 14px;
}
</style>
