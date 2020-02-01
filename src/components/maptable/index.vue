<template>
  <div class="MapTable MapTable-Width1" ref="MapTable">
    <div id="map">
      <iframe class="MapTable-Iframe" ref="iframe"></iframe>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import Loadmap from './loadmap.js'
import initLayers from './initlayers.js'
import initControls from './initcontrols.js'

export default {
  data () {
    return {
      map: null,
      layers: {},
      currentLayer: true
    }
  },
  computed: {
    MapTable () {
      return this.$refs.MapTable
    },
    iframe () {
      return this.$refs.iframe
    }
  },
  mounted () {
    this.$warehouse.compInstances.MapTable = this
    this.map = Loadmap('map', this.$wivsConfig.map.viewOpt, this.$wivsConfig.map.controlsOpt, this.$wivsConfig.map.interactionsOpt)
    initLayers(this)
    initControls(this)
    this.onMapResize()
  },
  methods: {
    stretch () { // 展开
      this.MapTable.className = 'MapTable MapTable-Width-Transition MapTable-Width2'
      setTimeout(() => {
        this.MapTable.className = 'MapTable MapTable-Width2'
      }, 600)
    },
    shrink () { // 收起
      this.MapTable.className = 'MapTable MapTable-Width-Transition MapTable-Width1'
      setTimeout(() => {
        this.MapTable.className = 'MapTable MapTable-Width1'
      }, 600)
    },
    onMapResize () {
      let timer = null
      this.iframe.contentWindow.addEventListener('resize', () => {
        timer = setTimeout(() => {
          clearTimeout(timer)
          this.map.updateSize()
        }, 600)
      })
    }
  }
}
</script>

<style scoped>
.MapTable {
  height: calc(100vh - 5.2em);
  background-color: #34495e;
  position: relative;
  float: right;
}
#map {
  width: 100%;
  height: 100%;
}
.MapTable-Iframe {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0;
  border: 0;
}
</style>

<style>
.MapTable-Width1 {
  width: calc(100vw - 24em);
}
.MapTable-Width2 {
  width: 100vw;
}
.MapTable-Width-Transition {
  -webkit-transition: width 0.6s;
  -moz-transition: width 0.6s;
  -o-transition: width 0.6s;
  transition: width 0.6s;
}
</style>
