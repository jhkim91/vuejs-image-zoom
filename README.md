# vuejs-image-zoom

### Install the package

```
npm i vuejs-image-zoom@latest
```

### Basic Usage

```
<VuejsImageZoom :src="src" />

...

<script>
import { VuejsImageZoom } from "vuejs-image-zoom";
export default {
  components: { VuejsImageZoom },
};
</script>
```

### Props

- src : { type: String, default: "" }
- width : { type: String, default: "100%" }
- height : { type: String, default: "100%" }
- enableButton: { type: Boolean, default: true }
- isCtrlPressed: { type: Boolean, default: true }
- @onZoomIn
- @onZoomOut
- @onZoomReset

### Usage Example

```
<template>
  <div class="wrapper">
    <div style="display: flex; gap: 10px; margin: 10px 0 0 20px">
      <button @click="onChangeImg(1)">IMG 1</button>
      <button @click="onChangeImg(2)">IMG 2</button>
      <button @click="onChangeImg(2)">IMG 3</button>
      <button @click="changeEnableButton()">enableButton</button>
    </div>
    <br />
    <div
      style="
        width: calc(100% - 40px);
        height: 400px;
        border: 1px solid #333;
        border-radius: 10px;
        margin: 0 20px 10px 20px;
        overflow: hidden;
      "
    >
      <VuejsImageZoom ref="imgCanvas" :src="imgSrc" :enable-button="enableButton" />
    </div>
    <button v-if="!enableButton" @click="onClickZoom('in')">+</button>
    <button v-if="!enableButton" @click="onClickZoom('out')">-</button>
    <button v-if="!enableButton" @click="onClickZoom('reset')">reset</button>

  </div>
</template>

<script>
import { VuejsImageZoom } from "vuejs-image-zoom";
import IMG1 from "@/assets/20240111.jpg";
const imgs = {
  1: IMG1,
  2: "https://th.bing.com/th/id/OIG.l4zSBOrvP_1FquYSRwyw?pid=ImgGn",
  3: "https://th.bing.com/th/id/OIG.PleGemfkpxw4enZbAZd7?pid=ImgGn",
};
export default {
  components: { VuejsImageZoom },
  data() {
    return {
      enableButton: true,
      imgSrc: imgs["1"],
    };
  },
  methods: {
    onChangeImg(num) {
      this.imgSrc = imgs[num];
    },
    onClickZoom(val) {
      const zoom = this.$refs.imgCanvas;
      if (val === "in") {
        zoom.onZoomIn();
      } else if (val === "out") {
        zoom.onZoomOut();
      } else if (val === "reset") {
        zoom.onZoomReset();
      }
    },
    changeEnableButton(){
      this.enableButton = !this.enableButton
    }
  },
};
</script>
```
