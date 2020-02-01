<template>
  <div class="SearchBox">
    <div style="position:relative;display:inline-block;" ref="searchbox">
      <input class="SearchBox-Search" placeholder="请输入城市名或 [经度,纬度]" v-model="cityName" ref="search" v-on:keyup.enter="goThere">
      <span class="SearchBox-SearchCle" @click="cleBox">✕</span>
      <div class="SearchBox-Result" ref="result" v-show="ifShow">
        <scroll-box barYWidth="6px" barXHeight="0px" y-slipper-class="SearchBox-Bar-Slipper">
          <template v-slot:content>
            <div class="SearchBox-ResultChild" v-for="(item, index) in searchResult" :key="index" @mousedown="showText(item.n)"><span>{{item.n}}</span></div>
          </template>
        </scroll-box>
      </div>
    </div>
    <button class="SearchBox-GoThere" @click="goThere">到这去</button>
  </div>
</template>

<script>
import ScrollBox from '@components/scrollbox/index.vue'
import * as olProj from 'ol/proj'

export default {
  data () {
    return {
      cityName: '',
      searchResult: [],
      ifShow: false,
      ifClickChild: false
    }
  },
  components: {
    ScrollBox
  },
  computed: {
    searchbox () {
      return this.$refs.searchbox
    },
    result () {
      return this.$refs.result
    },
    search () {
      return this.$refs.search
    }
  },
  mounted () {
    this.search.onfocus = () => {
      this.searchCity()
    }
    this.search.onblur = () => {
      this.ifShow = false
    }
    document.getElementById('map').addEventListener('click', () => {
      this.search.blur()
    })
  },
  methods: {
    cleBox () {
      this.cityName = ''
      this.searchResult = []
    },
    goThere () {
      if (this.cityName === '') {
        return
      }
      let coordinate
      if (RegExp(/\[/).test(this.cityName) && RegExp(/\]/).test(this.cityName) && RegExp(/,/).test(this.cityName)) {
        try {
          coordinate = JSON.parse(this.cityName)
          if (coordinate[1] > 90 || coordinate[1] < -90) {
            coordinate = null
            alert('纬度超出范围')
          }
        } catch {
          alert('格式错误')
        }
      }
      for (let i of this.searchResult) {
        if (i.n === this.cityName) {
          this.searchResult = []
          coordinate = i.coordinate
        }
      }
      if (coordinate) {
        let map = this.$warehouse.compInstances.MapTable.map
        map.getView().animate({
          center: olProj.transform(coordinate, 'EPSG:4326', 'EPSG:3857'),
          zoom: 10,
          duration: 250
        })
      }
    },
    searchCity () {
      if (this.cityName === '') {
        this.searchResult = []
        return
      }
      this.$axios({
        method: 'post',
        url: this.$wivsConfig.city.api,
        data: { city: this.cityName }
      }).then((res) => {
        this.searchResult = res.data
      })
    },
    showText (city) {
      this.cityName = city
      this.ifShow = false
      this.ifClickChild = true
    }
  },
  watch: {
    cityName () {
      if (!this.ifClickChild) {
        this.searchCity()
      }
      this.ifClickChild = false
    },
    searchResult () {
      if (this.searchResult.length !== 0) {
        this.ifShow = true
      } else {
        this.ifShow = false
      }
    }
  }
}
</script>

<style scoped>
.SearchBox {
  position: absolute;
  right: 38em;
  top: 1em;
}
.SearchBox-Search {
  width: 18.75em;
  height: 2.25em;
  border: none;
  border-radius: 0.3125em;
  border-left: 0.625em solid transparent;
  border-right: 1.7em solid transparent;
}
input::-ms-clear {
  display: none;
}
.SearchBox-GoThere {
  margin-left: 0.5em;
  width: 4em;
  height: 2.25em;
  border: none;
  border-radius: 0.3125em;
  color: white;
  background-color: rgb(12, 126, 134);
}
.SearchBox-GoThere:hover {
  background-color: rgb(9, 104, 110);
}
.SearchBox-GoThere:active {
  background-color: rgb(9, 93, 99);
}
.SearchBox-SearchCle {
  position: absolute;
  color: lightgray;
  top: 0.2em;
  right: 0.35em;
  font-size: 1.6em;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.SearchBox-SearchCle:hover {
  color: gray;
}
.SearchBox-Result {
  position: absolute;
  margin-top: 1em;
  border-radius: 5px;
  width: 100%;
  height: 20em;
  opacity: 0.9;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.SearchBox-Result::before {
  content: '';
  position: absolute;
  background-color: red;
  width: 0;
  height: 0;
  transform: translateY(-4.8px);
  left: calc(50% - 10px);
  border-left: 10px solid rgb(67, 163, 170);
  border-right: 10px solid rgb(67, 163, 170);
  border-bottom: 5px solid white;
}
.SearchBox-ResultChild {
  padding: 0 1em;
  width: 25.5em;
  -webkit-transition: background-color 0.3s;
  -moz-transition: background-color 0.3s;
  -o-transition: background-color 0.3s;
  transition: background-color 0.3s;
}
.SearchBox-ResultChild:hover {
  background-color: #ecf0f1;
}
.SearchBox-ResultChild span {
  font-size: 16px;
  font-family: "STXihei";
  line-height: 30px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: default;
}
</style>
<style>
.SearchBox-Bar-Slipper {
  background-color: #bdc3c7;
  border-radius: 15px;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.SearchBox-Bar-Slipper:hover {
  background-color: #95a5a6;
}
</style>
