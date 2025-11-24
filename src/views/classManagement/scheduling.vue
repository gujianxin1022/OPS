<template>
  <div class="scheduling-wrap">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('1对1')" name="oneByone">
        <OneByOne v-if="activeName  == 'oneByone'"></OneByOne>
      </el-tab-pane>
      <el-tab-pane :label="$t('小班课')" name="smallClass">
        <SmallClass  v-if="activeName  == 'smallClass'"></SmallClass>
      </el-tab-pane>
      <el-tab-pane :label="$t('大班课')" name="bigClass">
        <BigClass v-if="activeName  == 'bigClass'"></BigClass>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OneByOne from './sub/oneByone'
import SmallClass from './sub/smallClass'
import BigClass from './sub/bigClass'
export default {
  name: 'scheduling',
  components: {
    OneByOne,
    SmallClass,
    BigClass
  },
  data () {
    return {
      activeName: 'oneByone'
    }
  }
}
</script>
<style lang="scss" scoped>
.scheduling-wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>