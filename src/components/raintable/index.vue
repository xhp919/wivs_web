<template>
  <div class="RainTable">
    <div>
      <label for="Hour24">24小时：</label>
      <input id="Hour24" type="checkbox" :checked="checked24" @click="is24Checked"/>
    </div>
    <div>
      <label for="Hour48">48小时：</label>
      <input id="Hour48" type="checkbox" :checked="checked48" @click="is48Checked"/>
    </div>
    <div>
      <label for="Hour72">72小时：</label>
      <input id="Hour72" type="checkbox" :checked="checked72" @click="is72Checked"/>
    </div>
    <div>
      <label>透明度：</label>
      <button class="RainTable-OpacityBtn" title="透明度降低" @click="opacityDown">-</button>
      <label class="RainTable-OpacityLabel" v-html="rainOpacity"></label>
      <button class="RainTable-OpacityBtn" title="透明度增加" @click="opacityUp">+</button>
    </div>
    <div>
      <label>图例：</label>
      <div class="RainTable-Legend">
        <div>
          <div class="RainTable-Legend-Group">
            <div class="RainTable-Legend-RainType" style="background-color:#80fd50;"></div>
            <label>：0~10ml</label>
          </div>
          <div class="RainTable-Legend-Group">
            <div class="RainTable-Legend-RainType" style="background-color:#3aa402;"></div>
            <label>：10~25ml</label>
          </div>
        </div>
        <div>
          <div class="RainTable-Legend-Group">
            <div class="RainTable-Legend-RainType" style="background-color:#9fc5e8;"></div>
            <label>：25~50ml</label>
          </div>
          <div class="RainTable-Legend-Group">
            <div class="RainTable-Legend-RainType" style="background-color:#0300ff;"></div>
            <label>：50~100ml</label>
          </div>
        </div>
        <div>
          <div class="RainTable-Legend-Group">
            <div class="RainTable-Legend-RainType" style="background-color:#fa00fc;"></div>
            <label>：100~250ml</label>
          </div>
          <div class="RainTable-Legend-Group">
            <div class="RainTable-Legend-RainType" style="background-color:#810040;"></div>
            <label>：>250ml</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clearLayer from './clearLayer.js'
import drawLayer from './drawlayer.js'
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
      return this.$warehouse.compInstances.MapTable
    }
  },
  mounted () {
    this.MapTable.layers.rainLayer.setOpacity(this.rainOpacity)
  },
  methods: {
    opacityUp () { // 透明度加0.1
      if (this.rainOpacity < 1.0) {
        this.rainOpacity = (this.rainOpacity * 10 + 1) / 10
      }
    },
    opacityDown () { // 透明度减0.1
      if (this.rainOpacity > 0.0) {
        this.rainOpacity = (this.rainOpacity * 10 - 1) / 10
      }
    },
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
  },
  watch: {
    rainOpacity () {
      this.MapTable.layers.rainLayer.setOpacity(this.rainOpacity)
    }
  }
}
</script>

<style scoped>
.RainTable {
  color: #303133;
}
.RainTable > div {
  font-size: 1.3em;
  line-height: 1.6em;
}
.RainTable > div input {
  vertical-align: middle;
}
.RainTable-OpacityBtn {
  border: none;
  width: 1.25em;
  height: 1.25em;
  border-radius: 0.125em;
}
.RainTable-OpacityBtn:hover {
  background-color: rgb(226, 226, 226);
}
.RainTable-OpacityBtn:active {
  background-color: rgb(206, 206, 206);
}
.RainTable-OpacityLabel {
  display: inline-block;
  text-align: center;
  width: 2em;
}
.RainTable-Legend {
  padding-left: 1em;
}
.RainTable-Legend label {
  font-size: 0.8em;
}
.RainTable-Legend-Group {
  display: inline-block;
  width: 7.2em;
}
.RainTable-Legend-RainType {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
}
</style>
