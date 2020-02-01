<template>
  <div class="MainTable" ref="MainTable">
    <scroll-box barYWidth="7px" barXHeight="0px" boxClass="MainTable-Scrollbox" bar-y-class="MainTable-Bar-Y" y-slipper-class="MainTable-Bar-Slipper">
      <template v-slot:content>
        <expandable-item>
          <template v-slot:title>
            <span>降水预报</span>
          </template>
          <template v-slot:content>
            <rain-table></rain-table>
          </template>
        </expandable-item>
        <expandable-item>
          <template v-slot:title>
            <span>卫星云图</span>
          </template>
          <template v-slot:content>
            <cloud-table></cloud-table>
          </template>
        </expandable-item>
        <expandable-item>
          <template v-slot:title>
            <span>气象雷达</span>
          </template>
          <template v-slot:content>
            <radar-table></radar-table>
          </template>
        </expandable-item>
        <expandable-item>
          <template v-slot:title>
            <span>台风</span>
          </template>
          <template v-slot:content>
            <typhoon-table></typhoon-table>
          </template>
        </expandable-item>
        <expandable-item>
          <template v-slot:title>
            <span>风场</span>
          </template>
          <template v-slot:content>
            <wind-table></wind-table>
          </template>
        </expandable-item>
        <expandable-item>
          <template v-slot:title>
            <span>气压</span>
          </template>
          <template v-slot:content>
            <pressure-table></pressure-table>
          </template>
        </expandable-item>
      </template>
    </scroll-box>
    <div class="MainTable-Switch" @click="clickSwitch" :title="switchTitle"></div>
  </div>
</template>

<script>
import ExpandableItem from '@components/expandableitem/index.vue'
import ScrollBox from '@components/scrollbox/index.vue'
import RainTable from '@components/raintable/index.vue'
import CloudTable from '@components/cloudtable/index.vue'
import RadarTable from '@components/radartable/index.vue'
import TyphoonTable from '@components/typhoontable/index.vue'
import WindTable from '@components/windtable/index.vue'
import PressureTable from '@components/pressuretable/index.vue'

export default {
  data () {
    return {
      seen: true,
      switchTitle: '收起'
    }
  },
  components: {
    ExpandableItem,
    ScrollBox,
    RainTable,
    CloudTable,
    RadarTable,
    TyphoonTable,
    WindTable,
    PressureTable
  },
  computed: {
    MainTable () {
      return this.$refs.MainTable
    },
    MapTable () {
      return this.$warehouse.compInstances.MapTable
    }
  },
  mounted () {
    this.$warehouse.compInstances.MainTable = this
    this.setScrollBox()
  },
  methods: {
    setScrollBox () {
      let scrollBox = document.getElementsByClassName('MainTable-Scrollbox')[0]
      let barY = document.getElementsByClassName('MainTable-Bar-Y')[0]
      let barYClass = barY.className
      scrollBox.onmouseover = () => {
        barY.className = `${barYClass} ScrollBar-Opacity`
      }
      scrollBox.onmouseout = () => {
        barY.className = `${barYClass}`
      }
    },
    clickSwitch () {
      if (this.seen) {
        this.seen = false
        this.MapTable.stretch()
        this.switchTitle = '打开'
      } else {
        this.seen = true
        this.MapTable.shrink()
        this.switchTitle = '收起'
      }
    }
  }
}
</script>

<style scoped>
.MainTable {
  width: 24em;
  height: calc(100vh - 5.2em);
  position: relative;
  background-color: #fff;
  border: 1px solid lightgray;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  float: right;
}
.MainTable-Switch {
  position: absolute;
  top: calc(50% - 2em);
  right: -1.1em;
  width: 1.1em;
  height: 4em;
  box-sizing: border-box;
  background-color: lightgray;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  opacity: 0.5;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  -webkit-transition: background-color 0.3s;
  -moz-transition: background-color 0.3s;
  -o-transition: background-color 0.3s;
  transition: background-color 0.3s;
}
.MainTable-Switch:hover {
  background-color: #95a5a6;
}
</style>
<style>
.MainTable-Bar-Y {
  -webkit-transition: opacity 0.3s;
  -moz-transition: opacity 0.3s;
  -o-transition: opacity 0.3s;
  transition: opacity 0.3s;
  opacity: 0;
}
.MainTable-Bar-Y:active {
  opacity: 0.5;
}
.MainTable-Bar-Slipper {
  background-color: #b6bdc2;
  border-radius: 20px;
  -webkit-transition: height 0.3s;
  -moz-transition: height 0.3s;
  -o-transition: height 0.3s;
  transition: height 0.3s;
}
.MainTable-Bar-Slipper:hover {
  background-color: #95a5a6;
}
.MainTable-Bar-Slipper:active {
  background-color: #7f8c8d;
}
.ScrollBar-Opacity {
  opacity: 0.5;
}
</style>
