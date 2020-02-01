<template>
  <div class="TyDialog-Content-TyTable">
    <div class="TyDialog-Content-Title">
      <span>台风</span>
    </div>
    <div class="TyDialog-Content-Body">
      <div>
        <input type="checkbox" value="rain" :checked="checked24" @click="is24Checked"><span>24小时警戒线</span>
      </div>
      <div>
        <input type="checkbox" value="rain" :checked="checked48" @click="is48Checked"><span>48小时警戒线</span>
      </div><br>
      <div>
        <input type="checkbox" :checked="checkedAnimationRoute" @click="isAnimationChecked"><span>路径动画</span>
      </div>
      <div>
        <input type="button" value="x" class="TyDialog-CleBtn" @click="cleAllPath"><span>路径清空</span>
      </div>
    </div>
  </div>
</template>

<script>
import cordon from '@components/typhoontable/cordon.js'

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
      return this.$warehouse.compInstances.MapTablePhone
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
.TyDialog-Content-TyTable {
  position: relative;
  width: 100%;
  height: 24%;
  margin-top: 0.4em;
  margin-bottom: 0.3em;
}
.TyDialog-Content-Title {
  width: 100%;
  height: 1.8em;
}
.TyDialog-Content-Body {
  width: 100%;
  height: calc(100% - 1.8em);
}
.TyDialog-Content-Body div {
  display: inline-block;
  box-sizing: border-box;
  width: 50%;
  height: 45%;
  padding-left: 1em;
}
.TyDialog-Content-Body div input {
  vertical-align: middle;
}
.TyDialog-Content-Body div input[type='button'] {
  width: 1em;
  height: 1.3em;
}
</style>
