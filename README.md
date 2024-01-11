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

### Usage Example

```
<template>
  <div class="wrapper">
    <div style="display: flex; gap: 10px; margin: 10px 0 0 20px">
      <button @click="onChangeImg(1)">IMG 1</button>
      <button @click="onChangeImg(2)">IMG 2</button>
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
      <VuejsImageZoom :src="imgSrc" />
    </div>
  </div>
</template>

<script>
import { VuejsImageZoom } from "vuejs-image-zoom";
const imgs = {
  1: "https://th.bing.com/th/id/OIG.l4zSBOrvP_1FquYSRwyw?pid=ImgGn",
  2: "https://th.bing.com/th/id/OIG.PleGemfkpxw4enZbAZd7?pid=ImgGn",
};
export default {
  components: { VuejsImageZoom },
  data() {
    return {
      imgSrc: imgs["1"],
    };
  },
  methods: {
    onChangeImg(num) {
      this.imgSrc = imgs[num];
    },
  },
};
</script>
```
