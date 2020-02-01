<template>
  <div class="DialogPhone-Content-Cloud">
    <div>
      <span>卫星云图</span>
      <span v-html="cloudInfo" style="margin-left:0.5em;"></span>
    </div>
    <div>
      <div>
        <input type="checkbox" value="cloud" :checked="checked" @click="isChecked"><span>最新云图</span>
      </div>
      <div>
        <input type="button" value="播放" @click="getClouds">
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
      checked: false,
      cloudInfo: '',
      cloudOpacity: 0.7,
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
    this.MapTable.layers.cloudLayer.setOpacity(this.cloudOpacity)
  },
  methods: {
    isChecked () {
      if (!this.checkded) {
        this.checkded = true
        this.getCloud()
      } else {
        this.checkded = false
        this.stop()
        this.counter = 0
        this.clearLayer()
        this.cloudInfo = ''
      }
    },
    getCloud () {
      myAjax('get', this.$wivsConfig.cloud.api, (xhr) => {
        let data = JSON.parse(xhr.responseText)
        let cloudUrl = `https://tf.istrongcloud.com${data.radarCloud.cloudUrl}`
        let cloudRange = data.radarCloud.cloudRange
        myAjax('get', cloudUrl, (xhr2) => {
          let data2 = JSON.parse(xhr2.responseText)
          let name = data2[data2.length - 1].name
          let imgUrl = data2[data2.length - 1].url
          let cloudLayer = this.MapTable.layers.cloudLayer
          cloudLayer.setSource(new Static({
            url: imgUrl,
            projection: 'EPSG:3857',
            imageExtent: olProj.transformExtent([cloudRange[0][1], cloudRange[0][0], cloudRange[1][1], cloudRange[1][0]], 'EPSG:4326', 'EPSG:3857')
          }))
          cloudLayer.setVisible(true)
          this.cloudInfo = `${name.substring(0, 4)}/${name.substring(4, 6)}/${name.substring(6, 8)} ${name.substring(8, 10)}:${name.substring(10, 12)}`
        })
      })
    },
    getClouds () {
      if (!this.checkded || this.timer !== null) {
        return
      }
      myAjax('get', this.$wivsConfig.cloud.api, (xhr) => {
        let data = JSON.parse(xhr.responseText)
        let cloudUrl = `https://tf.istrongcloud.com${data.radarCloud.cloudUrl}`
        let cloudRange = data.radarCloud.cloudRange
        myAjax('get', cloudUrl, (xhr2) => {
          let data2 = JSON.parse(xhr2.responseText)
          let cloudLayer = this.MapTable.layers.cloudLayer
          cloudLayer.setVisible(true)
          for (let i of data2) {
            let cloudSource = new Static({
              url: i.url,
              projection: 'EPSG:3857',
              imageExtent: olProj.transformExtent([cloudRange[0][1], cloudRange[0][0], cloudRange[1][1], cloudRange[1][0]], 'EPSG:4326', 'EPSG:3857')
            })
            this.imgs.push({
              name: i.name,
              source: cloudSource
            })
          }
          this.timer = setInterval(() => {
            if (this.counter > this.imgs.length - 1) {
              this.counter = 0
            }
            cloudLayer.setSource(this.imgs[this.counter].source)
            this.cloudInfo = `${this.imgs[this.counter].name.substring(0, 4)}/${this.imgs[this.counter].name.substring(4, 6)}/${this.imgs[this.counter].name.substring(6, 8)} ${this.imgs[this.counter].name.substring(8, 10)}:${this.imgs[this.counter].name.substring(10, 12)}`
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
      let cloudLayer = this.MapTable.layers.cloudLayer
      cloudLayer.setVisible(false)
    }
  }
}
</script>

<style scoped>
.DialogPhone-Content-Cloud {
  position: relative;
  width: 100%;
  height: 18%;
}
.DialogPhone-Content-Cloud div {
  position: relative;
  width: 100%;
  padding: 0 0.2em;
}
.DialogPhone-Content-Cloud div:nth-child(1) {
  margin-top: 0.5em;
  height: 30%;
}
.DialogPhone-Content-Cloud div:nth-child(2) {
  text-align: center;
  height: 70%;
}
.DialogPhone-Content-Cloud div:nth-child(2) > div {
  display: inline-block;
  width: 30%;
}
.DialogPhone-Content-Cloud div input {
  vertical-align: middle;
  border: 0;
  border-radius: 0.2em;
  padding: 0.1em 0.3em;
}
.DialogPhone-Content-Cloud div input[type='button'] {
  background-color: #bdc3c7;
}
</style>
