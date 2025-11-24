<template>
  <div class="match-teach">
    <el-dialog
      :title="$t('匹配老师')"
      :show-close="true"
      :visible.sync="show"
      :before-close="close"
      custom-class="m-scroll-height"
      :close-on-click-modal="false"
      width="1200px"
      append-to-body
    >
      <div class="pb20">
        <span style="display: inline-block; width: 312px; margin-bottom: 15px">
          <FilterByUserAccount
            @change="
              (params) => {
                userParams = params;
              }
            "
            @search="search"
          />
        </span>
        <el-select
          clearable
          v-model="screenData.hide"
          :placeholder="$t('开放状态')"
        >
          <el-option
            v-for="item in openList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="screenData.full_work"
          :placeholder="$t('是否全职')"
        >
          <el-option :label="$t('非全职')" value="0"></el-option>
          <el-option :label="$t('全职')" value="1"></el-option>
        </el-select>
        <el-select
          clearable
          v-model="languageList"
          collapse-tags
          multiple
          filterable
          allow-create
          default-first-option
          :placeholder="$t('请选择语言标签')"
        >
          <el-option
            v-for="item in languageLabelListData"
            :key="item.configId"
            :label="item.configValue"
            :value="item.configId"
          >
          </el-option>
        </el-select>
        <FilterByTeachingStyleNew
          ref="FilterByTeachingStyle"
          style="display: inline-block;"
          @changeStyleSelect="
            (styleIds) => {
              teachingStyle = styleIds;
            }
          "
          :placeholder="$t('教学风格')"
          :subjectType="subjectType"
        />
        <!-- <el-select
          clearable
          v-model="teachingStyle"
          collapse-tags
          multiple
          filterable
          allow-create
          default-first-option
          :placeholder="$t('教学风格')"
        >
          <el-option
            v-for="item in teachStyleData"
            :key="item.configId"
            :label="item.configValue"
            :value="item.configId"
          >
          </el-option>
        </el-select> -->
        <el-button :loading="loading" type="primary" @click="search">{{ $t("搜索") }}</el-button>
      </div>
      <el-table
        v-loading="loading"
        :border="false"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        height="310"
        style="width: 100%"
        :data="matchTeacherData"
      >
        <el-table-column
          fixed
          width="120px"
          prop="userName"
          align="center"
          :label="$t('教师ID')"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="showTeacherCardDialog(scope.row)">{{
              scope.row.tutorUserId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          width="120px"
          prop="identityName"
          align="center"
          :label="$t('老师姓名')"
        >
        </el-table-column>
        <el-table-column
          width="136px"
          prop="realName"
          align="center"
          :label="$t('老师昵称')"
        >
        </el-table-column>
        <el-table-column width="110px" align="center" :label="$t('是否全职')">
          <template slot-scope="scope">
            <span>{{
              scope.row.fullWork == 0
                ? $t("否")
                : scope.row.fullWork == 1
                ? $t("是")
                : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="date"
          align="center"
          :label="$t('发布时间匹配课程/排课')"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.publishCount }}/{{
                screenData.start_times.length
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          width="110"
          prop="date"
          align="center"
          :label="$t('发布时间匹配度')"
        >
          <template slot-scope="scope">
            <span>{{
              computedYes(
                {
                  publish_count: scope.row.publishCount,
                  no_publish_count: scope.row.noPublishCount,
                },
                "yes"
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="date"
          align="center"
          :label="$t('查看未匹配课程')"
        >
          <template slot-scope="scope">
            <el-button
              v-if="showCheckBtn(scope.row.publishCount)"
              type="text"
              @click="checkMatching(scope.row)"
              >{{ $t("查看") }}</el-button
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          width="110"
          prop="date"
          align="center"
          :label="$t('空闲时间匹配度')"
        >
          <template slot-scope="scope">
            <span>{{
              computedYes(
                {
                  publish_count: scope.row.publishCount,
                  no_publish_count: scope.row.noPublishCount,
                },
                "no"
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          prop="studentCount"
          align="center"
          :label="$t('1v1学生')"
        >
        </el-table-column>
        <el-table-column
          width="100px"
          prop="smallClassCount"
          align="center"
          :label="$t('小班班级')"
        >
        </el-table-column>
        <el-table-column
          width="140"
          prop="phone"
          align="center"
          :label="$t('Teacher\'s telephone')"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          width="135"
          align="center"
          :label="$t('开放状态')"
        >
          <template slot-scope="scope">
            <span>{{ $t(Filters.getOpenTxt(scope.row.hide)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="120"
          align="center"
          :label="$t('语言标签')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.languages }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="120"
          align="center"
          :label="$t('教学风格')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.teachStyles }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          fixed="right"
          align="center"
          :label="$t('操作')"
        >
          <template slot-scope="scope">
            <el-button
              v-show="changeOrSetStatus == Constants.setTeacher"
              @click.native.prevent="setTeacher(scope.$index)"
              v-if="isFromCreate"
              type="text"
              size="small"
            >
              {{ $t("安排老师") }}
            </el-button>
            <el-button
              v-show="changeOrSetStatus == Constants.changeTeacher"
              @click.native.prevent="changeTeacher(scope.$index)"
              v-if="isFromCreate"
              type="text"
              size="small"
            >
              {{ $t("更换老师") }}
            </el-button>
            <el-button
              @click.native.prevent="showTimeTableFn(scope.$index)"
              type="text"
              size="small"
              v-if="isFromCreate"
            >
              {{ $t("课表") }}
            </el-button>
            <el-button
              @click.native.prevent="chooseTeacher(scope.$index)"
              type="text"
              size="small"
              v-if="!isFromCreate"
            >
              {{ $t("选择") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="count"
        :current-page="screenData.page"
        @getCurrentPage="handleChangeCurrent"
        @getPerPage="getPerPage"
      />
      <!-- 内部弹窗 -->
      <el-dialog
        :title="innnerTitle"
        :visible.sync="showInner"
        width="500px"
        @close="showInner = false"
        custom-class="c-conflict-wrap"
        :close-on-click-modal="false"
        append-to-body
      >
        <template v-if="conflictTimes.length !== 0">
          <div class="c-conflict-list">
            <div class="pb10 f16 title">
              {{
                $t("安排老师失败！以下3节课与老师时间有冲突", {
                  classAmount: conflictTimes.length,
                })
              }}
            </div>
            <div
              class="item"
              v-for="(item, index) in conflictTimes"
              :key="index"
            >
              <span style="color: red">{{
                DateTimeUtils.dateClockTime(item)
              }}</span>
            </div>
          </div>
          <div slot="footer" class="dialog-footer tc">
            <el-button type="primary" @click="showInner = false">{{
              $t("我知道了")
            }}</el-button>
          </div>
        </template>

        <template v-else>
          <div class="c-tips">
            {{
              $t("老师时间可用！确定安排 作为本班老师吗？", {
                teacherName: teacherName,
              })
            }}
          </div>
          <div slot="footer" class="dialog-footer tc">
            <el-button @click="showInner = false">{{ $t("取消") }}</el-button>
            <el-button
              type="primary"
              @click="sureThisTeacher"
              :loading="sureLoading"
              >{{ $t("确定") }}</el-button
            >
          </div>
        </template>
      </el-dialog>
      <el-dialog
        :title="$t('老师课表')"
        :visible.sync="showTimeTable"
        width="1100px"
        @close="showTimeTable = false"
        custom-class="c-conflict-wrap"
        :close-on-click-modal="false"
        append-to-body
      >
        <TeacherTimeTabel
          :teacherName="teacherName"
          :teacherId="teacherId"
          :startTimes="startTimes"
          :isFromSmallClass="isFromSmallClass"
          :showTeacherTimetable="showTimeTable"
        ></TeacherTimeTabel>
      </el-dialog>
    </el-dialog>
    <TeacherCard
      :showTeacherCard="showTeacherCard"
      :tutorId="tutorId"
      :realName="realName"
      @closeTeacherCardDialog="closeTeacherCardDialog"
    ></TeacherCard>
    <CoursesNotMatched
      v-if="coursesNotMatchedShow"
      :dialogVisible.sync="coursesNotMatchedShow"
      :teacherId="teacherId"
      :matchTeacherTime="matchTeacherTime"
    />
  </div>
</template>
<script>
import TeacherTimeTabel from "../../tutorManagement/teacherInfoSub/TeacherTimetable";
import TeacherCard from "./teacherCard";
import CoursesNotMatched from "./coursesNotMatched.vue";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

import { ABNORMAL_CODE } from "@/utils/constants";
import FilterByTeachingStyleNew from "@/components/FilterItem/TeacherFilter/FilterByTeachingStyleNew";

export default {
  components: {
    TeacherTimeTabel,
    TeacherCard,
    CoursesNotMatched,
    FilterByUserAccount,
    FilterByTeachingStyleNew
  },
  props: {
    groupScale: {
      type: Number,
      default: null,
    },
    show: {
      type: Boolean,
      default: "",
    },
    matchTeacherTime: {
      type: Array,
      default: () => [],
    },
    isFromCreate: {
      type: Boolean,
      default: true,
    },
    classTimetableIds: {
      type: Array,
      default: () => [],
    },
    changeOrSetStatus: {
      type: String,
      default: "",
    },
    groupDetailsInfo: {
      type: Object,
      default: () => {},
    },
    subjectType:{
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      openList: this.Constants.openForTeacherList,
      name: "",
      isFromSmallClass: true,
      showInner: false,
      showTimeTable: false,
      loading: false,
      sureLoading: false,
      startTimes: new Date(),
      innnerTitle: "", // 确定安排老师 || 冲突提示
      teacherName: "",
      userParams: {},
      screenData: {
        page_size: 50,
        page: 1,
        class_id: "",
        hide: "",
        start_times: [],
        full_work: "",
      },
      page: 1,
      count: 0,
      matchTeacherData: [],
      teacherId: -1,
      teacherName: "",
      conflictTimes: [],
      showTeacherCard: false,
      languageLabelListData: [], //获取语言标签
      languageList: [], //选择语言标签
      // teachStyleData: [], // 获取教学风格
      teachingStyle: [], // 选择教学标签
      coursesNotMatchedShow: false,
      tutorId: "",
      realName: "",
    };
  },
  created() {
    this.initData();
    this.getLanguage();
  },
  watch: {
    show(newData, oldData) {
      if (newData) {
        if (this.matchTeacherTime.length === 0) return;
        let arr = [];
        if (
          this.matchTeacherTime[0].includes("T") &&
          this.matchTeacherTime[0].includes("Z")
        ) {
          this.screenData.start_times = this.matchTeacherTime;
          this.getMatchTeacherData();
          return;
        }
        this.matchTeacherTime.forEach((item) => {
          arr.push(new Date(item).toISOString());
        });
        this.screenData.start_times = [...arr];
        this.getMatchTeacherData();
      }
    },
  },
  methods: {
    // 查看未匹配课程
    checkMatching(row) {
      this.teacherId = row.tutorUserId;
      this.coursesNotMatchedShow = true;
    },
    // 语言标签
    getLanguage() {
      this.$Api.tutorManagement.getExamineDic(5).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.languageLabelListData = data.data.map((item) => {
            return {
              configId: item.id,
              configType: item.type,
              configValue: item.typeKey,
              id: 0,
            };
          });
        }
      });
      // this.$Api.tutorManagement.getExamineDic(4).then(({ status, data }) => {
      //   if (status === 200 && data.code === 200) {
      //     this.teachStyleData = data.data.map((item) => {
      //       return {
      //         configId: item.id,
      //         configType: item.type,
      //         configValue: item.typeKey,
      //         id: 0,
      //       };
      //     });
      //   }
      // });
    },
    initData() {
      this.innnerTitle = this.$t("确定安排老师");
    }, // 确定安排老师 || 冲突提示
    closeTeacherCardDialog() {
      this.showTeacherCard = false;
    },
    showTeacherCardDialog(row) {
      this.tutorId = row.tutorUserId;
      this.realName = row.realName;
      this.showTeacherCard = true;
    },
    showTimeTableFn(index) {
      this.teacherId = this.matchTeacherData[index].tutorUserId;
      this.teacherName = this.matchTeacherData[index].realName;
      this.showTimeTable = true;
    },
    //选择老师
    chooseTeacher(index) {
      this.$emit("choose", this.matchTeacherData[index]);
    },
    search() {
      this.screenData.page = 1;
      this.getMatchTeacherData(this.screenData);
    },
    sureThisTeacher() {
      this.sureLoading = true;
      if (this.changeOrSetStatus == this.Constants.setTeacher) {
        if (this.groupDetailsInfo.classTypeId == 2) {
          this.$Api.groupManagement
            .smallClassTimeTableScribe({
              classTimetableIdList: this.classTimetableIds,
              tutorUserId: this.teacherId,
              classId: this.groupDetailsInfo.id,
            })
            .then((res) => {
              this.sureLoading = false;
              if (
                res.data.code === ABNORMAL_CODE.releaseOrAppointmentTimeConflict
              ) {
                this.$notify({
                  message: this.$t("发布或者约课时间有冲突"),
                  type: "error",
                });
              } else if (res.data.code == 200) {
                this.$emit("close");
                this.$notify({
                  message: this.$t("安排老师成功"),
                  type: "success",
                });
                this.$emit("getGroupTimetable");
                this.showInner = false;
                this.close();
              } else {
                let messageArray = res.data.data;
                let str = "";
                if (!messageArray) return;
                messageArray.forEach((item) => {
                  let time = this.DateTimeUtils.dateClockTime(item.startTime);
                  str += `<p><b>${time}</b>(${item.role})</p>`;
                });
                this.$notify({
                  title: this.$t("冲突时间") + "：",
                  dangerouslyUseHTMLString: true,
                  message: str,
                  type: "error",
                });
              }
            });
        } else {
          this.$Api.groupManagement
            .bigClassTimeTableScribe({
              classTimetableIds: this.classTimetableIds,
              tutorId: this.teacherId,
              classId: this.groupDetailsInfo.id,
            })
            .then((res) => {
              this.sureLoading = false;
              if (
                res.data.code === ABNORMAL_CODE.releaseOrAppointmentTimeConflict
              ) {
                this.$notify({
                  message: this.$t("发布或者约课时间有冲突"),
                  type: "error",
                });
              } else if (res.data.code == 200) {
                this.$emit("close");
                this.$notify({
                  message: this.$t("安排老师成功"),
                  type: "success",
                });
                this.$emit("getGroupTimetable");
                this.showInner = false;
                this.close();
              } else {
                this.$notify({
                  type: "error",
                  message: res.data.message,
                });
                let messageArray = res.data.data;
                let str = "";
                if (!messageArray) return;
                messageArray.forEach((item) => {
                  let time = this.DateTimeUtils.dateClockTime(item.startTime);
                  str += `<p><b>${time}</b>(${item.role})</p>`;
                });
                this.$notify({
                  title: this.$t("冲突时间") + "：",
                  dangerouslyUseHTMLString: true,
                  message: str,
                  type: "error",
                });
              }
            });
        }
      } else if (this.changeOrSetStatus == this.Constants.changeTeacher) {
        if (this.groupDetailsInfo.classTypeId == 2) {
          this.$Api.groupManagement
            .changeSmallGroupTeacher({
              classTimetableIdList: this.classTimetableIds,
              tutorUserId: this.teacherId,
              classId: this.groupDetailsInfo.id,
            })
            .then((res) => {
              this.sureLoading = false;
              if (
                res.data.code === ABNORMAL_CODE.releaseOrAppointmentTimeConflict
              ) {
                this.$notify({
                  message: this.$t("发布或者约课时间有冲突"),
                  type: "error",
                });
              } else if (res.data.code == 200) {
                this.$emit("close");
                this.$notify({
                  message: this.$t("更换老师成功"),
                  type: "success",
                });
                this.$emit("getGroupTimetable");
                this.showInner = false;
                this.close();
              } else {
                this.$notify({
                  type: "error",
                  message: res.data.message,
                });
              }
            });
        } else {
          this.$Api.groupManagement
            .changeBigGroupTeacher({
              classTimetableIdList: this.classTimetableIds,
              tutorUserId: this.teacherId,
              classId: this.groupDetailsInfo.id,
            })
            .then((res) => {
              this.sureLoading = false;
              if (
                res.data.code === ABNORMAL_CODE.releaseOrAppointmentTimeConflict
              ) {
                this.$notify({
                  message: this.$t("发布或者约课时间有冲突"),
                  type: "error",
                });
              } else if (res.data.code == 200) {
                this.$emit("close");
                this.$notify({
                  message: this.$t("更换老师成功"),
                  type: "success",
                });
                this.$emit("getGroupTimetable");
                this.showInner = false;
                this.close();
              } else {
                this.$notify({
                  type: "error",
                  message: res.data.message,
                });
              }
            });
        }
      }
    },
    changeTeacher(index) {
      if (this.matchTeacherData[index].conflictTimes) {
        this.conflictTimes = this.matchTeacherData[index].conflictTimes;
      }
      this.teacherName = `${this.matchTeacherData[index].realName}`;
      this.teacherId = this.matchTeacherData[index].tutorUserId;
      this.showInner = true;
    },

    close() {
      this.$emit("close");
    },
    setTeacher(index) {
      if (this.matchTeacherData[index].conflictTimes) {
        this.conflictTimes = this.matchTeacherData[index].conflictTimes;
      }
      this.teacherName = `${this.matchTeacherData[index].realName}`;
      this.teacherId = this.matchTeacherData[index].tutorUserId;
      this.showInner = true;
    },
    showCheckBtn(publish_count) {
      let num = (publish_count / this.screenData.start_times.length) * 100;
      return num === 100 ? false : true;
    },
    computedYes(obj, flag) {
      let { publish_count, no_publish_count } = obj;
      if (publish_count == 0 && no_publish_count == 0) {
        return 0;
      }
      if (
        typeof publish_count == "number" &&
        typeof no_publish_count == "number"
      ) {
        let count = publish_count + no_publish_count;
        if (flag === "yes") {
          let num = (publish_count / this.screenData.start_times.length) * 100;
          let result = num.toFixed(1) + "%";
          return result;
        } else {
          let sum = no_publish_count;
          let num = (sum / this.screenData.start_times.length) * 100;
          let result = num.toFixed(1) + "%";
          return result;
        }
      } else {
        return 0;
      }
    },
    getMatchTeacherData() {
      this.loading = true;
      if (this.groupDetailsInfo != undefined) {
        this.screenData.class_id = this.groupDetailsInfo.id;
      }
      this.languageList.toString();
      this.$Api.groupManagement
        .matchingTeacher(this.screenData.page, this.screenData.page_size, {
          classId: this.screenData.class_id,
          classTypeId: this.groupScale,
          fullWork: this.screenData.full_work,
          hideStatus: this.screenData.hide,
          startTime:
            this.screenData.start_times.length > 1
              ? this.screenData.start_times.join(",")
              : this.screenData.start_times[0],
          languageList: this.languageList ? this.languageList.toString() : null,
          teachingStyle: this.teachingStyle
            ? this.teachingStyle.toString()
            : null,
          ...this.userParams,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.matchTeacherData = res.data.data.list;
            this.count = res.data.data.total;
            this.matchTeacherData.forEach((e) => {
              if (e.teachStyleList) {
                e.teachStyles = e.teachStyleList
                  .map((v) => {
                    return v.configValue;
                  })
                  .join(",");
              }
              if (e.languageList) {
                e.languages = e.languageList
                  .map((v) => {
                    return v.configValue;
                  })
                  .join(",");
              }
            });
          }
        }).finally(()=>{
            this.loading = false;
        })
        ;
    },
    handleChangeCurrent(currentPage) {
      this.page = currentPage;
      this.screenData.page = currentPage;
      this.getMatchTeacherData(this.screenData);
    },
    getPerPage(perPage) {
      this.screenData.page_size = perPage;
      this.perPage = perPage;
      this.getMatchTeacherData(this.screenData);
    },
  },
};
</script>
<style lang="scss" scoped>
.c-conflict-wrap {
  .c-conflict-list {
    height: 160px;
    overflow: auto;
    .item {
      font-size: 14px;
      line-height: 1.5;
      color: #666;
    }
    .title {
      color: #444;
    }
  }
  .c-tips {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
