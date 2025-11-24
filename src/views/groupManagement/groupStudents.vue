<template>
  <div class="group-students-wrap">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('试听')" name="try">
        <GroupStudentTry v-if="activeName == 'try'"></GroupStudentTry>
      </el-tab-pane>
      <el-tab-pane :label="$t('正式')" name="normal">
        <GroupStudentNormal v-if="activeName == 'normal'"></GroupStudentNormal>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import GroupStudentTry from './groupStudentsSub/groupStudentTry'
import GroupStudentNormal from './groupStudentsSub/groupStudentNormal'
export default {
  name: 'groupStudents',
  components: {
    GroupStudentTry,
    GroupStudentNormal
  },
  data () {
    return {
      activeName: 'try'
    }
  }
}
</script>
<style lang="scss" scoped>
.group-students-wrap {
  width: 100%;
  height: 100%;
  padding: 5px;
}
</style>