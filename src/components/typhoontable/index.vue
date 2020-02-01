<template>
  <div class="TyphoonTable">
    <div>
      <label for="Line24">24小时警戒线：</label>
      <input id="Line24" type="checkbox" :checked="checked24" @click="is24Checked"/>
    </div>
    <div>
      <label for="Line48">48小时警戒线：</label>
      <input id="Line48" type="checkbox" :checked="checked48" @click="is48Checked"/>
    </div>
    <div>
      <label for="pathControl">路径详情面板：</label>
      <input id="pathControl" type="checkbox" :checked="checkedPath" style="margin-left:0.125em;" @click="pathControl"/>
    </div>
    <div>
      <label for="animationRoute">路径动画：</label>
      <input :checked="checkedAnimationRoute" @click="isAnimationChecked" id="animationRoute" type="checkbox"/>
    </div>
    <div>
      <label for="TyphoonTable-clePathBtn">路径清空：</label>
      <button id="TyphoonTable-clePathBtn" title="清空所有台风路径" @click="cleAllPath">×</button>
    </div>
    <div>
      <label>图例：</label>
      <div class="TyphoonTable-Legend-Level">
        <label>台风等级：</label>
        <div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-TyphoonType" style="background-color:#00ff00;"></div>
            <label>热带低压</label>
          </div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-TyphoonType" style="background-color:#0000ff;"></div>
            <label>热带风暴</label>
          </div>
        </div>
        <div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-TyphoonType" style="background-color:#ffff00;"></div>
            <label>强热带风暴</label>
          </div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-TyphoonType" style="background-color:#ff9900;"></div>
            <label>台风</label>
          </div>
        </div>
        <div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-TyphoonType" style="background-color:#ff00ff;"></div>
            <label>强台风</label>
          </div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-TyphoonType" style="background-color:#ff0000;"></div>
            <label>超强台风</label>
          </div>
        </div>
      </div>
      <div class="TyphoonTable-Legend-Radius">
        <label>台风风圈：</label>
        <div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-RadiusType" style="background-color:rgba(230,145,56,0.5);"></div>
            <label>7级风圈</label>
          </div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-RadiusType" style="background-color:rgba(127,96,0,0.5);"></div>
            <label>10级风圈</label>
          </div>
          <div>
          <div class="TyphoonTable-Legend-Group">
            <div class="TyphoonTable-Legend-RadiusType" style="background-color:rgba(152,0,0,0.5);"></div>
            <label>12级风圈</label>
          </div>
          </div>
        </div>
      </div>
      <div class="TyphoonTable-Legend-Institutions">
        <label>预报机构：</label>
        <div>
          <img src="/img/forecast-01.png">
          <label>中国</label>
          <img src="/img/forecast-03.png">
          <label>日本</label>
          <img src="/img/forecast-05.png">
          <label>美国</label>
        </div>
        <div>
          <img src="/img/forecast-02.png">
          <label>中国香港</label>
          <img src="/img/forecast-04.png">
          <label>中国台湾</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cordon from './cordon.js'
import TyphoonDialog from '@components/typhoondialog/index.vue'

export default {
  data () {
    return {
      checked24: false,
      checked48: false,
      checkedPath: false,
      checkedAnimationRoute: false,
      tyPopupStore: {}
    }
  },
  computed: {
    MapTable () {
      return this.$warehouse.compInstances.MapTable
    },
    Dialog () {
      return this.$warehouse.compInstances.Dialog
    },
    typhoonDialogObj () {
      return this.$warehouse.compInstances.typhoonDialog
    }
  },
  mounted () {
    this.$warehouse.compInstances.TyphoonTable = this
  },
  methods: {
    is24Checked () {
      if (!this.checked24) {
        this.checked24 = true
        cordon(this, 'cordon24')
      } else {
        this.checked24 = false
        cordon(this, 'remove24')
      }
    },
    is48Checked () {
      if (!this.checked48) {
        this.checked48 = true
        cordon(this, 'cordon48')
      } else {
        this.checked48 = false
        cordon(this, 'remove48')
      }
    },
    pathControl () {
      if (this.checkedPath) {
        this.Dialog.removeTab(TyphoonDialog)
        this.checkedPath = false
      } else {
        this.Dialog.addTab('台风', TyphoonDialog)
        this.checkedPath = true
      }
    },
    isAnimationChecked () {
      this.checkedAnimationRoute = !this.checkedAnimationRoute
    },
    cleAllPath () {
      let typhoonLayer = this.MapTable.layers.typhoonLayer
      if (this.typhoonDialogObj != null) {
        for (let m in this.typhoonDialogObj.listItems) {
          this.typhoonDialogObj.listItems[m].checked = false
        }
        for (let n in this.typhoonDialogObj.currentItems) {
          this.typhoonDialogObj.currentItems[n].checked = false
        }
        typhoonLayer.getSource().clear()
        this.typhoonDialogObj.isTyChecked = {}
        let tyOverlay = this.typhoonDialogObj.tyOverlay
        for (let i in tyOverlay) {
          tyOverlay[i].setPosition(undefined)
          clearInterval(this.typhoonDialogObj.timer[i])
        }
        this.typhoonDialogObj.tyOverlay = {}
        this.typhoonDialogObj.timer = {}
        let tyPopup = this.tyPopupStore
        for (let j in tyPopup) {
          tyPopup[j].setPosition(undefined)
        }
        this.tyPopupStore = {}
      }
    }
  }
}
</script>

<style scoped>
.TyphoonTable {
  color: #303133;
}
.TyphoonTable > div {
  font-size: 1.3em;
  line-height: 1.6em;
}
.TyphoonTable > div input {
  vertical-align: middle;
}
#TyphoonTable-clePathBtn {
  border: none;
  width: 1.25em;
  height: 1.25em;
  border-radius: 0.125em;
}
#TyphoonTable-clePathBtn:hover {
  background-color: rgb(226, 226, 226);
}
#TyphoonTable-clePathBtn:active {
  background-color: rgb(206, 206, 206);
}
.TyphoonTable-Legend-Level {
  padding-left: 1em;
}
.TyphoonTable-Legend-Level label {
  font-size: 0.8em;
}
.TyphoonTable-Legend-Radius {
  padding-left: 1em;
}
.TyphoonTable-Legend-Radius label {
  font-size: 0.8em;
}
.TyphoonTable-Legend-Institutions {
  padding-left: 1em;
}
.TyphoonTable-Legend-Institutions label {
  font-size: 0.8em;
}
.TyphoonTable-Legend-Group {
  display: inline-block;
  width: 7.2em;
  vertical-align: middle;
}
.TyphoonTable-Legend-TyphoonType,.TyphoonTable-Legend-RadiusType {
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin-right: 0.4em;
  position: relative;
  top: 0.23em;
}
.TyphoonTable-Legend-Institutions > div {
  margin-left: -0.6em;
  width: 15em;
  text-align: center;
}
.TyphoonTable-Legend-Institutions > div * {
  margin-right: 0.5em;
}
</style>
