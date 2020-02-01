<template>
  <div class="ChatBox">
    <div class="ChatBox-Head">
      <input type="button" value="返回" @click="back">
      <label v-html="name"></label>
    </div>
    <div class="ChatBox-Body">
      <scroll-box ref="scrollBox" barYWidth="7px" barXHeight="0px" y-slipper-class="ChatBox-Bar-Slipper">
        <template v-slot:content>
          <div class="ChatBox-Body-Item" v-for="(item,index) in msgList" v-bind:key="index">
            <div>{{item.time}}</div>
            <div>
              <div>{{item.name}}：</div>
              <div>{{item.msg}}</div>
            </div>
          </div>
        </template>
      </scroll-box>
    </div>
    <textarea class="ChatBox-textarea" v-model="inputText" @keydown.enter.exact="send" @keydown.enter.ctrl.exact="lineFeed"></textarea>
    <div class="ChatBox-Foot">
      <input type="button" value="发送" @click="send">
    </div>
  </div>
</template>

<script>
import User from './user.vue'
import ScrollBox from '@components/scrollbox/index.vue'

export default {
  data () {
    return {
      name: '',
      inputText: '',
      msgList: []
    }
  },
  components: {
    ScrollBox
  },
  computed: {
    userDialog () {
      return this.$warehouse.compInstances.userDialog
    },
    scrollBox () {
      return this.$refs.scrollBox
    }
  },
  mounted () {
    this.scrollBox.setScrollToBottm()
    this.name = this.userDialog.currentChat
    this.$warehouse.user.send(`chat:${this.userDialog.currentUser},${this.name}`)
    this.$warehouse.user.onmessage = (msg) => {
      let index = msg.data.indexOf(':')
      let type = msg.data.slice(0, index)
      let data = msg.data.slice(index + 1, msg.data.length)
      if (type === 'chat') {
        if (data !== '' && JSON.parse(data)) {
          this.msgList = JSON.parse(data)
        } else {
          this.msgList = []
        }
        this.scrollBox.setScrollToBottm()
      }
    }
  },
  methods: {
    back () {
      this.userDialog.currentComponent = User
      this.userDialog.currentChat = ''
    },
    send (e) {
      e.preventDefault()
      if (this.inputText === '' || this.inputText === '\n') {
        alert('输入为空')
        return ''
      }
      this.$warehouse.user.send(`send:${this.userDialog.currentUser},${this.name},${this.inputText}`)
      this.inputText = ''
    },
    lineFeed () {
      this.inputText += '\n'
    }
  }
}
</script>

<style scoped>
.ChatBox {
  width: 100%;
  height: 100%;
}
.ChatBox-Head {
  width: 100%;
  height: 3em;
  text-align: center;
}
.ChatBox-Head input {
  position: absolute;
  left: 0.2em;
  top: 0.2em;
  border: 0;
  border-radius: 2px;
  padding: 0.3em 0.4em;
  font-family: 'youyuan';
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.ChatBox-Head input:hover {
  background-color: #bdc3c7;
}
.ChatBox-Head label {
  display: inline-block;
  margin-top: 0.3em;
  font-size: 16px;
  font-family: 'youyuan';
}
.ChatBox-Body {
  width: 99%;
  height: calc(100% - 13.5em);
  border-radius: 5px;
  border: 1px solid lightgray;
}
.ChatBox-textarea {
  margin-top: 0.2em;
  width: 94%;
  height: 3em;
  padding: 0.5em;
}
.ChatBox-Foot {
  text-align: right;
  width: 99%;
  height: 4em;
}
.ChatBox-Foot input {
  position: relative;
  top: 0.5em;
  border: 0;
  border-radius: 2px;
  width: 4em;
  height: 2em;
  padding: 0.3em 0.4em;
  font-family: 'youyuan';
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.ChatBox-Foot input:hover {
  background-color: #bdc3c7;
}
.ChatBox-Body-Item {
  width: 27.1em;
  padding: 0.2em;
}
.ChatBox-Body-Item > div:nth-child(1) {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-family: 'youyuan';
}
.ChatBox-Body-Item > div:nth-child(2) > div:nth-child(1) {
  font-size: 18px;
  font-family: 'youyuan';
}
.ChatBox-Body-Item > div:nth-child(2) > div:nth-child(2) {
  font-size: 15px;
  font-family: 'youyuan';
  word-wrap: break-word;
  word-break: break-all;
  padding: 0.5em 0.2em 0em 1em;
}
</style>
<style>
.ChatBox-Bar-Slipper {
  background-color: #bdc3c7;
  border-radius: 10px;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.ChatBox-Bar-Slipper:hover {
  background-color: #95a5a6;
}
</style>
