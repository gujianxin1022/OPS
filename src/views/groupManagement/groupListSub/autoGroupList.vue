<template>
  <div class="auto-class-wrap">
    <el-button-group class="mt10">
      <el-button @click="changeType(1)" size="medium" :type="type == 1 ? 'primary' : ''" >{{$t('试听')}}</el-button>
      <el-button @click="changeType(2)" size="medium" :type="type == 2 ? 'primary' : ''" >{{$t('正式')}}</el-button>
    </el-button-group>
    <div class="content mt10">
      <AutoTry v-if="type == 1"></AutoTry>
      <AutoNormal v-if="type == 2"></AutoNormal>
    </div>
  </div>
</template>
<script>
import AutoTry from './autoSub/autoTry'
import AutoNormal from './autoSub/autoNormal'
export default {
  components: {
    AutoTry,
    AutoNormal
  },
  data () {
    return {
      type: 1
    }
  },
  methods: {
    changeType(type) {
      this.type = type
    }
  }
}
</script>
<style lang="scss" scoped>
.auto-class-wrap {
  width: 100%;
  height: 100%;
}
</style>