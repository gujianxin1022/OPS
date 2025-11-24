<template>
  <el-table :data="data" v-loading="loading">
    <el-table-column v-if="index" :label="$t('序号')" width="50" type="index" :index="index">
    </el-table-column>
    <el-table-column :label="$t('上课时间')" width="140">
      <template v-slot="{ row }">
        <span>{{ DateTimeUtils.dateClockTime(row.courseStartTime) }}</span>
      </template>
    </el-table-column>
    <!-- 上课进度 -->
    <el-table-column prop="lessonDescription" :label="$t('schedule-课表')" width="180">
      <template v-slot="{ row }">
        <span v-if="$i18n.locale === 'zh'">{{
          row.courseEditionId | mapEdtion
          }}</span>
        <span v-else>{{
          row.courseEditionId | mapEdtionEn
          }}</span>
        <span>{{ row.lessonDescription }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('学生姓名')" width="200">
      <template v-slot="{ row }">
        <el-button type="text" @click="goStudentInfo(row)">{{ row.studentName }}</el-button>
      </template>
    </el-table-column>
    <el-table-column v-if="!hideColumns.includes('parent')" :label="$t('家长ID')" width="180">
      <template v-slot="{ row }">
        <el-button type="text" @click="goParentInfo(row)">{{ row.parentId }}</el-button>
      </template>
    </el-table-column>
    <el-table-column :label="$t('授课老师评价')" width="200">
      <template v-slot="{ row }">
        <el-rate :value="row.teachingPerformanceStar" disabled>
        </el-rate>
        <div>
          <el-tag v-for="(item, i) in row.teachingPerformanceTag" :key="i" size="mini">{{ item }}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="teachingPerformanceTagContent" :label="$t('想对老师说')" width="200"
      show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('课程内容评价')" width="200">
      <template v-slot="{ row }">
        <el-rate :value="row.classContentStar" disabled></el-rate>
        <div>
          <el-tag v-for="(item, i) in row.classContentTag" :key="i" size="mini">{{ item }}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('老师后续课堂建议')" width="200">
      <template v-slot="{ row }">
        <el-tag v-for="(item, i) in row.classSuggestionTag" :key="i" size="mini">{{ item }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="moreSuggestionsContent" :label="$t('更多评价')" width="200"></el-table-column>
    <el-table-column v-if="!hideColumns.includes('teacher')" :label="$t('老师')" width="150">
      <template v-slot="{ row }">
        <el-button type="text" @click="goTeacherInfo(row)">{{ row.teacherName }}</el-button>
      </template>
    </el-table-column>
    <el-table-column :label="$t('学科')">
      <template v-slot="{ row }">
        {{ toSubjectName(row.subjectType) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('班级类型')">
      <template v-slot="{ row }">
        {{ toClassTypeName(row.classType) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('课程类型')" width="100">
      <template v-slot="{ row }">
        {{ toCourseTypeName(row.courseType) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('课堂模式')" width="100">
      <template v-slot="{ row }">
        {{ row.classMode | virtualclassType }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('提交时间')" width="140">
      <template v-slot="{ row }">
        <span>{{ DateTimeUtils.dateClockTime(row.evaluateTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('状态')" :width="isEn ? 124 : 80">
      <template v-slot="{ row }">
        <el-tag v-if="row.status == 1" type="success" size="small" @click="togglePublish(row)">{{ $t('已上架') }}</el-tag>
        <el-tag v-else type="info" size="small" @click="togglePublish(row)">{{ $t('未上架') }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column :label="$t('操作')" width="200">
      <template v-slot="{ row }">
        <el-button v-if="row.status == 1" type="text" size="small" @click="togglePublish(row)">{{ $t("下架")
          }}</el-button>
        <el-button v-else type="text" size="small" @click="togglePublish(row)">{{ $t("上架") }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import constants from "@/utils/constants.js";
import { updateEvaluationStatus } from '@/api/evaluation/index';
export default {
  props: {
    data: Array,
    // 同 el-table-column 的 index 属性
    index: {
      type: [Number, Function],
    },
    // 需要隐藏的列
    hideColumns: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isEn() {
      return this.$i18n.locale === 'en';
    }
  },
  methods: {
    goStudentInfo(row) {
      this.$router.push({
        path: `/studentManagement/studentInfo`,
        query: {
          studentId: row.studentId,
          studentName: row.studentName,
        },
      });
    },
    goParentInfo(row) {
      this.$router.push({
        path: `/studentManagement/parentInfo`,
        query: {
          parentUserId: row.parentId,
        },
      });
    },
    goTeacherInfo(row) {
      this.$router.push({
        path: `/tutorManagement/teacherInfo`,
        query: {
          id: row.teacherId,
          teacherName: row.teacherName,
        },
      });
    },
    toSubjectName(subjectType) {
      const subjectList = constants.subjectList(this.$i18n.locale);
      const item = subjectList.find((item) => item.value === subjectType);
      return item ? item.label : "";
    },
    toClassTypeName(classType) {
      const classTypeList = constants.courseTypeList(this.$i18n.locale === 'en');
      const item = classTypeList.find((item) => item.value === classType);
      return item ? item.label : "";
    },
    toCourseTypeName(courseType) {
      if (courseType === undefined || courseType === null) return "--";
      return courseType === 0 ? this.$t("试听") : this.$t("正式");
    },
    togglePublish(row) {
      console.log('togglePublish', row);
      const isPublish = row.status !== 1;
      const data = {
        evaluateId: row.evaluateId,
        status: isPublish ? 1 : 2,
      };
      updateEvaluationStatus(data).then(({ result }) => {
        if (result) {
          this.$message.success(this.$t('操作成功'));
          this.$emit('refresh');
        } else {
          this.$message.error(this.$t('操作失败'));
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-tag+.el-tag {
  margin-left: 5px;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tooltip-content {
  width: 90vw;
}
</style>
