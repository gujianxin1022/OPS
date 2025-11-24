<template>
  <el-dialog
    :title="$t('新建排课')"
    :show-close="true"
    :visible.sync="show"
    :before-close="close"
    custom-class="m-create-class m-footer-btm"
    width="700px"
    append-to-body
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item :label="$t('排课方式')">
          <el-radio-group v-model="form.style">
            <el-radio :label="1">{{ $t("单次排课") }}</el-radio>
            <el-radio :label="2">{{ $t("按天重复排课") }}</el-radio>
            <el-radio :label="3">{{ $t("按周重复排课") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 单次排课 start -->
        <div class="m-classtime-wrap" v-show="form.style == 1">
          <el-form-item :label="$t('开课日期')">
            <el-date-picker
              v-model="form.startDateTime"
              type="date"
              :picker-options="pickerOptions"
              :placeholder="$t('选择日期')"
            >
            </el-date-picker>
          </el-form-item>
          <div class="clear-fix">
            <span class="c-custom-label">{{ $t("上课时间") }}</span>
            <div class="left">
              <div class="mb10">
                <el-select
                  v-model="startClassTimeIndex"
                  :placeholder="$t('选择时间段')"
                >
                  <el-option
                    v-for="(item, index) in Constants.startClassTimeData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-select
                  v-model="form.startClassTime"
                  :picker-options="startClassTimeObj"
                  :placeholder="$t('选择日期')"
                >
                </el-time-select>
              </div>
            </div>
          </div>
        </div>
        <!-- 单次排课 end -->
        <!-- 按天排课start -->
        <div class="clear-fix" v-show="form.style == 2">
          <div class="clear-fix">
            <span class="c-custom-label">{{ $t("上课时间") }}</span>
            <div class="left mb10">
              <div>
                <el-select
                  v-model="startClassTimeIndex"
                  :placeholder="$t('选择时间段')"
                >
                  <el-option
                    v-for="(item, index) in Constants.startClassTimeData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-select
                  v-model="form.startClassTime"
                  :picker-options="startClassTimeObj"
                  :placeholder="$t('选择日期')"
                >
                </el-time-select>
              </div>
            </div>
          </div>
          <el-form-item :label="$t('开课日期')">
            <el-date-picker
              v-model="form.startDateTime"
              type="date"
              :picker-options="pickerOptions"
              :placeholder="$t('选择日期')"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- 按天排课end -->
        <!-- 按周排课 start -->
        <div class="m-classtime-wrap" v-show="form.style == 3">
          <div class="clear-fix">
            <span class="c-custom-label">{{ $t("上课时间") }}</span>
            <div class="left">
              <div
                class="mb10"
                v-for="(item, index) in weekStartClassTime"
                :key="index"
              >
                <el-select
                  v-model="item.week"
                  :placeholder="$t('请选择周几')"
                  style="width: 100px"
                >
                  <el-option :label="$t('周一')" :value="1"></el-option>
                  <el-option :label="$t('周二')" :value="2"></el-option>
                  <el-option :label="$t('周三')" :value="3"></el-option>
                  <el-option :label="$t('周四')" :value="4"></el-option>
                  <el-option :label="$t('周五')" :value="5"></el-option>
                  <el-option :label="$t('周六')" :value="6"></el-option>
                  <el-option :label="$t('周日')" :value="0"></el-option>
                </el-select>
                <el-select
                  v-model="item.timeInd"
                  :placeholder="$t('选择时间段')"
                  style="width: 150px"
                >
                  <el-option
                    v-for="(ite, i) in Constants.startClassTimeData"
                    :key="i"
                    :label="ite.label"
                    :value="ite.value"
                  ></el-option>
                </el-select>
                <el-time-select
                  style="width: 150px"
                  v-model="item.time"
                  :picker-options="Constants.startClassTimeOfData[item.timeInd]"
                  :placeholder="$t('选择时间')"
                >
                </el-time-select>
                <div class="add" @click="addWeekTime(item, index)">
                  <i class="el-icon-circle-plus-outline"></i>
                </div>
                <div
                  v-if="index"
                  class="add"
                  @click="reduceWeekTime(item, index)"
                >
                  <i class="el-icon-remove-outline"></i>
                </div>
              </div>
            </div>
          </div>
          <el-form-item :label="$t('开课日期')">
            <el-date-picker
              v-model="form.startDateTime"
              :picker-options="pickerOptions"
              type="date"
              :placeholder="$t('选择日期')"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- 按周排课 end -->
        <div v-show="form.style != 1">
          <el-form-item :label="$t('结束方式')">
            <el-radio-group v-model="form.method">
              <el-radio :label="1">{{ $t("按课节总数") }}</el-radio>
              <el-radio :label="2">{{ $t("按日期结束") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="form-one-line" v-show="form.method == 1">
            <el-form-item :label="$t('课节总数')" class="total">
              <el-input class="w200" v-model="form.classSum"></el-input>
            </el-form-item>
            <el-link
              class="ml10"
              type="primary"
              v-show="hideButton"
              @click="showPreviewList"
              >{{ $t("预排课") }}</el-link
            >
            <el-link
              class="ml10"
              type="primary"
              v-show="hideButton"
              @click="showMatchTeacherList"
              >{{ $t("匹配老师") }}</el-link
            >
          </div>
          <div class="form-one-line" v-show="form.method == 2">
            <el-form-item :label="$t('结束日期')">
              <el-date-picker
                v-model="form.endDateTime"
                type="date"
                :picker-options="pickerOptions"
                :placeholder="$t('选择日期')"
              >
              </el-date-picker>
              <el-link
                class="ml10"
                type="primary"
                v-show="hideButton"
                @click="showPreviewList"
                >{{ $t("预排课") }}</el-link
              >
              <el-link
                class="ml10"
                type="primary"
                v-show="hideButton"
                @click="showMatchTeacherList"
                >{{ $t("匹配老师") }}</el-link
              >
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer tc">
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">{{
          $t("新建")
        }}</el-button>
      </div>
      <PreviewsetList
        @close="showPreview = false"
        :show="showPreview"
      ></PreviewsetList>
      <MatchTeacher
        @close="showMatchTeacher = false"
        :show="showMatchTeacher"
        :matchTeacherTime="matchTeacherTime"
      ></MatchTeacher>
    </div>
  </el-dialog>
</template>
<script>
import PreviewsetList from "./previewsetList.vue";
import MatchTeacher from "./matchTeacher.vue";
import { ABNORMAL_CODE } from "@/utils/constants";
export default {
  components: {
    PreviewsetList,
    MatchTeacher,
  },
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    groupDetailsInfo: {
      type: Object,
      default: () => {},
    },
    hideButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: {
        name: 1,
        style: 1,
        method: 1,
        startDateTime: "",
        startClassTime: "",
        endDateTime: "",
        classSum: "",
      },
      loading: false,
      startTimes: [],
      startClassTimeIndex: "",
      startClassTimeObj: "",
      matchTeacherTime: [],
      showPreview: false,
      showMatchTeacher: false,
      weekStartClassTime: [
        {
          week: "",
          timeInd: "",
          time: "",
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  computed: {
    style() {
      return this.form.style;
    },
  },
  watch: {
    startClassTimeIndex(newData, oldData) {
      this.startClassTimeObj = this.Constants.startClassTimeOfData[newData];
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    addWeekTime(item, index) {
      this.weekStartClassTime.push({
        week: "",
        timeInd: "",
        time: "",
      });
    },
    reduceWeekTime(item, index) {
      this.weekStartClassTime.splice(index, 1);
    },
    onSubmit() {
      this.loading = true;
      if (this.setClassData() === false) {
        this.loading = false;
        return;
      }
      this.setClassData();
      let start_times = [];
      this.startTimes.forEach((item) => {
        start_times.push(new Date(item).toISOString());
      });
      if (this.groupDetailsInfo.classTypeId == 2) {
        this.$Api.groupManagement
          .addSmallClassTimeTable({
            classId: this.groupDetailsInfo.id,
            startTimeList: start_times,
          })
          .then((res) => {
            if (
              res.data.code === ABNORMAL_CODE.releaseOrAppointmentTimeConflict
            ) {
              this.$notify({
                message: this.$t("发布或者约课时间有冲突"),
                type: "error",
              });
            }
            if (res.data.code == 200) {
              this.$notify({
                message: this.$t("新建排课成功"),
                type: "success",
              });
              this.close();
              this.$emit("getGroupTimetable");
              this.$emit("getGroupInfo");
            }
            this.loading = false;
          });
      } else {
        this.$Api.groupManagement
          .addBigClassTimeTable({
            classId: this.groupDetailsInfo.id,
            startTimeList: start_times,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$notify({
                message: this.$t("新建排课成功"),
                type: "success",
              });
              this.close();
              this.$emit("getGroupTimetable");
              this.$emit("getGroupInfo");
            }
            this.loading = false;
          });
      }
    },
    showPreviewList() {
      this.showPreview = true;
    },
    showMatchTeacherList() {
      this.showMatchTeacher = true;
    },
    close() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("close");
    },
    getAndSetDate(date, time) {
      if (date instanceof Date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        let fdate = year + "/" + month + "/" + day,
          h = time.split(":")[0] * 1,
          m = time.split(":")[1] * 1;
        let rdate = `${fdate} ${h}:${m}`;
        return new Date(rdate).toISOString();
      } else {
        return "";
      }
    },
    setClassData() {
      this.startTimes = [];
      let { name, style, method, startDateTime, endDateTime, classSum } =
        this.form;
      if (style == 1) {
        /**单次排课的提交方法 */
        if (
          !this.getAndSetDate(this.form.startDateTime, this.form.startClassTime)
        ) {
          this.$notify({
            message: this.$t("上课时间未填写"),
            type: "error",
          });
          return false;
        }
        let date = this.getAndSetDate(
          this.form.startDateTime,
          this.form.startClassTime
        );
        this.startTimes.push(date);
      } else if (style == 2) {
        let date = this.getAndSetDate(
          this.form.startDateTime,
          this.form.startClassTime
        );
        if (method == 1) {
          if (!classSum) {
            this.$notify({
              message: this.$t("课节总数未填写"),
              type: "error",
            });
            return;
          }
          // 循环课节总数，推算时间 push 到数组里传给后台
          for (var i = 0; i < classSum * 1; i++) {
            this.startTimes.push(this.DateTimeUtils.getDateStr(date, i));
          }
        } else if (method == 2) {
          if (!endDateTime) {
            this.$notify({
              message: this.$t("结束日期未选择"),
              type: "error",
            });
            return;
          }
          // 按结束日期推算 开始 - 结束 共计几天，循环push
          let DifferenceValue = endDateTime.getTime() - startDateTime.getTime();
          let days = Math.floor(DifferenceValue / (24 * 3600 * 1000));
          for (var i = 0; i <= days; i++) {
            this.startTimes.push(this.DateTimeUtils.getDateStr(date, i));
          }
        }
      } else if (style == 3) {
      
        if (method == 1) {
          if (!classSum) {
            this.$notify({
              message: this.$t("课节总数未填写"),
              type: "error",
            });
            return;
          }
          let weekArr = [];
          this.weekStartClassTime.forEach((item) => {
            weekArr.push({
              week: item.week,
              time: item.time,
            });
          });
          var i = 0;
          while (this.startTimes.length < classSum * 1) {
            let day = new Date(
              this.DateTimeUtils.getDateStr(this.form.startDateTime, i)
            );
            let flag = weekArr.filter((item) => item.week == day.getDay());
            if (flag.length != 0) {
              flag.forEach((ite) => {
                if (this.startTimes.length < classSum * 1) {
                  this.startTimes.push(this.getAndSetDate(day, ite.time));
                }
              });
            } else {
            }
            i++;
          }
        } else if (method == 2) {
          if (!endDateTime) {
            this.$notify({
              message: this.$t("结束日期未选择"),
              type: "error",
            });
            return;
          }
          let DifferenceValue = endDateTime.getTime() - startDateTime.getTime();
          let days = Math.floor(DifferenceValue / (24 * 3600 * 1000));
          let weekArr = [];
          this.weekStartClassTime.forEach((item) => {
            weekArr.push({
              week: item.week,
              time: item.time,
            });
          });

          for (var i = 0; i <= days; i++) {
            let day = new Date(
              this.DateTimeUtils.getDateStr(this.form.startDateTime, i)
            );
            let flag = weekArr.filter((item) => item.week == day.getDay());
            if (flag.length != 0) {
              flag.forEach((ite) => {
                this.startTimes.push(this.getAndSetDate(day, ite.time));
              });
            } else {
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
.m-classtime-wrap {
  .add {
    display: inline-block;
  }
}
.el-form-item.total {
  width: 400px !important;
  .el-form-item__label {
    width: 200px !important;
  }
}
</style>
