<!-- 测评列表 -->
<template>
  <el-card class="evaluation-list-card">
    <el-tabs v-model="tabActiveName" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('定级测评')" name="1">
        <el-table v-loading="loading" :data="dataList" :empty-text="$t('暂无数据')" style="width: 100%">
          <el-table-column prop="evaluationId" :label="$t('测评ID')" width="100">
          </el-table-column>
          <el-table-column prop="name" :label="$t('测评名称')">
          </el-table-column>
          <el-table-column prop="reportUrl" :label="$t('测评报告')">
            <template #default="{ row }">
              <el-button v-if="row.isCompleted" type="text" @click="viewReport(row)">{{ $t('查看报告') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="finishTime" :label="$t('完成时间')">
            <template #default="{ row }">
              {{ row.finishTime ? DateTimeUtils.dateClockTimeMin(row.finishTime) : '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="isOpen" :label="$t('开放状态')">
            <template #default="{ row }">
              <el-tag v-if="row.isOpen" type="success" size="small">{{ $t('打开') }}</el-tag>
              <el-tag v-else type="info" size="small">{{ $t('关闭') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="80">
            <template #default="{ row }">
              <el-button v-if="row.isOpen" type="text" :disabled="row.isCompleted"
                @click="updateRowStatus(row, false)">{{
                  $t('关闭')
                }}</el-button>
              <el-button v-else type="text" :disabled="row.isCompleted" @click="updateRowStatus(row, true)">{{ $t('打开')
                }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('阶段测评')" name="2" lazy>
        <el-table v-loading="loading" :data="stageDataList" :empty-text="$t('暂无数据')" style="width: 100%">
          <el-table-column type="index" :label="$t('序号')" width="50">
          </el-table-column>
          <el-table-column prop="completedTime" :label="$t('测评时间')">
            <template #default="{ row }">
              {{ row.completedTime ? DateTimeUtils.dateClockTimeMin(row.completedTime) : '--' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('课程')">
            <template #default="{ row }">
              {{ isZh ? row.lessonDescriptionCn : row.lessonDescriptionEn }}
            </template>
          </el-table-column>
          <el-table-column prop="finishTime" :label="$t('测评结果')">
            <template #default="{ row }">
              <el-rate :value="row.finalStar" disabled>
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column prop="finishTime" :label="$t('测评状态')">
            <template #default="{ row }">
              {{ getTestStatusName(row.status) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="80">
            <template #default="{ row }">
              <el-button type="text" :disabled="![2, 4].includes(row.status)" @click="viewReport(row)">{{ $t('查看报告') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getStudentGradeEvaluationRecords, handleStudentGradeEvaluationConfig, getStudentStageEvaluationRecords } from '@/api/testEvaluation';
import { goAssessmentPage } from '@/components/assessment/h5Helper';

export default {
  props: {
    studentId: {
      type: [String, Number],
      required: true,
    },
    subjectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tabActiveName: '1',
      loading: false,
      dataList: [],
      // 阶段测评数据
      stageDataList: [],
    }
  },
  computed: {
    isZh() {
      return this.$i18n.locale === 'zh';
    },
  },
  watch: {
    subjectId: {
      handler(newVal) {
        // 切换学科后重新获取数据
        this.dataList = [];
        this.stageDataList = [];
        this.handleTabClick();
      },
      immediate: true,
    },
  },
  methods: {
    getDataList() {
      this.loading = true;
      this.dataList = [];
      return getStudentGradeEvaluationRecords({ studentId: this.studentId, subjectId: this.subjectId }).then(list => {
        this.dataList = list;
      }).finally(() => {
        this.loading = false;
      });
    },
    getStageDataList() {
      this.loading = true;
      this.stageDataList = [];
      return getStudentStageEvaluationRecords({ studentId: this.studentId, subjectId: this.subjectId }).then(list => {
        this.stageDataList = list;
      }).finally(() => {
        this.loading = false;
      });
    },
    viewReport(row) {
      const query = {
        bizId: row.evaluationId ?? row.id,
        userId: this.studentId,
        subjectId: this.subjectId,
        xlng: this.$i18n.locale,
      };
      goAssessmentPage(row.reportUrl, query);
    },
    async updateRowStatus(row, isOpen) {
      this.loading = true;
      const data = {
        studentId: this.studentId,
        subjectTypeId: this.subjectId,
        evaluationId: row.evaluationId,
        isOpen,
      };
      try {
        await handleStudentGradeEvaluationConfig(data);
        this.$message.success(this.$t('操作成功'));
        await this.getDataList();
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    handleTabClick() {
      const tabName = this.tabActiveName;
      if (tabName === '1') {
        if (this.dataList.length === 0) {
          this.getDataList();
        }
      } else if (tabName === '2') {
        if (this.stageDataList.length === 0) {
          this.getStageDataList();
        }
      }
    },
    getTestStatusName(status) {
      // status: 状态: 1-进行中 2-已提交（客观题终态） 3-待批改 4-已批改 5-已查阅
      switch (status) {
        case 1:
          return this.$t('进行中');
        case 2:
          return this.$t('已提交');
        case 3:
          return this.isZh ? '待批改' : 'To be reviewed';
        case 4:
          return this.isZh ? '已批改' : 'Reviewed';
        case 5:
          return this.isZh ? '已查阅' : 'Reviewed';
        default:
          return '未知状态';
      }
    },
  },
  i18n: {
    messages: {
      zh: {
        "阶段测评": "阶段测评",
        "测评时间": "测评时间",
        "课程": "课程",
        "测评结果": "测评结果",
        "测评状态": "测评状态",
      },
      en: {
        "阶段测评": "Stage Test",
        "测评时间": "Test Time",
        "课程": "Curriculum",
        "测评结果": "Test Result",
        "测评状态": "Test Status",
      },
    }
  }
}
</script>

<style lang="scss" module>
.evaluation-list-card {
  margin-bottom: 20px;
}
</style>
