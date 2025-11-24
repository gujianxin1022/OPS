<template>
  <div class="homeworkView">
    <el-tabs v-model="homeworkType" type="card">
      <el-tab-pane :label="$t('课堂练习')" :name="4" lazy>
        <InClassExercise />
      </el-tab-pane>
      <el-tab-pane :label="$t('互动作业')" :name="3">
        <InteractionJob
          v-if="homeworkType === 3"
          :homeworkType="homeworkType"
          :currentLang="currentLang"
          :studentInfo="studentInfo"
          :subjectType="subjectType"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('打印作业')" :name="1">
        <PrintJob
          v-if="homeworkType === 1"
          :homeworkType="homeworkType"
          :currentLang="currentLang"
          :studentInfo="studentInfo"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('在线作业')" :name="2">
        <OnlineJob
          v-if="homeworkType === 2"
          :homeworkType="homeworkType"
          :studentInfo="studentInfo"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PrintJob from './homeworkView/printJob.vue';
import InteractionJob from './homeworkView/interactionJob.vue';
import OnlineJob from './homeworkView/onlineJob.vue';
import InClassExercise from './homeworkView/InClassExercise.vue';
import { mapGetters } from 'vuex';

export default {
  components: { PrintJob, InteractionJob, OnlineJob, InClassExercise },
  data() {
    return {
      homeworkType: 3,
      studentInfo: {
        lessonName: '',
        studentName: ''
      },
      subjectType: 0,
    }
  },
  computed: {
    ...mapGetters(['currentLang']),
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let {lessonName, studentName} = this.$route.query;
      this.studentInfo = {lessonName, studentName};
      this.subjectType = Number(this.$route.query.subjectType);
    },
  },
}
</script>

<style lang="scss" scoped>
.homeworkView {
  padding: 20px;
}
::v-deep .el-tabs__content {
  padding: 10px 0 0;
}
</style>
