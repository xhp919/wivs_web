<template>
  <div class="DialogPhone" ref="dialog">
    <button class="DialogPhone-buttonShow" ref="buttonShow" :title="buttonShowTitle" @click="switchDialog">
      <span v-html="buttonShowHtml"></span>
    </button>
    <div class="DialogPhone-Content">
      <rain></rain>
      <cloud></cloud>
      <radar></radar>
      <wind></wind>
      <pressure></pressure>
    </div>
  </div>
</template>

<script>
import Rain from './rain.vue'
import Cloud from './cloud.vue'
import Radar from './radar.vue'
import Wind from './wind.vue'
import Pressure from './pressure.vue'

export default {
  data () {
    return {
      buttonShowHtml: '\u00AB',
      buttonShowTitle: '打开',
      ifOn: false
    }
  },
  components: {
    Rain,
    Cloud,
    Radar,
    Wind,
    Pressure
  },
  computed: {
    buttonShow () {
      return this.$refs.buttonShow
    },
    dialog () {
      return this.$refs.dialog
    }
  },
  methods: {
    switchDialog () {
      if (this.ifOn) {
        this.dialog.style.right = '-26em'
        this.buttonShowHtml = '\u00AB'
        this.ifOn = false
      } else {
        this.dialog.style.right = 0
        this.buttonShowHtml = '\u00BB'
        this.ifOn = true
      }
    }
  }
}
</script>

<style scoped>
.DialogPhone {
  position: absolute;
  top: 3.2em;
  right: -26em;
  width: 26em;
  height: 21em;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  -webkit-transition: right 0.6s;
  -moz-transition: right 0.6s;
  -o-transition: right 0.6s;
  transition: right 0.6s;
}
.DialogPhone-buttonShow {
  position: absolute;
  left: -1em;
  top: 0.3em;
  width: 1em;
  height: 3em;
  border: 0;
  background-color: rgba(0,60,136,0.5);
  border-radius: 2px;
  color: white;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
}
.DialogPhone-buttonShow span {
  font-size: 16px;
}
.DialogPhone-Content {
  position: relative;
  width: 100%;
  height: 100%;
}
.DialogPhone-Content span {
  font-size: 12px;
  font-family: 'youyuan';
}
</style>
