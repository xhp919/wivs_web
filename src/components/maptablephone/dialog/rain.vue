<template>
  <div class="DialogPhone-Content-Rain">
    <div>
      <span>降水预报</span>
    </div>
    <div>
      <div>
        <input type="checkbox" value="rain" :checked="checked24" @click="is24Checked"><span>24小时</span>
      </div>
      <div>
        <input type="checkbox" value="rain" :checked="checked48" @click="is48Checked"><span>48小时</span>
      </div>
      <div>
        <input type="checkbox" value="rain" :checked="checked72" @click="is72Checked"><span>72小时</span>
      </div>
    </div>
  </div>
</template>

<script>
import clearLayer from '@components/raintable/clearLayer.js'
import drawLayer from '@components/raintable/drawlayer.js'
import myJsonp from '@tools/myjsonp.js'

export default {
  data () {
    return {
      checked24: false,
      checked48: false,
      checked72: false,
      rainOpacity: 0.5
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTablePhone
    }
  },
  mounted () {
    this.MapTable.layers.rainLayer.setOpacity(this.rainOpacity)
  },
  methods: {
    is24Checked () {
      if (!this.checked24) {
        this.getRainJson('24', this.callback)
        this.checked24 = true
        this.checked48 = false
        this.checked72 = false
      } else {
        clearLayer(this)
        this.checked24 = false
      }
    },
    is48Checked () {
      if (!this.checked48) {
        this.getRainJson('48', this.callback)
        this.checked48 = true
        this.checked24 = false
        this.checked72 = false
      } else {
        clearLayer(this)
        this.checked48 = false
      }
    },
    is72Checked () {
      if (!this.checked72) {
        this.getRainJson('72', this.callback)
        this.checked72 = true
        this.checked48 = false
        this.checked24 = false
      } else {
        clearLayer(this)
        this.checked72 = false
      }
    },
    getRainJson (type, callback) {
      myJsonp(`${this.$wivsConfig.rain.api}/${type}`, callback)
    },
    callback (res) {
      let data = JSON.parse(res.contours)
      drawLayer(this, data)
    }
  }
}
</script>

<style scoped>
.DialogPhone-Content-Rain {
  position: relative;
  width: 100%;
  height: 18%;
}
.DialogPhone-Content-Rain div {
  position: relative;
  width: 100%;
  padding: 0 0.2em;
}
.DialogPhone-Content-Rain div:nth-child(1) {
  margin-top: 0.5em;
  height: 30%;
}
.DialogPhone-Content-Rain div:nth-child(2) {
  text-align: center;
  height: 70%;
}
.DialogPhone-Content-Rain div:nth-child(2) > div {
  display: inline-block;
  width: 30%;
}
.DialogPhone-Content-Rain div input {
  vertical-align: middle;
}
</style>
