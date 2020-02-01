<template>
  <div class="DialogPhone-Content-Radar">
    <div>
      <span>气象雷达</span>
      <span v-html="radarInfo" style="margin-left:0.5em;"></span>
    </div>
    <div>
      <div>
        <input type="checkbox" value="radar" :checked="checkded" @click="isChecked"><span>最新雷达</span>
      </div>
      <div>
        <input type="button" value="播放" @click="getRadars">
      </div>
      <div>
        <input type="button" value="暂停" @click="stop">
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
      return this.$warehouse.compInstances.MapTablePhone
    }
  },
  mounted () {
    this.MapTable.layers.radarLayer.setOpacity(this.radarOpacity)
  },
  methods: {
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
  }
}
</script>

<style scoped>
.DialogPhone-Content-Radar {
  position: relative;
  width: 100%;
  height: 18%;
}
.DialogPhone-Content-Radar div {
  position: relative;
  width: 100%;
  padding: 0 0.2em;
}
.DialogPhone-Content-Radar div:nth-child(1) {
  margin-top: 0.5em;
  height: 30%;
}
.DialogPhone-Content-Radar div:nth-child(2) {
  text-align: center;
  height: 70%;
}
.DialogPhone-Content-Radar div:nth-child(2) > div {
  display: inline-block;
  width: 30%;
}
.DialogPhone-Content-Radar div input {
  vertical-align: middle;
  border: 0;
  border-radius: 0.2em;
  padding: 0.1em 0.3em;
}
.DialogPhone-Content-Radar div input[type='button'] {
  background-color: #bdc3c7;
}
</style>
