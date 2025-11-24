<template>
  <div class="group-list-wrap">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('自动班级')" name="auto">
        <AutoGroupList v-if="activeName == 'auto'"></AutoGroupList>
      </el-tab-pane>
      <el-tab-pane :label="$t('人工班级')" name="person">
        <PersonGroupList v-if="activeName == 'person'"></PersonGroupList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import AutoGroupList from './groupListSub/autoGroupList'
import PersonGroupList from './groupListSub/personGroupList'
export default {
  name: 'groupList',
  components: {
    PersonGroupList,
    AutoGroupList
  },
  data () {
    return {
      activeName: 'auto'
    }
  }
}
</script>
<style lang="scss" scoped>
.group-list-wrap {
  width: 100%;
  height: 100%;
  padding: 5px;
}
</style>