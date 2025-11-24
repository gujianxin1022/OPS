<template>
  <div class="translate-text">
    <span>{{ showText }}</span>
    <el-tooltip v-if="showTranslate" effect="dark" :content="tooltipContent">
      <TranslateIcon @click.native="onTranslateClick" />
    </el-tooltip>
  </div>
</template>

<script>
import TranslateIcon from "./TranslateIcon.vue";
import { isTargetLanguage } from "./helper";
import { translateText } from "@/api/im";

export default {
  components: {
    TranslateIcon
  },
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      translatedText: "", // 翻译后的内容
      isTranslating: false, // 是否正在翻译中
    };
  },
  computed: {
    toLanguage() {
      return this.$i18n.locale;
    },
    // 是否显示翻译按钮
    showTranslate() {
      if (this.text) {
        return !isTargetLanguage(this.text, this.toLanguage);
      }
      return false;
    },
    // 是否已翻译
    isTranslated() {
      return this.translatedText !== "";
    },
    // 显示的文本
    showText() {
      return this.isTranslated ? this.translatedText : this.text;
    },
    tooltipContent() {
      return this.isTranslated ? "显示原文" : "翻译";
    },
  },
  methods: {
    // 点击翻译Icon
    onTranslateClick() {
      console.log('onTranslateClick');
      if (this.isTranslated) {
        this.displayOriginalText();
        return;
      }
      if (this.isTranslating) {
        return;
      }
      this.handleTranslateText();
    },
    // 翻译文本
    handleTranslateText() {
      this.isTranslating = true;
      translateText(this.text, this.toLanguage).then((toText) => {
        if (toText) {
          this.translatedText = toText;
        } else {
          this.$message.error('翻译失败');
        }
      }).finally(() => {
        this.isTranslating = false;
      });
    },
    // 显示原文
    displayOriginalText() {
      this.translatedText = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.translate-icon {
  margin-left: 1em;
  cursor: pointer;
  font-size: 1.5em;
  color: #3A3C53;
}
</style>
