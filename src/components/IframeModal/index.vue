<template>
  <div v-if="show" ref="modal" class="iframe-modal">
    <div class="iframe-container">
      <i class="el-icon-close" @click="handleClose" />
      <iframe :src="url" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'IframeModal',
  model: {
    prop: 'show',
    event: 'visibleChange'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const handleClose = () => emit('visibleChange', false)

    return {
      handleClose
    }
  }
}
</script>

<style lang="scss" scoped>
.iframe-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 100000;
  .iframe-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 80%;
    transform: translate(-50%, -50%);
    .el-icon-close {
      position: absolute;
      top: 10px;
      right: -40px;
      font-size: 30px;
      color: white;
      cursor: pointer;
    }
    iframe {
      background-color: white;
      border: none;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
