<template>
  <div class="text-msg-warp">
    <div :class="msg.messageSender === 'xg' ? 'chat-mine' : ''">
      <div class="chat-user">
        <div class="img">{{ msg.fromUser[0] }}</div>
      </div>
      <div class="time">
        <cite v-if="msg.messageSender === 'xg'"
          ><i>{{ DateTimeUtils.dateClockTime(new Date(msg.msgTime)) }}</i>
          {{ msg.fromUser }}</cite
        >
        <cite v-else
          >{{ msg.fromUser }}
          <i>{{ DateTimeUtils.dateClockTime(new Date(msg.msgTime)) }}</i></cite
        >
      </div>
      <template>
        <div v-if="msg.msgType === 'text'" class="chat-text">
          {{ msg.textContent }}
        </div>
        <div v-else-if="msg.msgType === 'revoke'" class="chat-revoke">
          "{{ msg.fromUser }}"{{ $t("撤回了一条消息") }}
        </div>
        <div v-else-if="msg.msgType === 'image'" class="chat-img">
          <el-image
            style="width: 150px; height: 150px"
            :src="msg.fileUrl"
            fit="contain"
            :preview-src-list="[msg.fileUrl]"
          ></el-image>
        </div>
        <div v-else-if="msg.msgType === 'video'">
          <video
            controls
            controlslist="nodownload"
            style="width: 150px; height: 150px"
            :src="msg.fileUrl"
          ></video>
        </div>
        <div v-else-if="msg.msgType === 'voice'">
          <ArmMsg :src="msg.fileUrl" :msg="msg" />
        </div>
        <div v-else-if="msg.msgType === 'aicall_voice'||msg.msgType === 'meeting_voice_call'||msg.msgType === 'tencent_call_voice'">
          <audio style="margin-top: 4px;" controlslist="nodownload" :src="msg.fileUrl" Controls></audio>
        </div>
        <div v-else class="chat-revoke">
          {{ $t("暂不支持显示该类型消息") }}({{ msg.msgType }})
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import ArmMsg from "./ArmMsg.vue";
import { computed } from "@vue/composition-api";
export default {
  components: { ArmMsg },
  props: {
    msg: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    return {
      msg: props.msg,
      isEn,
    };
  },
};
</script>
<style scoped lang="scss">
.text-msg-warp {
  position: relative;
  margin-bottom: 10px;
  padding-left: 60px;
  min-height: 68px;
  .chat-mine {
    text-align: right;
    padding-left: 0;
    padding-right: 60px;
    .chat-user {
      left: auto;
      right: 3px;
    }
    .chat-text {
      margin-left: 0;
      text-align: left;
      background-color: #33df83;
      color: #fff;
    }
    .chat-text:after {
      left: auto;
      right: -10px;
      border-top-color: #33df83;
    }
  }

  .chat-user {
    left: auto;
    right: 3px;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    position: absolute;
    left: 3px;
    .img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #7581e5;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      background: #f9f9ff;
      color: #7581e5;
    }
  }
  .time {
    width: 100%;
  }
  .chat-text {
    margin-top: 4px;
    position: relative;
    line-height: 22px;
    padding: 10px 15px;
    background-color: #eee;
    border-radius: 3px;
    color: #333;
    word-break: break-all;
    max-width: 90%;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
  }
  .chat-revoke {
    margin-top: 8px;
  }
}
</style>
