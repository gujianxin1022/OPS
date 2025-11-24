<template>
  <Highlight class="message-text" :text="content.Text" :keyword="keyword" />
</template>

<script>
import Highlight from "@/components/Highlight.vue";
export default {
  components: {
    Highlight,
  },
  props: {
    content: {
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
.message-text {
  padding: 10px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: fit-content;
  word-break: break-word;
}
</style>
