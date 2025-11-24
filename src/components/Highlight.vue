<template>
  <div class="highlight-wrapper">
    <template v-for="(item, index) in textList">
      <span v-if="item === keyword" :key="index" class="highlight-text">{{
        item
      }}</span>
      <span v-else :key="index">{{ item }}</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    // 文本内容
    text: {
      type: String,
      required: true,
    },
    // 高亮的关键字
    keyword: {
      type: String,
    },
  },
  computed: {
    textList() {
      const list = [];
      const text = this.text || "";
      const keyword = this.keyword || "";
      if (text && keyword) {
        // const reg = new RegExp(keyword, 'gi');
        const splitList = text.split(keyword);
        for (let i = 0; i < splitList.length; i++) {
          const item = splitList[i];
          if (item) {
            list.push(item);
          }
          // 最后一项之前的每一项后面都加上关键词，因为是用关键词分割的，所以每一项后面必定是关键词
          if (i < splitList.length - 1) {
            list.push(keyword);
          }
        }
        return list;
      }
      return [text];
    },
  },
};
</script>

<style lang="scss" scoped>
.highlight-wrapper {
  display: inline-block;
}
.highlight-text {
  background-color: yellow;
  font-weight: bold;
  color: #000;
  &.is-current {
    background-color: orange;
  }
}
</style>
