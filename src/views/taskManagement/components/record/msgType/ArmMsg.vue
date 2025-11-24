<template>
  <div class="clearfix">
    <div
      @click="play"
      :class="isMine ? 'arm-player-warp is-mine' : 'arm-player-warp'"
      :style="{ width: amrTime * 8 + 80 + 'px', height: '40px' }"
    >
      <div :class="{ animation: playing }">
        <div class="wifi-warp">
          <div class="wifi-symbol">
            <div class="wifi-circle first"></div>
            <div class="wifi-circle second"></div>
            <div class="wifi-circle third"></div>
          </div>
        </div>
        <span
          class="duration"
          style="font-size: 14px; line-height: 25px; white-space: nowrap"
        >
          {{ amrTime == 0 ? 1 : amrTime }}″
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, watch, ref, onMounted } from "@vue/composition-api";
const BenzAMRRecorder = require("benz-amr-recorder");
export default {
  props: {
    src: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: Object,
      default: null,
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const amr = ref(null);
    const amrTime = ref(0);
    onMounted(() => {
      amr.value = new BenzAMRRecorder();
      amr.value.initWithUrl(props.src).then(() => {
        amrTime.value = amr.value.getDuration(); //音频总时长
      });
      amr.value.onEnded(function () {
        playing.value = false;
      });
      amr.value.onPause(function () {
        playing.value = false;
      });
    });
    const playing = ref(false);
    const play = () => {
      playing.value = true;
      amr.value.playOrPauseOrResume();
    };
    return {
      isMine: props.msg.messageSender === "xg",
      src: props.src,
      isEn,
      amrTime,
      playing,
      play,
    };
  },
};
</script>
<style scoped lang="scss">
.arm-player-warp {
  height: 40px;
  background-color: #33df83;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  .wifi-warp {
    margin-left: 20px;
    .wifi-symbol {
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      overflow: hidden;
      transform: rotate(135deg);
      position: relative;

      .wifi-circle {
        border: 2px solid #999999;
        border-radius: 999px;
        position: absolute;
      }
      .first {
        width: 3px;
        height: 3px;
        top: 36px;
        left: 36px;
      }

      .second {
        width: 20px;
        height: 20px;
        top: 30px;
        left: 30px;
      }

      .third {
        width: 30px;
        height: 30px;
        top: 25px;
        left: 25px;
      }
    }
  }
  .duration {
    position: absolute;
    top: 8px;
    left: 36px;
  }
}
.is-mine {
  position: relative;
  float: right;
  .wifi-symbol {
    width: 40px;
    height: 40px;
    box-sizing: border-box;
    overflow: hidden;
    transform: rotate(310deg) !important;
    position: relative;
  }
  .duration {
    position: absolute;
    top: 8px;
    right: 40px;
  }
  .wifi-warp {
    position: relative;
    .wifi-symbol {
      position: absolute;
      top: 0px;
      right: 20px;
    }
  }
}

.animation .second {
  animation: fadeInOut 1s infinite 0.2s;
}

.animation .third {
  animation: fadeInOut 1s infinite 0.4s;
}

@keyframes fadeInOut {
  0% {
    opacity: 0; /*初始状态 透明度为0*/
  }
  100% {
    opacity: 1; /*结尾状态 透明度为1*/
  }
}
</style>
