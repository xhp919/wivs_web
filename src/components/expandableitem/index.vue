<template>
  <div class="ExpandableItem">
    <div class="ExpandableItem-Title" @click="clickTitle">
      <slot name="title"></slot>
    </div>
    <div class="ExpandableItem-Content" ref="content">
      <div class="ExpandableItem-Wrap" ref="wrap">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      seen: false
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      if (this.seen) {
        this.fit()
      }
    })
  },
  methods: {
    slideToggle () { // 计算并设置选项展开的高度
      let content = this.$refs.content
      let contentHeight = content.clientHeight === 0 ? (() => {
        let wrap = this.$refs.wrap
        let wrapStyle = window.getComputedStyle(wrap)
        return (wrap.clientHeight + parseInt(wrapStyle.borderTopWidth) + parseInt(wrapStyle.borderBottomWidth)) + 'px'
      })() : '0px'
      content.style.height = contentHeight
    },
    fit () { // 用于调整浏览器缩放比变化时展开框高度的变化
      let content = this.$refs.content
      let wrap = this.$refs.wrap
      let wrapStyle = window.getComputedStyle(wrap)
      let contentHeight = (wrap.clientHeight + parseInt(wrapStyle.borderTopWidth) + parseInt(wrapStyle.borderBottomWidth)) + 'px'
      content.style.height = contentHeight
    },
    clickTitle () {
      this.slideToggle()
      this.seen = !this.seen
    }
  }
}
</script>

<style scoped>
.ExpandableItem {
  height: auto;
}
.ExpandableItem-Title {
  padding-left: 0.625em;
  font-size: 1.6em;
  font-family: "STXihei";
  line-height: 2.5em;
  color: #303133;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: default;
  -webkit-transition: color 0.3s;
  -moz-transition: color 0.3s;
  -o-transition: color 0.3s;
  transition: color 0.3s;
}
.ExpandableItem-Title:hover {
  color: rgb(67, 163, 170);
}
.ExpandableItem-Content {
  height: 0;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: height 0.6s;
  -moz-transition: height 0.6s;
  -o-transition: height 0.6s;
  transition: height 0.6s;
  cursor: default;
}
.ExpandableItem-Wrap {
  padding: 0.8em 0.8em 0.8em 2em;
}
</style>
