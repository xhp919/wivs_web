<template>
  <div class="DialogPhone-Content-Pressure">
    <div>
      <span>气压</span>
    </div>
    <div>
      <div>
        <input type="checkbox" :checked="checked" @click="isChecked"><span>大气气压</span>
      </div>
    </div>
  </div>
</template>

<script>
import clearLayer from '@components/pressuretable/clearlayer.js'
import drawLayer from '@components/pressuretable/drawlayer.js'

export default {
  data () {
    return {
      checked: false,
      pressureInfo: ''
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTablePhone
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
.DialogPhone-Content-Pressure {
  position: relative;
  width: 100%;
  height: 18%;
}
.DialogPhone-Content-Pressure div {
  position: relative;
  width: 100%;
  padding: 0 0.2em;
}
.DialogPhone-Content-Pressure div:nth-child(1) {
  margin-top: 0.5em;
  height: 30%;
}
.DialogPhone-Content-Pressure div:nth-child(2) {
  margin-left: 1em;
  height: 70%;
}
.DialogPhone-Content-Pressure div:nth-child(2) > div {
  display: inline-block;
  width: 30%;
}
.DialogPhone-Content-Pressure div input {
  vertical-align: middle;
  border: 0;
  border-radius: 0.2em;
  padding: 0.1em 0.3em;
}
.DialogPhone-Content-Pressure div input[type='button'] {
  background-color: #bdc3c7;
}
</style>
