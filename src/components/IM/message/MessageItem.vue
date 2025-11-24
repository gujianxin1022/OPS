<template>
  <div class="message-item">
    <el-avatar class="avatar-img" :src="msg.senderAvatar" icon="el-icon-user-solid" :size="40" alt=""></el-avatar>
    <div class="content-wrapper">
      <div class="meta-info">
        <span>{{ msg.senderNickname }}</span>
        <span class="message-time">{{
          DateTimeUtils.dateClockTime(new Date(Number(msg.msgTime)))
        }}</span>
      </div>
      <div class="message-content">
        <template v-for="(item, i) in msg.msgBody">
          <MessageText
            v-if="item.msgType === 'TIMTextElem'"
            :key="i"
            :content="item.msgContent"
            :keyword="keyword"
          />
          <MessageImage
            v-else-if="item.msgType === 'TIMImageElem'"
            :key="i"
            :content="item.msgContent"
          />
          <span v-else :key="i"
            >{{ $t("暂不支持显示该类型消息") }}({{ item.msgType }})</span
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import MessageText from "./MessageText.vue";
import MessageImage from "./MessageImage.vue";
export default {
  components: {
    MessageText,
    MessageImage,
  },
  props: {
    msg: {
      type: Object,
      required: true,
    },
    // 高亮的关键字
    keyword: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  & + .message-item {
    margin-top: 20px;
  }
}
.avatar-img {
  flex-shrink: 0;
  margin-right: 10px;
}
.content-wrapper {
  flex-grow: 1;
}
.meta-info {
  font-size: 12px;
}
.message-time {
  color: #999;
  margin-left: 20px;
}
.message-content {
  margin-top: 5px;
  max-width: 70%;
}
</style>
