<template>
  <div class="template-link-class">
    <p class="template-name">
      模板名称：<span>{{ templateName }}</span>
    </p>
    <div class="linked-class">
      <p>
        <span>已关联课程：</span>
        <el-button type="primary" @click="showAddButton">添加</el-button>
      </p>
      <el-table
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        tooltip-effect="dark"
        border
        fit
        style="width: 801px"
        :data="tableData"
      >
        <el-table-column
          align="center"
          prop="editionName"
          :label="$t('版本')"
          width="200"
        >
          <template slot-scope="scope">
            {{
              currentLang == "en"
                ? scope.row.editionName
                : scope.row.editionNameZh
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="courseName"
          :label="$t('级别')"
          width="200"
        >
          <template slot-scope="scope">
            Level{{ scope.row.courseLevel }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="lessionNo"
          :label="$t('课程')"
          width="200"
        >
          <template slot-scope="scope">
            Lesson{{ scope.row.lessionNo }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              :loading="loading && deleteIndex === scope.$index"
              @click="deleteLinkedClass(scope.row, scope.$index)"
              >{{ $t("删除") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="关联课程" :visible.sync="dialogVisible" width="50%">
      <div class="choose-edition">
        <span class="edition-level">版本级别</span>
        <el-cascader
          ref="cascader"
          placeholder="请选择"
          v-model="editionAndLevel"
          :options="editionAndLevelInfo"
          @change="chooseEditionLevel"
        >
        </el-cascader>
        <span class="label mr10 ml20" v-if="lessonSubjectData !== null"
          >课程</span
        >
        <el-select
          v-model="lessonId"
          placeholder="请选择"
          v-if="lessonSubjectData !== null"
          @change="selectLesson"
        >
          <el-option
            v-for="item in lessonSubjectData"
            :key="item.value"
            :label="item.lessonNo.toString()"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <div v-else style="width: 250px"></div>
      </div>
      <div class="add-button">
        <el-button
          v-if="lessonId !== null"
          :loading="loading"
          type="primary"
          @click="linkEditionAndLevel(null)"
          >添加</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "templateLinkClass",
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      editionAndLevel: null,
      editionAndLevelInfo: null,
      lessonSubjectData: null,
      courseId: null,
      lessonObj: null,
      lessonId: null,
      editionAndLevelOriginData: null,
      templateId: null,
      selectedEditionAndLevelInfo: {},
      loading: false,
      deleteIndex: null,
      templateName: null,
    };
  },
  created() {
    this.getEditionAndLevel();
    this.templateId = this.$route.query.id;
    this.getTemplateDetail();
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    editionAndLevel(newVal, oldVal) {
      if (newVal === null) return;
      this.lessonId = null;
      this.editionAndLevelOriginData.forEach((item) => {
        if (item.editionId === newVal[0]) {
          item.courseLevelInfoList.forEach((course) => {
            if (course.courseLevel === newVal[1]) {
              this.courseId = course.levelId;
              return;
            }
          });
        }
      });
    },
    courseId(newVal, oldVal) {
      this.lessonSubjectData = null;
      this.$Api.teacherManagement.getAllLessons(newVal).then((res) => {
        this.lessonSubjectData = res.data.data;
      });
    },
  },
  methods: {
    selectLesson(lessonId) {
      this.lessonSubjectData.some((e) => {
        if (e.id === lessonId) {
          this.lessonObj = e;
          return true;
        }
      });
    },
    async getTemplateDetail() {
      const res = await this.$Api.unitReportManagement.getSingleTemplate({
        templateId: this.templateId,
        language: "CN" /* ？ */,
      });
      this.templateName = res.name;
      this.tableData = res.courseInfoResultList || [];
    },
    chooseEditionLevel(data) {
      let edition = this.editionAndLevelInfo.filter(
          (item) => item.value == data[0]
        ),
        level = edition[0].children.filter((item) => item.value == data[1]);
      this.selectedEditionAndLevelInfo = {
        editionName: edition[0].label,
        editionId: data[0],
        level: data[1],
      };
      this.$set(
        this.selectedEditionAndLevelInfo,
        "editionName",
        edition[0].label
      );
      this.$set(this.selectedEditionAndLevelInfo, "courseEditionId", data[0]);
      this.$set(this.selectedEditionAndLevelInfo, "courseName", level[0].label);
      this.$set(this.selectedEditionAndLevelInfo, "courseLevel", data[1]);
    },

    async linkEditionAndLevel(deleteLinkedEditionInfo) {
      let params;
      if (deleteLinkedEditionInfo) {
        params = {
          templateId: this.templateId,
          courseEditionId: deleteLinkedEditionInfo.courseEditionId,
          courseLevel: deleteLinkedEditionInfo.courseLevel,
          courseLevelId: deleteLinkedEditionInfo.courseLevelId,
          lessonNo: deleteLinkedEditionInfo.lessionNo,
          lessonId: deleteLinkedEditionInfo.lessonId,
          type: 2, // 删除
        };
      } else {
        params = {
          templateId: this.templateId,
          courseEditionId: this.editionAndLevel[0],
          courseLevel: this.editionAndLevel[1],
          courseLevelId: this.courseId,
          lessonNo: this.lessonObj.lessonNo,
          lessonId: this.lessonId,
          type: 1, //关联
        };
      }
      this.loading = true;

      try {
        const res = await this.$Api.unitReportManagement.templateLinkCourse(
          params
        );
        if (res.code === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.warning(res.message);
        }
        if (params.type === 1) {
          this.getTemplateDetail();
          this.dialogVisible = false;
          this.resetForm();
        } else {
          this.tableData.splice(this.deleteIndex, 1);
        }
      } finally {
        this.loading = false;
        this.deleteIndex = null;
      }
    },
    resetForm() {
      this.editionAndLevel = null;
      this.lessionNo = null;
    },
    showAddButton() {
      this.dialogVisible = true;
    },
    deleteLinkedClass(data, index) {
      this.deleteIndex = index;
      this.$confirm("确认删除？")
        .then((_) => {
          this.linkEditionAndLevel(data);
        })
        .catch((_) => {
          this.deleteIndex = null;
        });
    },
    getEditionAndLevel() {
      this.$Api.base.courseEdition().then((res) => {
        if (res.status === 200) {
          this.editionAndLevelOriginData = res.data.data;
          this.editionAndLevelInfo = [];
          res.data.data.forEach((editionValue, editionIndex) => {
            this.editionAndLevelInfo[editionIndex] = {};
            this.editionAndLevelInfo[editionIndex]["value"] =
              editionValue.editionId;
            this.editionAndLevelInfo[editionIndex]["label"] =
              editionValue.editionNameZh;
            this.editionAndLevelInfo[editionIndex]["children"] = [];
            editionValue.courseLevelInfoList.forEach(
              (levelValue, levelIndex) => {
                this.editionAndLevelInfo[editionIndex]["children"][levelIndex] =
                  {};
                this.editionAndLevelInfo[editionIndex]["children"][levelIndex][
                  "value"
                ] = levelValue.courseLevel;
                this.editionAndLevelInfo[editionIndex]["children"][levelIndex][
                  "label"
                ] = levelValue.courseName;
              }
            );
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.template-link-class {
  padding: 20px 0 0 20px;
  .template-name {
    font-size: 16px;
    > span {
      color: #666;
    }
  }
  .linked-class {
    width: 801px;
    padding-top: 20px;
    font-size: 16px;
    > p {
      display: flex;
      justify-content: space-between;
    }
  }
  .choose-edition {
    display: flex;
    justify-content: center;
    align-items: center;
    .edition-level {
      margin-right: 10px;
    }
  }
  .add-button {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
