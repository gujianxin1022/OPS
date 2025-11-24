<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="handleClose"
    :title="titleName"
    :visible.sync="teacherComments"
    append-to-body
  >
    <div class="teacher-tit">
      <el-row>
        <el-col :span="12">
          <label>{{ $t("教师") }}：{{ teacherInfo.teacherName }}</label>
        </el-col>
        <el-col :span="12">
          <label
            >{{ $t("上课时间") }}：{{
              DateTimeUtils.dateClockTime(teacherInfo.classTime)
            }}</label
          >
        </el-col>
        <el-col :span="12">
          <label
            >{{ $t("schedule-Class Size") }}：{{ teacherInfo.classType }}</label
          >
        </el-col>
        <el-col :span="12">
          <label
            >{{ $t("my-home-1-Lesson Detail") }}：{{
              currentLang == "en"
                ? teacherInfo.course.lessonDescEN
                : teacherInfo.course.lessonDescZH
            }}</label
          >
        </el-col>
      </el-row>
    </div>
    <el-tabs
      v-model="activeName"
      v-if="valuationrate && valuationrate.length > 0"
      type="border-card"
    >
      <el-tab-pane
        v-for="(item, index) in valuationrate"
        :name="item.classroomVirtualclassComment.studentUserId"
        :key="index"
      >
        <span slot="label">{{
          studentFeedback ? item.commentor : item.ownerName
        }}</span>
        <!-- 老师的 -->
        <div v-if="studentFeedback">
          <template v-if="item.classroomVirtualclassComment">
            <div class="rate-tit">
              <span class="demonstration"
                >{{ $t("my-home-Profeciency") }}：</span
              >
              <el-rate
                disabled
                :score-template="$t('my-home-Profeciency') + '：'"
                v-model="item.classroomVirtualclassComment.ratingPk"
              />
            </div>
            <div class="rate-tit">
              <span class="demonstration">{{ $t("my-home-Progress") }}：</span>
              <el-rate
                v-model="item.classroomVirtualclassComment.ratingId"
                disabled
                :score-template="$t('my-home-Progress') + '：'"
              />
            </div>
            <div
              v-if="item.classroomVirtualclassComment.ratingLe"
              class="rate-tit"
            >
              <span class="demonstration">{{ $t("学习态度") }}：</span>
              <el-rate
                v-model="item.classroomVirtualclassComment.ratingLe"
                disabled
                :score-template="$t('学习态度') + '：'"
              />
            </div>
            <div
              v-if="item.classroomVirtualclassComment.joined"
              class="rate-tit"
            >
              <span class="demonstration">{{ $t("参与度") }}：</span>
              <el-rate
                v-model="item.classroomVirtualclassComment.joined"
                disabled
                :score-template="$t('参与度') + '：'"
              />
            </div>
            <div
              v-if="item.classroomVirtualclassComment.happy"
              class="rate-tit"
            >
              <span class="demonstration">{{ $t("愉悦度") }}：</span>
              <el-rate
                v-model="item.classroomVirtualclassComment.happy"
                disabled
                :score-template="$t('愉悦度') + '：'"
              />
            </div>
            <div
              v-if="titleName === '本课小结' || titleName === 'Class Summary'"
              class="mt5"
            >
              <div>
                {{ $t("本节课难度对改学生来说是否合适") }}：{{
                  $t(
                    difficultLevelMap[
                      item.classroomVirtualclassComment.difficultLevelOne
                    ]
                  )
                }}
              </div>
              <div class="mt5">
                {{ $t("学生是否需要调整级别或版本") }}：{{
                  $t(
                    adjustLevelMap[
                      item.classroomVirtualclassComment.adjustLevel
                    ]
                  )
                }}
              </div>
            </div>
          </template>
        </div>
        <!--学生的  -->
        <div v-else>
          <template v-if="item.classroomVirtualclassComment">
            <div class="rate-tit">
              <span class="demonstration"
                >{{ $t("professional knowledge") }}：</span
              >
              <el-rate
                v-model="item.classroomVirtualclassComment.ratingPk"
                disabled
                :score-template="$t('my-home-Profeciency') + '：'"
              />
            </div>
            <div class="rate-tit">
              <span class="demonstration">{{ $t("Teaching methods") }}：</span>
              <el-rate
                v-model="item.classroomVirtualclassComment.ratingId"
                disabled
                :score-template="$t('my-home-Profeciency') + '：'"
              />
            </div>
            <div class="rate-tit">
              <span class="demonstration"
                >{{ $t("Actively create learning environment") }}：</span
              >
              <el-rate
                v-model="item.classroomVirtualclassComment.ratingLe"
                disabled
                :score-template="$t('my-home-Profeciency') + '：'"
              />
            </div>
          </template>
        </div>
        <p
          v-if="
            item.classroomVirtualclassComment.commentZh ||
            item.classroomVirtualclassComment.commentEn
          "
          v-loading="commentsLoading"
          class="evaluate"
        >
          <span
            v-html="
              currentLang == 'en'
                ? item.classroomVirtualclassComment.commentEn.replace(
                    /\n/g,
                    '<br>'
                  )
                : item.classroomVirtualclassComment.commentZh.replace(
                    /\n/g,
                    '<br>'
                  )
            "
          >
          </span>
        </p>
        <p v-else class="no-comments">
          <img :src="IconNoComments" />
          {{ $t("no comment yet") }}
        </p>
      </el-tab-pane>
    </el-tabs>
    <p v-else class="no-comments">
      <img :src="IconNoComments" />
      {{ $t("No evaluation") }}
    </p>
  </el-dialog>
</template>
<script>
import IconNoComments from "../../../assets/icon-no-comments.png";
import { mapGetters } from "vuex";
export default {
  name: "teacherComments",
  props: {
    teacherInfo: {
      type: Object,
      default: () => {},
    },
    commentsLoading: {
      type: Boolean,
      default: false,
    },
    valuationrate: {
      type: Array,
      default: () => [],
    },
    studentAll: {
      type: Array,
      default: () => [],
    },
    teacherComments: {
      type: Boolean,
      default: false,
    },
    titleName: {
      type: String,
      default: "",
    },
    studentFeedback: {
      type: Boolean,
      default: true,
    },
    studentUserId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      IconNoComments: IconNoComments,
      difficultLevelMap: {
        1: "非常困难",
        2: "困难",
        3: "正好",
        4: "简单",
        5: "非常简单",
      },
      adjustLevelMap: {
        1: "不需要",
        2: "保留现在的课程版本,调整级别",
        3: "需要调整到别的课程版本",
      },
      activeName: "",
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeTeacherComments");
    },
  },
  mounted() {
    this.activeName =
      this.studentUserId ||
      this.valuationrate[0]?.classroomVirtualclassComment.studentUserId;
  },
};
</script>
<style lang="scss" scoped>
.type-btn {
  padding: 20px 0 0 0;
}
.table-wrapper {
  margin-top: 20px;
}
.teacher-tit {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  .el-col {
    line-height: 30px;
  }
}
.rate-tit {
  display: flex;
  .demonstration {
    line-height: 20px;
    width: 140px;
    font-size: 14px;
  }
}
.evaluate {
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: auto;
}
label {
  font-weight: 400;
}
.no-comments {
  img {
    width: 60px;
    height: 60px;
    display: block;
    margin: 10px auto;
  }
  padding: 30px 0 100px 0;
  text-align: center;
  height: 30px;
}
.red {
  color: #f00;
}
.el-button + .el-button {
  margin-left: 0;
}
.reason {
  display: block;
  border-radius: 5px;
  height: 100px;
  overflow: auto;
  border: 1px solid #ccc;
  padding: 10px 5px;
  margin: 10px 0;
}
.btn-style {
  display: block;
  margin: 20px auto;
}
.mt20 {
  margin: 20px auto 0 auto;
  display: block;
}
.screen-item-label {
  width: 100px;
}
.margin {
  display: flex;
  justify-content: center;
}
</style>
