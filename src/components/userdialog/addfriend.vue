<template>
  <div class="AddFriend">
    <div class="AddFriend-Head">
      <input type="button" value="返回" @click="back">
    </div>
    <div class="AddFriend-Search">
      <input placeholder="请输入用户名" type="text" v-model="inputText">
      <input type="button" value="搜索" @click="search">
    </div>
    <div class="AddFriend-Search-Result" v-show="ifShow">
      <scroll-box barYWidth="7px" barXHeight="0px" y-slipper-class="AddFriend-Bar-Slipper">
        <template v-slot:content>
          <div v-for="(item, index) in searchIdRes" :key="index" class="AddFriend-Search-ResultChild"><span>{{item}}</span>
          <input type="button" value="加为好友" @click="addFriend(item)">
        </div>
        </template>
      </scroll-box>
    </div>
  </div>
</template>

<script>
import ScrollBox from '@components/scrollbox/index.vue'
import User from './user.vue'

export default {
  data () {
    return {
      inputText: '',
      ifShow: false,
      searchIdRes: []
    }
  },
  components: {
    ScrollBox
  },
  computed: {
    userDialog () {
      return this.$warehouse.compInstances.userDialog
    }
  },
  methods: {
    back () {
      this.userDialog.currentComponent = User
    },
    search () {
      let user = this.userDialog.currentUser
      this.$warehouse.user.send(`getUsers:${user},${this.inputText}`)
      this.$warehouse.user.onmessage = (msg) => {
        let type = msg.data.split(':')[0]
        let data = msg.data.split(':')[1]
        if (type === 'user') {
          this.searchIdRes = JSON.parse(data)
          if (this.searchIdRes.length === 0) {
            alert('没有匹配到用户')
          }
        }
      }
    },
    addFriend (item) {
      let user = this.userDialog.currentUser
      this.$warehouse.user.send(`addFriend:${user},${item}`)
      alert('已发送好友请求')
    }
  },
  watch: {
    searchIdRes () {
      if (this.searchIdRes.length !== 0) {
        this.ifShow = true
      } else {
        this.ifShow = false
      }
    },
    inputText () {
      if (this.inputText === '') {
        this.searchIdRes = []
      }
    }
  }
}
</script>

<style scoped>
.AddFriend {
  width: 100%;
  height: 100%;
}
.AddFriend-Head {
  width: 100%;
  height: 3em;
  text-align: center;
}
.AddFriend-Head input {
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
.AddFriend-Head input:hover {
  background-color: #bdc3c7;
}
.AddFriend-Search {
  position: relative;
  top: 3em;
  text-align: center;
}
.AddFriend-Search input[type=text] {
  padding: 0 0.3em;
  margin-right: 0.2em;
  height: 2em;
  border: 1px solid lightgray;
  border-radius: 5px;
}
.AddFriend-Search input[type=button] {
  border: 0;
  border-radius: 2px;
  padding: 0.3em 0.4em;
  font-family: 'youyuan';
  width: 3.5em;
  height: 2em;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.AddFriend-Search input[type=button]:hover {
  background-color: #bdc3c7;
}
.AddFriend-Search-Result {
  position: relative;
  width: 16.8em;
  height: 75%;
  top: 3.5em;
  left: 3.1em;
  border: 1px solid lightgray;
  border-radius: 5px;
}
.AddFriend-Search-ResultChild {
  width: 16em;
  height: 2.5em;
  vertical-align: middle;
  padding-top: 0.3em;
  padding-left: 0.3em;
  border-bottom: 1px solid lightgray;
}
.AddFriend-Search-ResultChild:hover {
  background-color: #bdc3c7;
}
.AddFriend-Search-ResultChild span {
  font-size: 14px;
  font-family: 'youyuan';
}
.AddFriend-Search-ResultChild input {
  float: right;
  border: 0;
  border-radius: 2px;
  padding: 0.3em 0.4em;
  margin: 0 0.3em 0 0;
  font-family: 'youyuan';
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
  background-color: #e2e5e5;
}
.AddFriend-Search-ResultChild input:hover {
  background-color: #bdc3c7;
}
</style>
<style>
.AddFriend-Bar-Slipper {
  background-color: #bdc3c7;
  border-radius: 10px;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.AddFriend-Bar-Slipper:hover {
  background-color: #95a5a6;
}
</style>
