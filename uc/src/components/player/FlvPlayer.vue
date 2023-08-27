<style>
.flv-container {
  display: flex;
  justify-content: center;
}

.flv-container video {
  width: 100%;
}
.flv-container video:focus {
  outline: none;
}
</style>
<template>
  <div class="flv-container">
    <video controls="controls" :autoplay="autoplay" ref="flv" :style="style"></video>
  </div>
</template>
<script>
import { loadScript } from "@/utils/dom.js";

let flvPlayer = null;

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      default: "",
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    loadVideo() {
      if (window.flvjs.isSupported()) {
        flvPlayer = window.flvjs.createPlayer({
          type: "flv",
          url: this.src,
        });
        flvPlayer.attachMediaElement(this.$refs.flv);
        flvPlayer.load();
        this.autoplay && flvPlayer.play();
      }
    },
  },
  watch: {
    src: function (val, oldVal) {
      if (val !== oldVal) {
        this.loadVideo();
      }
    },
  },
  mounted() {
    loadScript(process.env.BASE_URL + "flv/1.5.0/flv.min.js").then(() => {
      this.loadVideo();
    });
  },

  beforeDestroy() {
    if (flvPlayer) {
      flvPlayer.pause();
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
    }
  },
};
</script>