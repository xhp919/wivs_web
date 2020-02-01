<template>
  <div class="TyInfo" ref="tyInfo">
    <label v-html="infoLable"></label>
    <div class="TyInfo-Close">
      <button @click="close">x</button>
    </div>
    <div class="TyInfo-Info">
      <div class="TyInfo-Info-Table">
        <div>
          <table cellspacing="0" cellpadding="0">
            <tr class="TyInfo-Info-tr">
              <th>时间</th>
              <th>气压</th>
              <th>风力</th>
              <th>移速</th>
            </tr>
          </table>
        </div>
        <div class="TyInfo-Info-Content" ref="tyInfoContent">
          <tr v-for="(item, index) in infoItems.points" :key="index" @click="zoomToPoi(infoItems.id,infoItems.points.length-index-1)" class="TyInfo-Info-Row">
            <td>{{item.time}}</td>
            <td>{{item.pressure}}</td>
            <td>{{item.power}}</td>
            <td>{{item.movespeed}}</td>
          </tr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import zoomToPoint from '@components/typhoondialog/zoomtopoint.js'

export default {
  data () {
    return {
      infoLable: '',
      infoItems: []
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTablePhone
    },
    TyphoonTable () {
      return this.$warehouse.compInstances.TyphoonTable
    },
    typhoonDialog () {
      return this.$warehouse.compInstances.typhoonDialog
    },
    tyInfo () {
      return this.$refs.tyInfo
    },
    tyInfoContent () {
      return this.$refs.tyInfoContent
    }
  },
  mounted () {
    this.$warehouse.compInstances.TyphoonInfo = this
  },
  methods: {
    cleTyphoonInfo () {
      this.infoItems = []
      this.infoLable = '台风详情'
    },
    zoomToPoi (id, pointIndex) {
      zoomToPoint(this.typhoonDialog, id, pointIndex)
    },
    close () {
      this.tyInfo.style.bottom = '-20em'
    }
  }
}
</script>

<style scoped>
.TyInfo {
  position: absolute;
  width: 100%;
  height: 20em;
  bottom: -20em;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  -webkit-transition: bottom 0.6s;
  -moz-transition: bottom 0.6s;
  -o-transition: bottom 0.6s;
  transition: bottom 0.6s;
}
.TyInfo label {
  position: absolute;
  font-size: 16px;
  font-family: 'youyuan';
}
.TyInfo-Close {
  width: 100%;
  height: 2em;
  text-align: right;
}
.TyInfo-Close button {
  background-color: transparent;
  border: 0;
  margin: 0.2em 0.5em;
  font-size: 16px;
}
.TyInfo-Info {
  width: 100%;
  height: 88%;
}
.TyInfo-Info {
  width: 100%;
  height: 50%;
}
.TyInfo-Info-Table {
  position: relative;
  width: 100%;
  height: 18.2em;
}
.TyInfo-Info-tr {
  position: relative;
  width: 100%;
  height: 2em;
  box-sizing: border-box;
}
.TyInfo-Info-tr th {
  background-color: #ecf0f1;
  color: #303133;
  font-size: 13px;
  font-family: "YouYuan";
  box-sizing: border-box;
  width: 100%;
}
.TyInfo-Info-tr th:nth-child(1) {
  width: 20em;
  border-right: 1px solid #bdc3c7;
}
.TyInfo-Info-tr th:nth-child(2) {
  width: 20%;
  border-right: 1px solid #bdc3c7;
}
.TyInfo-Info-tr th:nth-child(3) {
  width: 20%;
  border-right: 1px solid #bdc3c7;
}
.TyInfo-Info-tr th:nth-child(4) {
  width: 20%;
}
.TyInfo-Info-Content {
  width: 100%;
  height: calc(100% - 2.5em);
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: scroll;
}
.TyInfo-Info-Row {
  background-color: transparent;
  cursor: default;
}
.TyInfo-Info-Row:hover {
  background-color: #dfe6e9;
}
.TyInfo-Info-Row td {
  font-size: 10px;
  box-sizing: border-box;
  line-height: 24px;
  text-align: center;
  border-bottom: 1px solid #bdc3c7;
  border-right: 1px solid #bdc3c7;
}
.TyInfo-Info-Row td:nth-child(1) {
  width: 20em;
}
.TyInfo-Info-Row td:nth-child(2) {
  width: 20%;
}
.TyInfo-Info-Row td:nth-child(3) {
  width: 20%;
}
.TyInfo-Info-Row td:nth-child(4) {
  width: 20%;
}
</style>
