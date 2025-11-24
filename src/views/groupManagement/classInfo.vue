<template>
  <div class="class-info">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="$t('班级信息')"
        name="tab1"
      >
        <ClassInfo></ClassInfo>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('出席情况')"
        name="tab2"
        v-if="Per.handleButtonPer('teach.groupMT.classInfo.cdViewClassAttendance')"
      >
        <AttendInfo></AttendInfo>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ClassInfo from './components/classinfo.vue'
import AttendInfo from './components/attendInfo.vue'
export default {
  name: 'classInfo',
  components: {
    ClassInfo,
    AttendInfo
  },
  data () {
    return {
      activeName: 'tab1'
    };
  },
  methods: {
    ...mapMutations({
      setPageTitle: 'SET_PAGE_TITLE'
    }),
    handleClick () {
    }
  },
  mounted () {
    this.setPageTitle(this.$t('班级信息'))
  }
}
</script>

<style lang="scss" scoped>
.class-info {
  padding: 15px;
}
</style>