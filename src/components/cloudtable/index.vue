<template>
  <div class="CloudTable">
    <div>
      <label for="LatestCloud">最新云图：</label>
      <input id="LatestCloud" type="checkbox" :checked="checkded" @click="isChecked"/>
      <label class="CloudTable-Info" v-html="cloudInfo"></label>
    </div>
    <div>
      <label>透明度：</label>
      <button class="CloudTable-OpacityBtn" title="透明度降低" @click="opacityDown">-</button>
      <label class="CloudTable-OpacityLabel" v-html="cloudOpacity"></label>
      <button class="CloudTable-OpacityBtn" title="透明度增加" @click="opacityUp">+</button>
    </div>
    <div>
      <button class="CloudTable-Btn" title="播放云图动画" @click="getClouds">播放</button>
      <button class="CloudTable-Btn" title="暂停云图动画" @click="stop">暂停</button>
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
      cloudInfo: '',
      cloudOpacity: 0.7,
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
    this.MapTable.layers.cloudLayer.setOpacity(this.cloudOpacity)
  },
  methods: {
    opacityUp () { // 透明度加0.1
      if (this.cloudOpacity < 1.0) {
        this.cloudOpacity = (this.cloudOpacity * 10 + 1) / 10
      }
    },
    opacityDown () { // 透明度减0.1
      if (this.cloudOpacity > 0.0) {
        this.cloudOpacity = (this.cloudOpacity * 10 - 1) / 10
      }
    },
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
  },
  watch: {
    cloudOpacity () {
      this.MapTable.layers.cloudLayer.setOpacity(this.cloudOpacity)
    }
  }
}
</script>

<style scoped>
.CloudTable {
  color: #303133;
}
.CloudTable > div {
  font-size: 1.3em;
  line-height: 1.6em;
}
.CloudTable > div input {
  vertical-align: middle;
}
.CloudTable-Info {
  display: inline-block;
  width: 10em;
  height: 1.6em;
  text-align: center;
  vertical-align: middle;
  font-size: 0.9em;
}
.CloudTable-OpacityBtn {
  border: none;
  width: 1.25em;
  height: 1.25em;
  border-radius: 0.125em;
}
.CloudTable-OpacityBtn:hover {
  background-color: rgb(226, 226, 226);
}
.CloudTable-OpacityBtn:active {
  background-color: rgb(206, 206, 206);
}
.CloudTable-OpacityLabel {
  display: inline-block;
  text-align: center;
  width: 2em;
}
.CloudTable-Btn {
  margin: 0.2em 0.4em 0em 0em;
  border: none;
  width: 2.75em;
  height: 2.05em;
}
.CloudTable-Btn:hover {
  background-color: rgb(226, 226, 226);
}
.CloudTable-Btn:active {
  background-color: rgb(206, 206, 206);
}
</style>
