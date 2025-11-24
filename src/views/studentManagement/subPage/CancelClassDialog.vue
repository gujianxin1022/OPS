<template>
  <div class="cancel-class-wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :visible.sync="show"
      :before-close="close"
      :width="currentLang === 'en' ? '610px' : '610px'"
      append-to-body
      center
    >
      <div
        slot="title"
        style="text-align: left; color: #303133; font-size: 18px"
      >
        <span> {{ $t("取消课程") }} - {{ $route.query.studentName }} </span>
      </div>
      <div class="dialog-content-wrap">
        <el-tabs stretch v-model="activeName">
          <el-tab-pane :label="$t('取消单次')" name="cancelSingel">
            <div class="cancelSingel">
              <p>{{ $t("上课老师") }}：{{ cancelInfo.tutorRealName }}</p>
              <p>
                {{ $t("上课时间") }}：{{
                  DateTimeUtils.dateClockTime(cancelInfo.startTime)
                }}
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('取消多次')" name="cancelMore">
            <div class="cancelMore">
              <div class="block">
                <div>
                  <span>{{ $t("开始日期") }}：</span>
                  <el-date-picker
                    v-model="startTimes"
                    disabled
                    size="small"
                    class="w150"
                    type="date"
                    :placeholder="$t('选择日期')"
                  ></el-date-picker>
                </div>
                <div>
                  <span>{{ $t("结束日期") }}：</span>
                  <el-date-picker
                    :picker-options="pickerOptions"
                    v-model="endTimes"
                    type="date"
                    class="w150"
                    :placeholder="$t('选择日期')"
                  ></el-date-picker>
                </div>
              </div>
              <p>{{ $t("上课老师") }}：{{ cancelInfo.tutorRealName }}</p>
              <p>
                {{ $t("上课时间") }}：{{
                  $t(moment(cancelInfo.startTime).format("dddd"))
                }}
                {{ $t(moment(cancelInfo.startTime).format("HH:mm")) }}
              </p>
              <p>
                {{ $t("该课包最后一节课时间为") }}：<span
                  style="color: #f56c6c"
                  >{{ $t(moment(lastStartTime).format("yyyy-MM-DD")) }}</span
                >
              </p>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="padding: 20px 0 0 50px">
          <span>{{ $t("取消原因") }}：</span>
          <el-radio-group
            style="display: inline-block; vertical-align: top"
            v-model="cancelReasonType"
          >
            <div
              style="margin-bottom: 10px"
              v-for="item in cancelReasonList"
              :key="item.id"
            >
              <el-radio :label="item.id">{{
                currentLang === "en" ? item.en : item.zh
              }}</el-radio>
            </div>
          </el-radio-group>
          <el-input
            v-if="cancelReasonType == 100"
            v-model.trim="cancelReasonDesc"
            :placeholder="$t('请填写原因')"
            maxlength="100"
            rows="4"
            resize="none"
            show-word-limit
            style="padding-left: 73px"
            type="textarea"
          ></el-input>
        </div>
        <el-alert
          class="mt5"
          v-show="hasDst === 1 && activeName === 'cancelMore'"
          :closable="false"
          :title="
            $t(
              '注意：该时区有令时变化，批量取消时请注意查看令时和非令时期间的课程时间变化'
            )
          "
          type="error"
        >
        </el-alert>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t("关闭") }}</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="sureCancel"
          :disabled="
            !cancelReasonType ||
            (cancelReasonType === 100 && cancelReasonDesc.length <= 0)
          "
          >{{ $t("取消课程") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import eventName from "@/utils/event_name";
import moment from "moment";
import { logEvent } from "@/utils/analyticsNew";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    cancelInfo: {
      type: Object,
      default: () => {},
    },
    startTimes: {
      type: Date,
      default: new Date(),
    },
    isUserTimes: {
      type: Boolean,
      default: () => {},
    },
  },
  data() {
    return {
      cancelReasonList: [],
      cancelReasonType: null,
      cancelReasonDesc: "",
      activeName: "cancelSingel",
      endTimes: null,
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      cancelType: "0", // 0取消单次1取消多次
      lastStartTime: "",
    };
  },
  computed: {
    ...mapState({
      studentLoginTz: (state) => state.user.studentLoginTz,
      hasDst: (state) => state.user.hasDst,
    }),
    ...mapGetters(["currentLang"]),
  },
  watch: {
    cancelReasonType(newVal) {
      this.cancelReasonDesc =
        newVal && newVal !== 100
          ? this.cancelReasonList.find((item) => item.id === newVal).zh
          : "";
    },
  },
  mounted() {
    this.reqCancelReason();
    this.reqPackageLastTime();
  },
  methods: {
    moment,
    async reqPackageLastTime() {
      const res = await this.$Api.classManagement.reqPackageLastStartTime({
        coursePackageId: this.cancelInfo.coursePackageId,
        studentUserId: this.$route.query.studentId,
      });
      this.lastStartTime = res || null;
    },
    async reqCancelReason() {
      const {
        status,
        data: { code, data },
      } = await this.$Api.studentManagement.reqCancelReason();
      if (status !== 200 || code !== 200) return Promise.reject();
      this.cancelReasonList = data || [];
    },
    close() {
      (this.cancelReasonType = null),
        (this.cancelReasonDesc = ""),
        this.$emit("closeCancelClassDialog");
    },
    sureCancel() {
      this.loading = true;
      if (this.activeName == "cancelSingel") {
        // 取消一节课
        let { startTimeUTC } = this.cancelInfo;
        //判断如果当前选择的是学生的时区
        if (this.isUserTimes && this.studentLoginTz) {
          let str = this.studentLoginTz.split(" ");
          let f = str[1][0]; // 运算符
          let num = Number(str[1].slice(1).split("0").join(""));
          startTimeUTC = this.DateTimeUtils.appointTimes(startTimeUTC, f, num); //时间 运算符 小时
        }
        let params = {
          opsRole: this.ApiConstants.opsTeacherAppointCode,
          startTime: startTimeUTC,
          startTimeFinal: startTimeUTC,
          studentUserId:
            this.$route.query.studentId ||
            window.sessionStorage.getItem("student"),
          tutorUserId: this.cancelInfo.tutorUserId,
          coursePackageId: this.cancelInfo.coursePackageId,
          cancelReasonType: this.cancelReasonType,
          cancelReasonDesc: this.cancelReasonDesc,
        };
        this.$Api.studentManagement
          .cancelClass(params)
          .then((res) => {
            if (res.status == 200 && res.data.code == 200) {
              this.$notify({
                message: "取消成功",
                type: "success",
              });
              logEvent("submit_cancel_one_class", "提交取消单节课程", {
                studentUserId: this.$route.query.studentId,
              });
              this.$emit("resetCalender");
              this.close();
            }
            this.loading = false;
          })
          .finally((_) => {
            this.loading = false;
          });
      } else {
        // 取消多节课
        let startTimeUTC = new Date(this.cancelInfo.startTimeUTC);
        let endTimes = this.endTimes;
        // 多次取消课的结束时间
        // let endTime = new Date(this.endTimes)
        // endTime.setDate(endTime.getDate() * 1 + 1)
        // endTime.setMinutes(0)
        // endTime.setSeconds(0)
        // endTime.setMilliseconds(0)
        //判断如果当前选择的是学生的时区
        if (this.isUserTimes && this.studentLoginTz) {
          let str = this.studentLoginTz.split(" ");
          let f = str[1][0]; // 运算符
          let num = Number(str[1].slice(1).split("0").join(""));
          startTimeUTC = new Date(
            this.DateTimeUtils.appointTimes(startTimeUTC.toISOString(), f, num)
          ); //时间 运算符 小时
          endTimes = new Date(
            this.DateTimeUtils.appointTimes(endTimes.toISOString(), f, num)
          );
        }
        // TODO:需要验证开始时间是周日结束时间对不对
        if (startTimeUTC.getDay() !== endTimes.getDay()) {
          // 开始星期非零
          if (startTimeUTC.getDay() > 0) {
            // 结束时间非零
            if (endTimes.getDay() > 0) {
              if (endTimes.getDay() > startTimeUTC.getDay()) {
                endTimes = new Date(
                  new Date(
                    new Date(
                      endTimes.getTime() -
                        (endTimes.getDay() - startTimeUTC.getDay()) *
                          24 *
                          60 *
                          60 *
                          1000
                    ).setHours(startTimeUTC.getHours())
                  ).setMinutes(startTimeUTC.getMinutes())
                );
              } else {
                endTimes = new Date(
                  new Date(
                    new Date(
                      endTimes.getTime() -
                        (6 - startTimeUTC.getDay() + endTimes.getDay()) *
                          24 *
                          60 *
                          60 *
                          1000
                    ).setHours(startTimeUTC.getHours())
                  ).setMinutes(startTimeUTC.getMinutes())
                );
              }
              endTimes = new Date(
                new Date(
                  new Date(
                    endTimes.getTime() +
                      (startTimeUTC.getDay() - endTimes.getDay()) *
                        24 *
                        60 *
                        60 *
                        1000
                  ).setHours(startTimeUTC.getHours())
                ).setMinutes(startTimeUTC.getMinutes())
              );
            } else {
              endTimes = new Date(
                new Date(
                  new Date(
                    endTimes.getTime() -
                      (7 - startTimeUTC.getDay()) * 24 * 60 * 60 * 1000
                  ).setHours(startTimeUTC.getHours())
                ).setMinutes(startTimeUTC.getMinutes())
              );
            }
            // 开始星期为0
          } else {
            endTimes = new Date(
              new Date(
                new Date(
                  endTimes.getTime() - endTimes.getDay() * 24 * 60 * 60 * 1000
                ).setHours(startTimeUTC.getHours())
              ).setMinutes(startTimeUTC.getMinutes())
            );
          }
        } else {
          endTimes = new Date(
            new Date(endTimes.setHours(startTimeUTC.getHours())).setMinutes(
              startTimeUTC.getMinutes()
            )
          );
        }
        let params = {
          opsRole: this.ApiConstants.opsTeacherAppointCode,
          startTime: startTimeUTC.toISOString(),
          startTimeFinal: endTimes.toISOString(),
          studentUserId:
            this.$route.query.studentId ||
            window.sessionStorage.getItem("student"),
          tutorUserId: this.cancelInfo.tutorUserId,
          coursePackageId: this.cancelInfo.coursePackageId,
          cancelReasonType: this.cancelReasonType,
          cancelReasonDesc: this.cancelReasonDesc,
        };
        this.$Api.studentManagement
          .cancelClass(params)
          .then((res) => {
            if (res.status == 200 && res.data.code == 200) {
              this.$notify({
                message: "取消成功",
                type: "success",
              });
              logEvent("submit_cancel_more_class", "提交取消多节课程", {
                studentUserId: this.$route.query.studentId,
              });
              this.$emit("resetCalender");
              this.close();
            }
            this.loading = false;
          })
          .finally((_) => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cancelSingel,
.cancelMore {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 30px;
  p {
    padding-left: 50px;
    margin: 0;
    margin-top: 20px;
  }
}
.block {
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  div {
    margin: 5px 0;
  }
}
</style>
