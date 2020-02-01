<template>
  <div class="PressureTable">
    <div>
      <label for="atmosPressure">大气气压：</label>
      <input id="atmosPressure" type="checkbox" :checked="checked" @click="isChecked"/>
      <label class="PressureTable-Info" v-html="pressureInfo"></label>
    </div>
    <div>
      <label>图例：</label>
      <div class="PressureTable-Legend">
        <div>
          <img src="/img/low.png">
          <label>：低压</label>
        </div>
        <div>
          <img src="/img/high.png">
          <label>：高压</label>
        </div>
        <div>
          <img src="/img/pressure.png">
          <label>：气压值</label>
        </div>
        <div>
          <img src="/img/pressureLine.png">
          <label>：等压线</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clearLayer from './clearlayer.js'
import drawLayer from './drawlayer.js'

export default {
  data () {
    return {
      checked: false,
      pressureInfo: ''
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTable
    }
  },
  methods: {
    isChecked () {
      if (!this.checked) {
        this.checked = true
        this.getPressureJson(this.callback)
      } else {
        clearLayer(this)
        this.pressureInfo = ''
        this.checked = false
      }
    },
    getPressureJson (callback) {
      this.$axios({
        method: 'get',
        url: `${this.$wivsConfig.pressure.api}`
      }).then(callback)
    },
    callback (res) {
      let data = res.data
      drawLayer(this, data)
    }
  }
}
</script>

<style scoped>
.PressureTable {
  color: #303133;
}
.PressureTable > div {
  font-size: 1.3em;
  line-height: 1.6em;
}
.PressureTable > div input {
  vertical-align: middle;
}
.PressureTable-Info {
  display: inline-block;
  width: 10em;
  height: 1.6em;
  text-align: center;
  vertical-align: middle;
  font-size: 0.9em;
}
.PressureTable-Legend {
  padding-left: 1em;
}
.PressureTable-Legend label {
  font-size: 0.8em;
}
.PressureTable-Legend img {
  position: relative;
  top: 0.35em;
}
</style>
