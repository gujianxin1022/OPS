<template>
  <div ref="list" class="message-list" @scroll.passive="onScroll">
    <ListIndicator v-if="showUpIndicator" :finished="upFinished" />
    <MessageItem
      v-for="(item, i) in list"
      :key="item.messageId"
      :msg="item"
      :keyword="keyword"
      :data-i="i"
    />
    <ListIndicator v-if="showDownIndicator" :finished="downFinished" />
  </div>
</template>

<script>
import { throttle } from "lodash-es";
import MessageItem from "./MessageItem.vue";
import ListIndicator from "./ListIndicator.vue";

export default {
  components: {
    MessageItem,
    ListIndicator,
  },
  props: {
    /**
     * 消息列表, 每个元素是一个消息对象.
     */
    list: Array,
    loading: {
      type: Boolean,
      default: false,
    },
    // 向上是否已加载完成，加载完成后不再触发 load 事件
    upFinished: {
      type: Boolean,
      default: false,
    },
    // 向下是否已加载完成，加载完成后不再触发 load 事件
    downFinished: {
      type: Boolean,
      default: false,
    },
    // 滚动条与 底部/顶部 距离小于 offset 时触发 load 事件
    offset: {
      type: Number,
      default: 0,
    },
    // 是否在初始化时立即执行滚动位置检查
    immediateCheck: {
      type: Boolean,
      default: true,
    },
    // 高亮的关键字
    keyword: {
      type: String,
    },
  },
  data() {
    return {
      isUpScroll: false, // 是否向上滚动
    };
  },
  computed: {
    showUpIndicator() {
      if (this.upFinished) {
        return true;
      }
      return this.loading && this.isUpScroll;
    },
    showDownIndicator() {
      if (this.downFinished) {
        return true;
      }
      return this.loading && !this.isUpScroll;
    },
  },
  watch: {
    list(val, oldVal) {
      // 没有数据变化
      if (val.length === oldVal.length) {
        return;
      }
      const ele = this.$refs.list;
      const prevScrollHeight = ele.scrollHeight;
      // list 变化后，下一帧检查是否可以滚动
      this.$nextTick(() => {
        this.checkScrollable();
        const curScrollHeight = ele.scrollHeight;
        // 如果是向上滚动加载了新数据，滚动条位置保持在加载前的元素位置
        if (this.isUpScroll && curScrollHeight > prevScrollHeight) {
          ele.scrollTop = curScrollHeight - prevScrollHeight;
        } else if(!this.isUpScroll && val.length > 0 && oldVal.length === 0) {
          // 第一次加载数据时，滚动到底部
          ele.scrollTop = ele.scrollHeight - ele.clientHeight - 1;
        } else if (ele.scrollTop === 0) {
          // 如果滚动条在顶部，滚动到 1px 位置，方便用户操作触发向上滚动加载
          ele.scrollTop = 1;
        }
      });
    },
  },
  mounted() {
    if (this.immediateCheck) {
      this.checkScrollable();
    }
  },
  methods: {
    onScroll: throttle(function (e) {
      // 正在加载中，不触发
      if (this.loading) {
        return;
      }
      const st = e.target.scrollTop;
      const offset = this.offset || 0;
      if (st === offset) {
        this.isUpScroll = true;
        // 滚动到顶部
        this.emitLoad(true);
      } else if (st + e.target.clientHeight >= e.target.scrollHeight - offset) {
        this.isUpScroll = false;
        // 滚动到底部
        this.emitLoad(false);
      }
    }, 300),
    // 检查是否可以滚动，如果当前数据量不足以达到容器滚动条件，则触发加载更多
    checkScrollable() {
      if (this.loading || this.downFinished) {
        return;
      }
      const ele = this.$refs.list;
      if (!ele) {
        return;
      }
      if (ele.scrollHeight <= ele.clientHeight) {
        this.emitLoad(false);
      }
    },
    emitLoad(isUp) {
      if (isUp && this.upFinished) {
        return;
      }
      if (!isUp && this.downFinished) {
        return;
      }
      this.$emit("load", isUp);
    },
  },
};
</script>

<style lang="scss" scoped>
.message-list {
  position: relative;
  /** 因为有滚动加载，所以必须显示的设置高度 */
  height: 500px;
  /* padding: 30px 0 20px 0; */
  overflow: auto;
}
</style>
