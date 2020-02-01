<template>
  <div class="ScrollBox" ref="ScrollBox">
    <div ref="content">
      <div ref="contentContainter">
        <div style="position:absolute;">
          <slot name="content"></slot>
          <iframe class="ScrollBox-Iframe" ref="iframe"></iframe>
        </div>
      </div>
    </div>
    <div ref="yBar" @click.self="clickYBar">
      <div ref="ySlipper"></div>
    </div>
    <div ref="xBar" @click.self="clickXBar">
      <div ref="xSlipper"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ySlipperSelected: null,
      xSlipperSelected: null,
      htmlDown: false,
      contentScrollHeight: 0,
      contentScrollWidth: 0
    }
  },
  props: {
    boxWidth: {
      type: String,
      default: '100%'
    },
    boxHeight: {
      type: String,
      default: '100%'
    },
    barXHeight: {
      type: String,
      default: '10px'
    },
    barYWidth: {
      type: String,
      default: '10px'
    },
    boxClass: {
      type: String,
      default: ''
    },
    barXClass: {
      type: String,
      default: ''
    },
    barYClass: {
      type: String,
      default: ''
    },
    xSlipperClass: {
      type: String,
      default: ''
    },
    ySlipperClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    ScrollBox () {
      return this.$refs.ScrollBox
    },
    content () {
      return this.$refs.content
    },
    contentContainter () {
      return this.$refs.contentContainter
    },
    iframe () {
      return this.$refs.iframe
    },
    yBar () {
      return this.$refs.yBar
    },
    xBar () {
      return this.$refs.xBar
    },
    ySlipper () {
      return this.$refs.ySlipper
    },
    xSlipper () {
      return this.$refs.xSlipper
    },
    htmlEle () {
      return document.getElementsByTagName('html')[0]
    }
  },
  mounted () {
    this.init()
    this.iframe.contentWindow.addEventListener('resize', () => {
      this.getContentScroll()
    })
    window.addEventListener('resize', () => {
      this.init()
    })

    this.ySlipper.onmousedown = e => {
      this.ySlipperSelected = e.clientX
    }

    this.xSlipper.onmousedown = e => {
      this.xSlipperSelected = e.clientY
    }

    this.htmlEle.addEventListener('mousedown', e => {
      this.htmlDown = true
    })

    this.htmlEle.addEventListener('mouseup', e => {
      this.htmlDown = false
      this.xSlipperSelected = null
      this.ySlipperSelected = null
    })

    this.htmlEle.addEventListener('mouseleave', e => {
      this.htmlDown = false
      this.xSlipperSelected = null
      this.ySlipperSelected = null
    })

    this.htmlEle.addEventListener('mousemove', e => {
      if (this.htmlDown && this.ySlipperSelected) {
        if (Math.abs(e.clientX - this.ySlipperSelected) <= 300) {
          let top = parseFloat(getComputedStyle(this.ySlipper).top)
          let movement = e.movementY
          let endOffset = parseFloat(getComputedStyle(this.yBar).height) - parseFloat(getComputedStyle(this.ySlipper).height)
          if (top + movement >= 0 && top + movement <= endOffset) {
            this.ySlipper.style.top = `${top + movement}px`
            this.content.scrollTop = parseFloat(getComputedStyle(this.ySlipper).top) / this.getYRatio()
          } else if ((top + movement) - endOffset < 1 && (top + movement) - endOffset > 0) {
            this.ySlipper.style.top = `${endOffset}px`
            this.content.scrollTop = parseFloat(getComputedStyle(this.ySlipper).top) / this.getYRatio()
          } else if ((top + movement) - 0 < 0 && (top + movement) - 0 > -1) {
            this.ySlipper.style.top = '0px'
            this.content.scrollTop = parseFloat(getComputedStyle(this.ySlipper).top) / this.getYRatio()
          }
        }
      }
      if (this.htmlDown && this.xSlipperSelected) {
        if (Math.abs(e.clientY - this.xSlipperSelected) <= 300) {
          let left = parseFloat(getComputedStyle(this.xSlipper).left)
          let movement = e.movementX
          let endOffset = parseFloat(getComputedStyle(this.xBar).width) - parseFloat(getComputedStyle(this.xSlipper).width)
          if (left + movement >= 0 && left + movement <= endOffset) {
            this.xSlipper.style.left = `${left + movement}px`
            this.content.scrollLeft = parseFloat(getComputedStyle(this.xSlipper).left) / this.getXRatio()
          } else if ((left + movement) - endOffset < 1 && (left + movement) - endOffset > 0) {
            this.xSlipper.style.left = `${endOffset}px`
            this.content.scrollLeft = parseFloat(getComputedStyle(this.xSlipper).left) / this.getXRatio()
          } else if ((left + movement) - 0 < 0 && (left + movement) - 0 > -1) {
            this.xSlipper.style.left = '0px'
            this.content.scrollLeft = parseFloat(getComputedStyle(this.xSlipper).left) / this.getXRatio()
          }
        }
      }

      this.content.onmousewheel = e => {
        this.content.scrollTop += e.deltaY
        this.ySlipper.style.top = `${this.content.scrollTop * this.getYRatio()}px`
        if (this.barYWidth === '0px') {
          this.content.scrollLeft += e.deltaY
          this.xSlipper.style.left = `${this.content.scrollLeft * this.getXRatio()}px`
        }
      }

      this.yBar.onmousewheel = e => {
        this.content.scrollTop += e.deltaY
        this.ySlipper.style.top = `${this.content.scrollTop * this.getYRatio()}px`
      }

      this.content.addEventListener('DOMMouseScroll', e => { // 兼容火狐浏览器
        this.content.scrollTop += e.detail / 3
        this.ySlipper.style.top = `${this.content.scrollTop * this.getYRatio()}px`
        if (this.barYWidth === '0px') {
          this.content.scrollLeft += e.detail / 3
          this.xSlipper.style.left = `${this.content.scrollLeft * this.getXRatio()}px`
        }
      })

      this.yBar.addEventListener('DOMMouseScroll', e => { // 兼容火狐浏览器
        this.content.scrollTop += e.detail / 3
        this.ySlipper.style.top = `${this.content.scrollTop * this.getYRatio()}px`
      })

      this.xBar.onmousewheel = e => {
        this.content.scrollLeft += e.deltaY
        this.xSlipper.style.left = `${this.content.scrollLeft * this.getXRatio()}px`
      }

      this.xBar.addEventListener('DOMMouseScroll', e => { // 兼容火狐浏览器
        this.content.scrollLeft += e.detail / 3
        this.xSlipper.style.left = `${this.content.scrollLeft * this.getXRatio()}px`
      })
    })
  },
  watch: {
    contentScrollHeight () {
      this.setSlipper()
    },
    contentScrollWidth () {
      this.setSlipper()
    }
  },
  methods: {
    init () {
      this.setScrollBox()
      this.setBar()
      this.setContent()
      this.setSlipper()
    },
    setScrollBox () {
      if (this.boxClass !== '') {
        this.ScrollBox.className = `${this.ScrollBox.className} ${this.boxClass}`
      }
      this.ScrollBox.style.width = this.boxWidth
      this.ScrollBox.style.height = this.boxHeight
    },
    setBar () {
      if (this.barXClass !== '') {
        this.xBar.className = this.barXClass
      }
      if (this.barYClass !== '') {
        this.yBar.className = this.barYClass
      }
      this.xBar.style.width = `calc(${this.boxWidth} - ${this.barYWidth})`
      this.xBar.style.height = this.barXHeight
      this.yBar.style.width = this.barYWidth
      this.yBar.style.height = `calc(${this.boxHeight} - ${this.barXHeight})`
    },
    setContent () {
      this.content.style.width = `calc(${this.boxWidth} - ${this.barYWidth})`
      this.content.style.height = `calc(${this.boxHeight} - ${this.barXHeight})`
    },
    setSlipper () {
      if (this.xSlipperClass !== '') {
        this.xSlipper.className = this.xSlipperClass
      }
      if (this.ySlipperClass !== '') {
        this.ySlipper.className = this.ySlipperClass
      }
      let xRatio = this.getXRatio()
      let yRatio = this.getYRatio()
      this.xSlipper.style.left = `${this.content.scrollLeft * xRatio}px`
      this.ySlipper.style.top = `${this.content.scrollTop * yRatio}px`
      let clientWidth = this.content.clientWidth
      let clientHeight = this.content.clientHeight
      this.xSlipper.style.width = `${clientWidth * xRatio}px`
      this.xSlipper.style.height = `${parseFloat(this.xBar.style.height)}px`
      this.ySlipper.style.width = `${parseFloat(this.yBar.style.width)}px`
      this.ySlipper.style.height = `${clientHeight * yRatio}px`
    },
    getYRatio () {
      let scrollHeight = this.content.scrollHeight
      let clientHeight = this.content.clientHeight
      return clientHeight / scrollHeight
    },
    getXRatio () {
      let scrollWidth = this.content.scrollWidth
      let clientWidth = this.content.clientWidth
      return clientWidth / scrollWidth
    },
    observerDom (el, callback) { // 观察DOM节点的变化
      let resizeObserver = new ResizeObserver(callback)
      resizeObserver.observe(el)
    },
    getContentScroll () {
      this.contentScrollHeight = this.content.scrollHeight
      this.contentScrollWidth = this.content.scrollWidth
    },
    clickYBar (e) {
      let offsetY = e.offsetY
      let yBarHeight = this.yBar.offsetHeight
      let ySlipperHeight = this.ySlipper.offsetHeight
      if ((offsetY + ySlipperHeight * 0.5) < yBarHeight) {
        this.ySlipper.style.top = `${offsetY - ySlipperHeight * 0.5}px`
        if ((offsetY - ySlipperHeight * 0.5) < 0) {
          this.ySlipper.style.top = '0px'
        }
      } else {
        this.ySlipper.style.top = `${yBarHeight - ySlipperHeight}px`
      }
      this.content.scrollTop = parseFloat(getComputedStyle(this.ySlipper).top) / this.getYRatio()
    },
    clickXBar (e) {
      let offsetX = e.offsetX
      let xBarWidth = this.xBar.offsetWidth
      let xSlipperWidth = this.xSlipper.offsetWidth
      if ((offsetX + xSlipperWidth * 0.5) < xBarWidth) {
        this.xSlipper.style.left = `${offsetX - xSlipperWidth * 0.5}px`
        if ((offsetX - xSlipperWidth * 0.5) < 0) {
          this.xSlipper.style.left = '0px'
        }
      } else {
        this.xSlipper.style.left = `${xBarWidth - xSlipperWidth}px`
      }
      this.content.scrollLeft = parseFloat(getComputedStyle(this.xSlipper).left) / this.getXRatio()
    },
    setScrollTop (value) {
      this.content.scrollTop = value
      this.init()
    },
    setScrollLeft (value) {
      this.content.scrollLeft = value
      this.init()
    },
    setScrollToBottm () {
      setTimeout(() => {
        this.content.scrollTop = this.content.scrollHeight
        this.init()
      }, 20)
    },
    setScrollToRight () {
      setTimeout(() => {
        this.content.scrollLeft = this.content.scrollWidth
        this.init()
      }, 20)
    }
  }
}
</script>

<style scoped>
.ScrollBox {
  display: flex;
  flex-wrap: wrap;
}
.ScrollBox * {
  margin: 0;
  padding: 0;
}
.ScrollBox > div:nth-child(1) {
  overflow: hidden;
}
.ScrollBox > div:nth-child(1) > div {
  position: relative;
}
.ScrollBox > div:nth-child(2) {
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
  position: relative;
}
.ScrollBox > div:nth-child(2) > div {
  position: absolute;
}
.ScrollBox > div:nth-child(3) {
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
  position: relative;
}
.ScrollBox > div:nth-child(3) > div {
  position: absolute;
}
.ScrollBox-Iframe {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0;
  border: 0;
}
</style>
