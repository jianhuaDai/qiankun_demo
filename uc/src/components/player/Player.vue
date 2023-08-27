<style scoped>
.player {
  height: 100%;
  width: 100%;
  display: flex;
}

.player-switch {
  cursor: pointer;
  height: 100%;
}

.player-switch svg {
  height: 100%;
}

.player-controls {
  display: flex;
  flex: 1;
  align-items: center;
}

.player-controls.disabled .player-progress {
  cursor: not-allowed;
}

.player-time {
  font-size: 14px;
  padding: 0 5px;
}

.player-progress {
  height: 25%;
  background-color: rgb(140, 197, 255);
  border-radius: 6px;
  cursor: pointer;
  margin: 0 8px;
  flex-grow: 1;
}

.player-progress .played {
  position: relative;
  border-radius: 6px;
  background: rgb(83, 168, 255);
  width: 0;
  z-index: 2;
  transition: all .1s;
  height: 100%;
}

.player-progress .played:after {
  content: '';
  width: 12px;
  height: 12px;
  background: rgb(83, 168, 255);
  box-shadow: 0 0 4px rgb(83, 168, 255);
  border-radius: 6px;
  position: absolute;
  top: -2px;
  right: -8px;
}

.player-down {
  font-size: 24px;
  color: rgb(83, 168, 255);
}

.muited {
  cursor: not-allowed;
  opacity: 0.5;
}

.hidden {
  display: none;
}

.progress {
  transition: stroke-dasharray .5s;
}
</style>
<template>
  <div class="player">
    <div @click.stop="switchAudio" class="player-switch">
      <svg v-if="type === 'circle'" :class="{muited:src === '' }" viewBox="0,0,100,100">
        <circle class="progress-bg" cx="50" cy="50" r="45" stroke-width="10" stroke="#EEE" fill="none"></circle>
        <circle :class="{progress : progress !== 0}" transform="matrix(0,-1,1,0,0,100)" :stroke-dasharray="solid+' '+empty" cx="50" cy="50" r="45" stroke-width="10" stroke="#409EFF" fill="none"></circle>
        <circle class="btn-bg" cx="50" cy="50" r="40" fill="#409EFF" />
        <path class="icon-play" v-show="!playing" d="M40 30 L40 70 L70 50 Z" fill="#FFF" />
        <rect class="icon-pause" v-show="playing" x="35" y="30" width="10" height="40" fill="#FFF" />
        <rect class="icon-pause" v-show="playing" x="55" y="30" width="10" height="40" fill="#FFF" />
      </svg>
      <svg v-else viewBox="0,0,100,20" :class="{muited:src === '' }">
        <circle class="btn-bg" cx="10" cy="10" r="10" fill="#409EFF" />
        <path v-show="!playing" d="M8 6 L14 10 L8 14 Z" fill="#FFF" />
        <rect v-show="playing" x="7" y="6" width="2" height="8" fill="#FFF" />
        <rect v-show="playing" x="11" y="6" width="2" height="8" fill="#FFF" />
        <path stroke="#EEE" d="M25 10 l75 0" stroke-width="4" />
        <path stroke="#409EFF" :d="`M25 10 l${progress*75} 0`" stroke-width="4" />
      </svg>
    </div>
    <div v-if="controls" class="player-controls" :class="{disabled: !ready}">
      <div class="player-time">
        <span>{{formatDuring(currentTime)}}</span> / <span>{{formatDuring(duration)}}</span>
      </div>
      <div ref="progress" @mousedown.left="mousedown($event)" class="player-progress">
        <div :style="{width: progressWidth}" class="played"></div>
      </div>
      <div v-if="source">
        <a class="player-down" :href="source" download><i class="el-icon-download"></i></a>
      </div>
    </div>
    <audio @timeupdate="timeupdate" @ended="ended" @canplay="canplay" :src="source" preload="none" ref="player" class="hidden" />
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'circle'
    },
    controls: {
      type: String,
      default: null
    },
    pauseKey: undefined
  },
  data() {
    return {
      ready: false,
      playing: false,
      source: this.src,
      currentTime: 0,
      duration: 0
    }
  },
  watch: {
    src: function(val) {
      this.ready = false;
      this.source = val;
      this.playing = false;
      this.duration = 0;
      this.currentTime = 0;
    }
  },
  computed: {
    solid() {
      return this.progress * Math.PI * 2 * 45
    },
    empty() {
      return Math.PI * 2 * 45 - this.solid;
    },
    progress() {
      return this.duration == 0 ? 0 : this.currentTime / this.duration;
    },
    progressWidth() {
      return this.progress * 100 + '%'
    }
  },
  methods: {
    mousedown(event) {
      if (!this.ready) {
        return;
      }
      let isPlaying = this.playing;
      isPlaying && this.pause();
      let x = event.offsetX,
        clientX = event.clientX;
      let w = this.$refs.progress.offsetWidth;
      this.currentTime = this.duration * x / w;
      let mousemove = (event) => {
        this.currentTime = Math.max(0, this.duration * Math.min(1, (x + event.clientX - clientX) / w));
      }
      let mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
        this.$refs.player.currentTime = this.currentTime;
        isPlaying && this.play();
      }
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    },
    timeupdate() {
      if (this.$refs.player && this.playing) {
        this.currentTime = this.$refs.player.currentTime;
      }
    },
    ended() {
      this.playing = false;
      this.currentTime = 0;
    },
    canplay() {
      let duration = this.$refs.player.duration;
      if (!isNaN(duration) && isFinite(duration)) {
        this.duration = duration;
        this.ready = true;
      }
    },
    switchAudio() {
      if (this.src === '') {
        return
      }
      if (this.playing) {
        this.pause()
      } else {
        this.play()
      }
      this.$emit('statusChange', this.playing)
    },
    play() {
      if (this.src === '') {
        return
      }
      if (this.source === '') {
        this.source = this.src
      }
      this.playing = true
      this.$nextTick(() => {
        this.$refs.player.play()
        if (this.pauseKey !== undefined) {
          if (window[this.pauseKey] !== undefined) {
            if (window[this.pauseKey] !== this) {
              window[this.pauseKey].pause()
            }
          }
          window[this.pauseKey] = this
        }
      })
    },
    pause() {
      if (this.src === '') {
        return
      }
      this.$refs.player.pause();
      this.playing = false
    },
    formatDuring(secs) {
      if (secs < 0.01) {
        return '00:00'
      }
      let hours = Math.floor(secs / 3600)
      let minutes = Math.floor(secs % 3600 / 60)
      let seconds = Math.ceil(secs % 3600 % 60)
      return (hours === 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0' + hours + ':' : hours + ':') + (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' + (seconds.toString().length < 2 ? '0' + seconds : seconds)
    }
  },
  beforeDestroy() {
    if (this.pauseKey !== undefined) {
      if (window[this.pauseKey] === this) {
        window[this.pauseKey] = undefined
      }
    }
  }
}
</script>