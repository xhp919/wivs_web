<template>
  <div class="Dialog ol-control" ref="Dialog">
    <button v-show="buttonShow" :title="buttonTitle" v-html="buttonHtml" @click="switchBtnclick"></button>
    <div class="Dialog-Tab">
      <scroll-box barYWidth="0px" barXHeight="7px" x-slipper-class="Dialog-Bar-Slipper">
        <template v-slot:content>
          <div ref="tabContent"></div>
        </template>
      </scroll-box>
    </div>
    <div class="Dialog-Content">
      <keep-alive>
        <component :is="currentComponent"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import ScrollBox from '@components/scrollbox/index.vue'

export default {
  data () {
    return {
      ifOn: false,
      buttonShow: false,
      buttonTitle: '打开',
      buttonHtml: '\u00AB',
      dialogChilds: 0,
      dialogComponents: [''],
      currentComponent: ''
    }
  },
  computed: {
    Dialog () {
      return this.$refs.Dialog
    },
    tabContent () {
      return this.$refs.tabContent
    }
  },
  components: {
    ScrollBox
  },
  mounted () {
    this.$warehouse.compInstances.Dialog = this
    this.updateTab()
  },
  methods: {
    switchBtnclick () {
      if (this.ifOn) {
        this.Dialog.style.right = '-28.4em'
        this.buttonHtml = '\u00AB'
        this.buttonTitle = '打开'
        this.ifOn = false
      } else if (this.dialogChilds !== 0) {
        this.Dialog.style.right = '0em'
        this.buttonHtml = '\u00BB'
        this.buttonTitle = '收起'
        this.ifOn = true
      }
    },
    updateTab () {
      this.currentComponent = this.dialogComponents[this.dialogComponents.length - 1]
    },
    addTab (name, component, callback) {
      let button = document.createElement('button')
      button.innerHTML = name
      button.id = `Dialog-Tab-button-${component.name}`
      button.className = 'Dialog-Tab-button'
      this.currentComponent = component
      button.onclick = () => {
        this.currentComponent = component
        if (callback !== undefined) {
          callback()
        }
      }
      this.dialogComponents.push(component)
      this.dialogChilds++
      this.tabContent.appendChild(button)
    },
    removeTab (comp) {
      for (let i in this.dialogComponents) {
        if (this.dialogComponents[i] !== '') {
          if (this.dialogComponents[i].name === comp.name) {
            this.dialogComponents.splice(i, 1)
            this.dialogChilds--
            this.tabContent.removeChild(document.getElementById(`Dialog-Tab-button-${comp.name}`))
            this.updateTab()
            break
          }
        }
      }
    }
  },
  watch: {
    currentComponent () {
      for (let i of this.dialogComponents) {
        if (i !== '') {
          if (i.name === this.currentComponent.name) {
            let button = document.getElementById(`Dialog-Tab-button-${this.currentComponent.name}`)
            button.style.color = 'rgb(67, 163, 170)'
          } else {
            let button = document.getElementById(`Dialog-Tab-button-${i.name}`)
            button.style.color = '#303133'
          }
        }
      }
    },
    dialogChilds () {
      if (this.dialogChilds !== 0) {
        this.buttonShow = true
      } else {
        this.buttonShow = false
      }
      if (this.dialogChilds === 0 && this.ifOn) {
        this.switchBtnclick()
      }
      if (this.dialogChilds !== 0 && !this.ifOn) {
        this.switchBtnclick()
      }
    }
  }
}
</script>

<style scoped>
.Dialog {
  position: absolute;
  right: -28.4em;
  top: 17.5em;
  width: 28em;
  height: calc(100vh - 26.5em);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  opacity: 0.8;
  background-color: white;
  -webkit-transition: right 0.6s;
  -moz-transition: right 0.6s;
  -o-transition: right 0.6s;
  transition: right 0.6s;
}
.Dialog > button {
  position: absolute;
  left: -0.8em;
  width: 0.8em;
  height: 3em;
  font-size: 1.6em;
}
.Dialog-Tab {
  position: relative;
  width: 100%;
  height: 3.5em;
  white-space: nowrap;
}
.Dialog-Content {
  position: relative;
  width: 100%;
  height: calc(100% - 3.5em);
}
</style>
<style>
.Dialog-Tab-button {
  display: inline-block!important;
  box-sizing: border-box;
  background-color: transparent!important;
  border-radius: 0!important;
  color: #303133;
  font-family: "YouYuan"!important;
  width: 5em!important;
  height: 2.4em!important;
  margin: 0!important;
  -webkit-transition: background-color 0.6s!important;
  -moz-transition: background-color 0.6s!important;
  -o-transition: background-color 0.6s!important;
  transition: background-color 0.6s!important;
}
.Dialog-Tab-button:hover {
  background-color: #ecf0f1!important;
}
.Dialog-Bar-Slipper {
  background-color: #bdc3c7;
}
.Dialog-Bar-Slipper:hover {
  background-color: #95a5a6;
  -webkit-transition: background-color 0.3s;
  -moz-transition: background-color 0.3s;
  -o-transition: background-color 0.3s;
  transition: background-color 0.3s;
}
.Dialog-Bar-Slipper:active {
  background-color: #7f8c8d;
}
</style>
