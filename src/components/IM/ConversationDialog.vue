<template>
  <el-dialog :visible.sync="visible" width="800px" top="5vh" append-to-body @close="close">
    <template v-slot:title>
      <div class="dialog-header">
        <span class="dialog-title">{{ conversationName }}</span>
        <div>
          <el-input v-model.trim="keyword" prefix-icon="el-icon-search" :placeholder="$t('请输入内容')" style="width: 220px">
            <template v-slot:suffix>
              <span v-if="totalKeywordCount && currentKeywordIndex >= 0" style="line-height: 32px;">{{
                `${currentKeywordIndex + 1}/${totalKeywordCount}`
                }}</span>
            </template>
          </el-input>
          <el-button icon="el-icon-arrow-up" circle @click="goKeywordPosition(true)"></el-button>
          <el-button icon="el-icon-arrow-down" circle @click="goKeywordPosition(false)"></el-button>
        </div>
      </div>
    </template>
    <div class="filter-bar">
      <el-date-picker v-model="timeRange" type="daterange" :start-placeholder="$t('开始时间')" :end-placeholder="$t('结束时间')"
        size="small" :default-time="['00:00:00', '23:59:59']" style="width: 220px" />
      <el-button type="primary" @click="search">{{ $t("查询") }}</el-button>
    </div>
    <MessageList ref="messageList" :list="messageList" :loading="loading" :upFinished="upFinished"
      :downFinished="downFinished" :keyword="keyword" @load="loadMessages" />
  </el-dialog>
</template>

<script>
import { getConversationMessages } from "@/api/im/index.js";
import MessageList from "./message/MessageList.vue";
import moment from "moment";

export default {
  components: {
    MessageList,
  },
  props: {
    conversationId: {
      type: String,
      required: true,
    },
    conversationName: {
      type: String,
      required: true,
    },
    // 是否是群聊
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: true,
      timeRange: [
        moment().subtract(1, "months").add(1, "days").startOf("day").toDate(),
        moment().endOf("day").toDate(),
      ],
      keyword: "",
      messageList: [],
      loading: false,
      upFinished: false, // 向上是否已加载完成
      downFinished: false, // 向下是否已加载完成
      currentKeywordIndex: -1, // 当前关键字索引
      totalKeywordCount: 0, // 关键字总数
    };
  },
  computed: {
    // 根据关键词过滤后的消息列表
    // filterList() {
    //   const orgList = this.messageList;
    //   const keyword = this.keyword;
    //   if (!keyword) {
    //     return orgList;
    //   }
    //   return orgList.filter((item) => {
    //     return item.msgBody.some((msg) => {
    //       return (
    //         msg.msgType === "TIMTextElem" &&
    //         msg.msgContent.Text.includes(keyword)
    //       );
    //     });
    //   });
    // },
  },
  watch: {
    keyword() {
      this.currentKeywordIndex = -1;
    },
  },
  created() {
    this.loadMessages(false);
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit("close");
    },
    loadMessages(isUp) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const param = {
        limit: 100,
      };
      const cId = this.conversationId;
      if (this.isGroup) {
        param.imGroupId = cId;
      } else {
        param.c2cId = cId;
      }
      const length = this.messageList.length;
      const isScrollLoad = length > 0;
      // 有数据时，视为滚动加载。根据滚动方向和当前方向上最近的一条消息时间加载数据
      if (isScrollLoad) {
        param.scrollDirection = isUp ? "up" : "down";
        // 向上滚动时，取第一条消息的时间；向下滚动时，取最后一条消息的时间
        const item = isUp ? this.messageList[0] : this.messageList[length - 1];
        param.currentMessageTime = item.msgTime;
      } else if (this.timeRange.length > 1) {
        // 没有数据时，根据时间范围加载数据
        param.startMessageTime = this.timeRange[0].getTime();
        param.endMessageTime = this.timeRange[1].getTime();
      }
      getConversationMessages(param, this.isGroup)
        .then((newList) => {
          if (isUp) {
            this.upFinished = newList.length < param.limit;
          } else {
            this.downFinished = newList.length < param.limit;
          }
          if (newList.length > 0) {
            // 过滤掉自定义消息
            const filterList = newList.filter(p=> {
              return p.msgBody.every(msg => {
                return !["TIMCustomElem"].includes(msg.msgType);
              });
            });
            if (isUp) {
              this.messageList = filterList.concat(this.messageList);
            } else {
              this.messageList = this.messageList.concat(filterList);
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    search() {
      if (!this.timeRange) {
        this.$message.error(this.$t('请选择日期时间'));
        return;
      }
      // 单次查询的时间跨度最长为 1 个月
      if (this.timeRange.length > 1) {
        const start = moment(this.timeRange[0]);
        const end = moment(this.timeRange[1]);
        if (end.diff(start, "months", true) > 1) {
          this.$message.error(this.$t('单次查询时间跨度最长为1个月'));
          return;
        }
      }
      this.upFinished = false;
      this.downFinished = false;
      this.messageList = [];
      this.loadMessages(false);
    },
    // 上一个/下一个关键字位置
    goKeywordPosition(isPrev) {
      const listEl = this.$refs.messageList.$el;
      if (!listEl) {
        return;
      }
      let index = this.currentKeywordIndex;
      if (isPrev) {
        index = index - 1;
      } else {
        index = index + 1;
      }
      const currentClass = "is-current";
      const items = listEl.querySelectorAll(".message-item .highlight-text");
      if (!items.length) {
        return;
      }
      // 首位循环
      if (index < 0) {
        index = items.length - 1;
      } else if (index >= items.length) {
        index = 0;
      }
      this.totalKeywordCount = items.length; // 总匹配数量
      items.forEach((item) => {
        item.classList.remove(currentClass);
      });
      const target = items[index];
      if (target) {
        target.classList.add(currentClass);
        target.scrollIntoView({ behavior: "instant", block: "center" });
        this.currentKeywordIndex = index;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;

  &>*+* {
    margin-left: 10px;
  }
}

.message-list {
  margin-top: 20px;
  margin-bottom: -20px; // 突破父元素底部边界
  padding-top: 1px;
  height: calc(70vh - 100px) !important;
  min-height: 500px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  padding-right: 100px;
}

.dialog-title {
  max-width: 50%;
}
</style>
