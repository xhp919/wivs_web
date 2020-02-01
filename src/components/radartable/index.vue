<template>
  <div class="RadarTable">
    <div>
      <label for="LatestRadar">最新雷达：</label>
      <input id="LatestRadar" type="checkbox" :checked="checkded" @click="isChecked"/>
      <label class="RadarTable-Info" v-html="radarInfo"></label>
    </div>
    <div>
      <label>透明度：</label>
      <button class="RadarTable-OpacityBtn" title="透明度降低" @click="opacityDown">-</button>
      <label class="RadarTable-OpacityLabel" v-html="radarOpacity"></label>
      <button class="RadarTable-OpacityBtn" title="透明度增加" @click="opacityUp">+</button>
    </div>
    <div>
      <button class="RadarTable-Btn" title="播放雷达图动画" @click="getRadars">播放</button>
      <button class="RadarTable-Btn" title="暂停雷达图动画" @click="stop">暂停</button>
    </div>
    <div>
      <label>图例：</label>
      <div class="RadarTable-Legend">
        <div class="RadarTable-Legend-Color">
          <div style="background-color:#00FFFF;"></div>
          <div style="background-color:#00FF00;"></div>
          <div style="background-color:#009900;"></div>
          <div style="background-color:#FFFF00;"></div>
          <div style="background-color:#FFCC00;"></div>
          <div style="background-color:#FF9900;"></div>
          <div style="background-color:#FF0000;"></div>
        </div>
        <div class="RadarTable-Legend-Label">
          <div>15</div>
          <div>20</div>
          <div>25</div>
          <div>30</div>
          <div>35</div>
          <div>40</div>
          <div>45</div>
          <div>dBZ</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myAjax from '@tools/myajax.js'
import Static from 'ol/source/ImageStatic'
import * as olProj from 'ol/proj'

export default {
  data () {
    return {
      checkded: false,
      radarInfo: '',
      radarOpacity: 1,
      imgs: [],
      timer: null,
      counter: 0
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTable
    }
  },
  mounted () {
    this.MapTable.layers.radarLayer.setOpacity(this.radarOpacity)
  },
  methods: {
    opacityUp () { // 透明度加0.1
      if (this.radarOpacity < 1.0) {
        this.radarOpacity = (this.radarOpacity * 10 + 1) / 10
      }
    },
    opacityDown () { // 透明度减0.1
      if (this.radarOpacity > 0.0) {
        this.radarOpacity = (this.radarOpacity * 10 - 1) / 10
      }
    },
    isChecked () {
      if (!this.checkded) {
        this.checkded = true
        this.getRadar()
      } else {
        this.checkded = false
        this.stop()
        this.counter = 0
        this.clearLayer()
        this.radarInfo = ''
      }
    },
    getRadar () {
      myAjax('get', this.$wivsConfig.radar.api, (xhr) => {
        let data = JSON.parse(xhr.responseText)
        let radarUrl = `https://tf.istrongcloud.com${data.radarCloud.radarUrl}`
        let radarRange = data.radarCloud.radarRange
        myAjax('get', radarUrl, (xhr2) => {
          let data2 = JSON.parse(xhr2.responseText)
          let name = data2[data2.length - 1].name
          let imgUrl = data2[data2.length - 1].url
          let radarLayer = this.MapTable.layers.radarLayer
          radarLayer.setSource(new Static({
            url: imgUrl,
            projection: 'EPSG:3857',
            imageExtent: olProj.transformExtent([radarRange[0][1], radarRange[0][0], radarRange[1][1], radarRange[1][0]], 'EPSG:4326', 'EPSG:3857')
          }))
          radarLayer.setVisible(true)
          this.radarInfo = `${name.substring(0, 4)}/${name.substring(4, 6)}/${name.substring(6, 8)} ${name.substring(8, 10)}:${name.substring(10, 12)}`
        })
      })
    },
    getRadars () {
      if (!this.checkded || this.timer !== null) {
        return
      }
      myAjax('get', this.$wivsConfig.radar.api, (xhr) => {
        let data = JSON.parse(xhr.responseText)
        let radarUrl = `https://tf.istrongcloud.com${data.radarCloud.radarUrl}`
        let radarRange = data.radarCloud.radarRange
        myAjax('get', radarUrl, (xhr2) => {
          let data2 = JSON.parse(xhr2.responseText)
          let radarLayer = this.MapTable.layers.radarLayer
          radarLayer.setVisible(true)
          for (let i of data2) {
            let radarSource = new Static({
              url: i.url,
              projection: 'EPSG:3857',
              imageExtent: olProj.transformExtent([radarRange[0][1], radarRange[0][0], radarRange[1][1], radarRange[1][0]], 'EPSG:4326', 'EPSG:3857')
            })
            this.imgs.push({
              name: i.name,
              source: radarSource
            })
          }
          this.timer = setInterval(() => {
            if (this.counter > this.imgs.length - 1) {
              this.counter = 0
            }
            radarLayer.setSource(this.imgs[this.counter].source)
            this.radarInfo = `${this.imgs[this.counter].name.substring(0, 4)}/${this.imgs[this.counter].name.substring(4, 6)}/${this.imgs[this.counter].name.substring(6, 8)} ${this.imgs[this.counter].name.substring(8, 10)}:${this.imgs[this.counter].name.substring(10, 12)}`
            if (this.counter < this.imgs.length - 1) {
              this.counter++
            } else {
              this.counter = 0
            }
          }, 200)
        })
      })
    },
    stop () {
      clearInterval(this.timer)
      this.timer = null
    },
    clearLayer () {
      let radarLayer = this.MapTable.layers.radarLayer
      radarLayer.setVisible(false)
    }
  },
  watch: {
    radarOpacity () {
      this.MapTable.layers.radarLayer.setOpacity(this.radarOpacity)
    }
  }
}
</script>

<style scoped>
.RadarTable {
  color: #303133;
}
.RadarTable > div {
  font-size: 1.3em;
  line-height: 1.6em;
}
.RadarTable > div input {
  vertical-align: middle;
}
.RadarTable-Info {
  display: inline-block;
  width: 10em;
  height: 1.6em;
  text-align: center;
  vertical-align: middle;
  font-size: 0.9em;
}
.RadarTable-OpacityBtn {
  border: none;
  width: 1.25em;
  height: 1.25em;
  border-radius: 0.125em;
}
.RadarTable-OpacityBtn:hover {
  background-color: rgb(226, 226, 226);
}
.RadarTable-OpacityBtn:active {
  background-color: rgb(206, 206, 206);
}
.RadarTable-OpacityLabel {
  display: inline-block;
  text-align: center;
  width: 2em;
}
.RadarTable-Btn {
  margin: 0.2em 0.4em 0.2em 0em;
  border: none;
  width: 2.75em;
  height: 2.05em;
}
.RadarTable-Btn:hover {
  background-color: rgb(226, 226, 226);
}
.RadarTable-Btn:active {
  background-color: rgb(206, 206, 206);
}
.RadarTable-Legend {
  padding-left: 1em;
}
.RadarTable-Legend-Color {
  display: flex;
  justify-content: space-evenly;
  height: 1em;
  width: 11em;
}
.RadarTable-Legend-Color div {
  width: 2em;
  height: 100%;
}
.RadarTable-Legend-Label {
  display: flex;
  justify-content: space-evenly;
  height: 1em;
  width: 13em;
}
.RadarTable-Legend-Label div {
  width: 2em;
  height: 100%;
  font-style: italic;
}
</style>
