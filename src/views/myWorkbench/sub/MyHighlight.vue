<template>
  <div class="root">
    <iframe :src="webViewSrc" frameborder="0" class="webView" :key="iframeUpdate"></iframe>
    <el-button type="primary" @click="onGeneratePoster" class="generatePoster">{{ $t('生成海报') }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'MyHighlight',
  data() {
    return {
      myHighlightUrl: '',
      iframeUpdate:false,
    }
  },
  computed: {
    webViewSrc() {
      const language=this.$i18n.locale
      return this.myHighlightUrl + `&role=9&language=${language}`
    }
  },
  watch: {
    webViewSrc() {
      this.iframeUpdate = !this.iframeUpdate
    }
  },
  methods: {
    onGeneratePoster() {
      window.open(this.webViewSrc + '&export=true')
    }
  },
  created() {
    const urlParam = this.$route.query.url
    this.myHighlightUrl = decodeURIComponent(urlParam)
  }
}
</script>

<style lang="scss" scoped>
.root {
  display: flex;

  .webView {
    width: 40vw;
    margin-right: 2vw;
  }

  .generatePoster{
    height: 100%;
  }
}
</style>
