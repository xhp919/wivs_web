<template>
  <div class="TemTable">
    <div>
      <label for="presentTem">当前气温：</label>
      <input id="presentTem" type="checkbox"/>
    </div>
    <div>
      <label>透明度：</label>
      <button class="TemTable-OpacityBtn" title="透明度降低">-</button>
      <label class="TemTable-OpacityLabel">0.8</label>
      <button class="TemTable-OpacityBtn" title="透明度增加">+</button>
    </div>
    <div>
      <label>图例：(单位：°C)</label>
      <div class="TemTable-Legend">
        <div class="TemTable-Legend-Card">
          <scroll-box barYWidth="0px" barXHeight="2.7px" bar-x-class="TemTable-Bar-X" x-slipper-class="TemTable-Bar-Slipper">
            <template v-slot:content>
              <div class="TemTable-Legend-Color">
                <div style="background-color:#000079;"></div>
                <div style="background-color:#000093;"></div>
                <div style="background-color:#0000C6;"></div>
                <div style="background-color:#0000E3;"></div>
                <div style="background-color:#2828FF;"></div>
                <div style="background-color:#4A4AFF;"></div>
                <div style="background-color:#6A6AFF;"></div>
                <div style="background-color:#7D7DFF;"></div>
                <div style="background-color:#9393FF;"></div>
                <div style="background-color:#AAAAFF;"></div>
                <div style="background-color:#DEFFAC;"></div>
                <div style="background-color:#FFFFAA;"></div>
                <div style="background-color:#FFED97;"></div>
                <div style="background-color:#FFA07A;"></div>
                <div style="background-color:#FF7F50;"></div>
                <div style="background-color:#FF6347;"></div>
                <div style="background-color:#FF4500;"></div>
                <div style="background-color:#FF0000;"></div>
                <div style="background-color:#B22222;"></div>
                <div style="background-color:#8B0000;"></div>
              </div>
              <div class="TemTable-Legend-Label">
                <div>-50</div>
                <div>-45</div>
                <div>-40</div>
                <div>-35</div>
                <div>-30</div>
                <div>-25</div>
                <div>-20</div>
                <div>-15</div>
                <div>-10</div>
                <div>-5</div>
                <div>0</div>
                <div>5</div>
                <div>10</div>
                <div>15</div>
                <div>20</div>
                <div>25</div>
                <div>30</div>
                <div>35</div>
                <div>40</div>
                <div>45</div>
                <div>50</div>
              </div>
            </template>
          </scroll-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBox from '@components/scrollbox/index.vue'

export default {
  components: {
    ScrollBox
  }
}
</script>

<style scoped>
.TemTable {
  color: #303133;
}
.TemTable > div {
  font-size: 1.3em;
  line-height: 1.6em;
}
.TemTable > div input {
  vertical-align: middle;
}
.TemTable-OpacityBtn {
  border: none;
  width: 1.25em;
  height: 1.25em;
  border-radius: 0.125em;
}
.TemTable-OpacityBtn:hover {
  background-color: rgb(226, 226, 226);
}
.TemTable-OpacityBtn:active {
  background-color: rgb(206, 206, 206);
}
.TemTable-OpacityLabel {
  display: inline-block;
  text-align: center;
  width: 2em;
}
.TemTable-Legend {
  padding-left: 1em;
}
.TemTable-Legend label {
  font-size: 0.8em;
}
.TemTable-Legend-Card {
  height: 3em;
  width: 12em;
  position: relative;
}
.TemTable-Legend-Color {
  display: flex;
  justify-content: space-evenly;
  height: 1em;
  width: 30em;
  margin-left: 1.7em;
}
.TemTable-Legend-Color div {
  width: 2em;
  height: 100%;
}
.TemTable-Legend-Label {
  display: flex;
  justify-content: space-evenly;
  width: 32em;
  font-style: italic;
}
.TemTable-Legend-Label div {
  width: 2em;
  height: 100%;
  text-align: center;
}
</style>
<style>
.TemTable-Bar-X {
  background-color: lightgrey;
}
.TemTable-Bar-Slipper {
  background-color: grey;
}
</style>
