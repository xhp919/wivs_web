<template>
  <div class="MapTablePhone">
    <div id="mapPhone"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import Loadmap from '../maptable/loadmap.js'
import initLayers from '../maptable/initlayers.js'
import initControls from './initcontrols.js'

export default {
  data () {
    return {
      map: null,
      layers: {},
      currentLayer: true
    }
  },
  mounted () {
    this.$warehouse.compInstances.MapTablePhone = this
    this.map = Loadmap('mapPhone', this.$wivsConfig.map.viewOpt, this.$wivsConfig.map.controlsOpt, this.$wivsConfig.map.interactionsOpt)
    initLayers(this)
    initControls(this)
  }
}
</script>

<style scoped>
.MapTablePhone {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #34495e;
  overflow: hidden;
}
#mapPhone {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
