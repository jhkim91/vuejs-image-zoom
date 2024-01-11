import VuejsImageZoom from './VuejsImageZoom.vue';

export default {
  install: (app, options) => {
    app.component("VuejsImageZoom", VuejsImageZoom)
  }
}

export { VuejsImageZoom };