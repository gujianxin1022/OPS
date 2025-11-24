<template>
  <el-dialog :title="$t('用户评价')" :visible.sync="visible" width="800px" append-to-body
    custom-class="class-evaluations-dialog" @closed="onDialogClosed">
    <el-tabs v-model="currentTab">
      <el-tab-pane v-for="(item, i) in studentList" :key="item.studentUserId" :label="item.studentRealName"
        :name="(i + 1).toString()">
        <UserEvaluation :studentInfo="item" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import UserEvaluation from './UserEvaluation.vue';
export default {
  components: {
    UserEvaluation
  },
  props: {
    // 班级id
    virtualclassId: {
      type: Number,
      required: true,
    },
    // 当前班级内的学生列表
    studentList: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      visible: true,
      currentTab: '1',
    };
  },
  created() {
    console.log('studentList', this.studentList);
  },
  methods: {
    // 通知父窗口关闭
    onDialogClosed() {
      this.$emit('close');
    }
  }
};
</script>

<style>
.class-evaluations-dialog .el-dialog__body {
  padding-top: 0;
}
</style>
