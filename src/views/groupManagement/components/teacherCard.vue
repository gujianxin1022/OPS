<template>
  <div class="teacher-card">
    <el-dialog
      title=""
      :with-header="false"
      :visible.sync="showTeacherCard"
      :before-close="closeCustomerDetailDialog"
      width="800px"
      top="5vh"
      append-to-body
    >
      <div class="customer-detail-content-wrap">
        <div class="title" v-if="tutorBaseInfo.tutorInfo">
          <div style="width: 120px; text-align: center">
            <el-avatar style="margin: 0 auto" :size="80" src="https://empty">
              <img :src="tutorBaseInfo.tutorInfo.avatar" />
            </el-avatar>
            <br />
            <el-rate
              style="display: inline; vertical-align: baseline"
              v-model="tutorBaseInfo.tutorInfo.rating"
              :allow-half="true"
              :disabled="true"
            >
            </el-rate>
          </div>
          <div class="customer-detail-info-content">
            <div style="line-height: 20px" class="ml10">
              <div
                class="mb5"
                style="text-align: left; font-size: 16px; color: #969696"
              >
                {{ $t("老师简介") }}
              </div>
              {{
                currentLang === "en"
                  ? tutorBaseInfo.tutorInfo.descriptionEn
                  : tutorBaseInfo.tutorInfo.descriptionZh || $t("暂无数据")
              }}
            </div>
          </div>
        </div>
        <div
          class="customer-detail-info-content"
          :style="customerStyle"
          v-loading="loading"
          v-if="tutorBaseInfo.tutorInfo"
        >
          <div class="base-info-wrap">
            <div class="base-info-wrap-header">
              <div class="base-info-wrap-header-color-div"></div>
              <div class="base-info-wrap-header-text-div">
                <span>
                  {{ $t("Basic information") }}
                </span>
              </div>
            </div>
            <div class="base-info-wrap-content">
              <ul>
                <li>
                  <span>{{ $t("教师") }}</span>
                  <router-link
                    target="_blank"
                    :to="{
                      path: `/tutorManagement/teacherInfo?id=${
                        tutorBaseInfo.tutorInfo.id
                      }&teacherName=${
                        tutorBaseInfo.tutorInfo.realName
                          ? tutorBaseInfo.tutorInfo.realName
                          : ''
                      }`,
                    }"
                  >
                    <el-button style="padding: 0px" type="text">{{
                      tutorBaseInfo.tutorInfo.realName
                    }}</el-button>
                  </router-link>
                </li>
                <li>
                  <span>{{ $t("学历") }}</span
                  >{{ tutorBaseInfo.highestDegreeDesc || "-" }}
                </li>
                <li>
                  <span>{{ $t("my-home-Teaching Experience") }}</span
                  >{{
                    Constants.teachAgoComputed(
                      tutorBaseInfo.tutorInfo.teachingStartTime
                    ) || "-"
                  }}
                </li>
                <li>
                  <span>{{ $t("教学风格") }}</span
                  >{{
                    tutorBaseInfo.styleNames
                      ? tutorBaseInfo.styleNames.join(";")
                      : "-"
                  }}
                </li>
                <li>
                  <span>{{ $t("语言") }}</span
                  >{{ languageConfigIdsLabel || "-" }}
                </li>
                <li
                  v-for="(item, idx) of threePieceInfo"
                  :key="idx"
                  :class="{ empty: !item.domesticLink && !item.overseasLink }"
                >
                  <span>{{ $t(item.label) }}</span>
                  <template v-if="!idx">
                    <el-image
                      v-if="item.domesticLink"
                      style="width: 100px; height: 100px"
                      fit="cover"
                      :src="item.domesticLink"
                      :preview-src-list="[item.domesticLink]"
                    />
                    <a v-else>{{ $t("点击查看") }}</a>
                  </template>
                  <template v-else>
                    <a :href="item.domesticLink" target="_blank">{{
                      $t("点击查看")
                    }}</a>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        {{ $t("复制链接") }}
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="item.domesticLink"
                          v-clipboard:copy="item.domesticLink"
                          v-clipboard:success="
                            () => handleCopySuccess(item, '中国区')
                          "
                        >
                          {{ $t("发送到中国区") }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="item.overseasLink"
                          v-clipboard:copy="item.overseasLink"
                          v-clipboard:success="
                            () => handleCopySuccess(item, '海外')
                          "
                        >
                          {{ $t("发送到海外") }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </li>
                <li>
                  <span>{{ $t("教学记录") }}</span>
                  <el-button
                    style="color: #409eff; font-size: 14px; padding: 0px"
                    @click="goToVideos"
                    type="text"
                    >{{ $t("点击查看") }}</el-button
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="student-info-wrap">
            <div class="base-info-wrap-header">
              <div class="base-info-wrap-header-color-div"></div>
              <div class="base-info-wrap-header-text-div">
                {{ $t("综合实力") }}
              </div>
            </div>
            <div class="radar"></div>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        style="border-top: 1px solid #ccc"
        center
        class="dialog-footer clearfix"
      >
        <div style="border-top: 1px solid #eee"></div>
        <div class="collect-warp">
          <span class="mr20" v-if="showCollect">
            <img
              v-if="collectStatus == 0"
              :src="shoucang"
              @click="switchCollect(true)"
              class="collect-icon"
              alt=""
            />
            <img
              v-if="collectStatus != 0"
              :src="yishoucang"
              @click="switchCollect(false)"
              class="collect-icon"
              alt=""
            />
            <el-button
              style="padding: 2px; vertical-align: baseline"
              @click="switchCollect(true)"
              v-if="collectStatus == 0"
              type="text"
              >{{ $t("收藏到用户") }}</el-button
            >
            <el-button
              @click="switchCollect(false)"
              style="padding: 2px"
              v-if="collectStatus != 0"
              st
              type="text"
              >{{ $t("取消用户收藏") }}</el-button
            >
          </span>
          <span class="mr20" v-if="showOPSCollect">
            <i
              style="font-size: 18px; vertical-align: baseline"
              v-if="!opsCollectStatus"
              class="el-icon-star-off"
            ></i>
            <i
              style="font-size: 22px; color: #ffd431; vertical-align: bottom"
              v-if="opsCollectStatus"
              class="el-icon-star-on"
            ></i>
            <el-button
              style="padding: 2px; vertical-align: baseline"
              @click="switchOPSCollect(true)"
              v-if="!opsCollectStatus"
              type="text"
              >{{ $t("收藏到我的") }}</el-button
            >
            <el-button
              @click="switchOPSCollect(false)"
              style="padding: 2px"
              v-if="opsCollectStatus"
              st
              type="text"
              >{{ $t("取消我的收藏") }}</el-button
            >
          </span>
          <span v-if="showBlacklist">
            <img
              v-if="!blackStatus"
              :src="jiaruhei"
              @click="switchBlackStatus(true)"
              class="collect-icon"
              alt=""
            />
            <img
              v-if="blackStatus"
              :src="yichuhei"
              @click="switchBlackStatus(false)"
              class="collect-icon"
              alt=""
            />
            <el-button
              style="padding: 2px; vertical-align: baseline"
              @click="switchBlackStatus(true)"
              v-if="!blackStatus"
              type="text"
              >{{ $t("加入我的黑名单") }}</el-button
            >
            <el-button
              @click="switchBlackStatus(false)"
              style="padding: 2px"
              v-if="blackStatus"
              st
              type="text"
              >{{ $t("移出我的黑名单") }}</el-button
            >
          </span>
        </div>
        <div class="btn-warp">
          <el-button
            v-if="showAppointmentBtn"
            @click="handleBook('bookOneClass')"
            type="primary"
            >{{ $t("单次约课") }}</el-button
          >
          <el-button
            v-if="showAppointmentBtn"
            @click="handleBook('bookMoreClass')"
            type="primary"
            >{{ $t("周期约课") }}</el-button
          >
          <el-button
            v-if="showRequestCourseBtn"
            @click="handleBook('requestClass')"
            type="primary"
            >{{ $t("单次求课") }}</el-button
          >
        </div>
      </span>
    </el-dialog>
    <el-drawer
      :visible.sync="showTeacherTimeTable"
      append-to-body
      direction="btt"
      :before-close="handleCloseTeacherTimeTable"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :destroy-on-close="true"
      :title="$t('确定约课信息')"
      :show-close="active !== 3"
      class="drawer-warp"
    >
      <el-tooltip
        class="el-icon-back-warp"
        effect="dark"
        :content="$t('返回上一步')"
        placement="left"
      >
        <i v-show="active === 3" @click="active = 2" class="el-icon-back"></i>
      </el-tooltip>
      <div style="height: 90vh" v-if="tutorBaseInfo.tutorInfo">
        <el-steps
          v-show="active !== 3"
          style="width: 600px; margin: 0 auto"
          :space="200"
          :active="active"
          finish-status="success"
          align-center
        >
          <el-step :title="$t('选择学生')"></el-step>
          <el-step :title="$t('选择课包')"></el-step>
          <el-step :title="$t('约课')"></el-step>
        </el-steps>
        <el-form
          v-show="active !== 3"
          style="width: 500px; margin: 0 auto"
          class="mt20"
          label-position="top"
          label-width="80px"
          :inline="true"
        >
          <el-form-item style="width: 500px" :label="$t('学生')">
            <FilterByStudent @change="onUserChange" />
          </el-form-item>
          <el-form-item
            v-show="active !== 0"
            style="width: 500px"
            :label="$t('课包')"
          >
            <el-select
              style="width: 100%"
              v-model="coursePackageID"
              filterable
              :placeholder="$t('请选择')"
              @change="handleChangePackage"
            >
              <el-option
                v-for="item in packageList"
                :key="item.packageId"
                :label="item.packageNameCommon"
                :value="item.packageId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="active === 2"
            style="width: 500px; text-align: right"
          >
            <el-button @click="active = 3" type="primary">{{
              $t("去约课")
            }}</el-button>
          </el-form-item>
        </el-form>
        <BookTeacherTime
          v-if="active === 3"
          class="teacher-table-warp"
          :teacherName="tutorBaseInfo.tutorInfo.realName"
          :teacherId="tutorBaseInfo.tutorInfo.id"
          :showTeacherTimetable="showTeacherTimetable"
          :coursePackageId="coursePackageID"
          @goBack="goBack"
          :student="student"
          @closeBookDialog="
            () => {
              handleCloseTeacherTimeTable();
              handleClose();
            }
          "
          :minStartTime="now"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  filedValueNameMap,
  transformArray,
} from "@/components/NewFilter/filterFiledNameMap";
import { mapGetters } from "vuex";
import echarts from "echarts";
import BookTeacherTime from "@/views/scheduleManagement/teacherTime/BookTeacherTime.vue";
import FilterByStudent from "@/components/FilterItem/UserDimensionFilter/FilterByStudent";
import {
  operationScheduleType,
  bookCourseTeacherInfo,
  bookCoursePackageInfo,
  bookParamsTimes,
} from "@/views/scheduleManagement/teacherTime/bookCurriculum";
const threePieceLabelMap = ["介绍海报", "介绍视频", "授课样例"];
const threePieceFieldMap = [
  {
    zh: "posterFileUrl",
    en: "posterExternalFileUrl",
  },
  {
    zh: "introduceFileUrl",
    en: "introduceExternalFileUrl",
  },
  {
    zh: "giveLessonsFileUrl",
    en: "giveLessonsExternalFileUrl",
  },
];
import shoucang from "@/assets/teacher/收藏.png";
import yishoucang from "@/assets/teacher/已收藏.png";
import jiaruhei from "@/assets/teacher/加入黑名单.png";
import yichuhei from "@/assets/teacher/移出黑名单.png";
import moment from "moment";

export default {
  props: {
    showTeacherCard: {
      type: Boolean,
      default: false,
    },
    realName: {
      type: String,
      default: "",
    },
    tutorId: {
      type: Number,
      default: "",
    },
    showCollect: {
      type: Boolean,
      default: false,
    },
    showOPSCollect: {
      type: Boolean,
      default: false,
    },
    showBlacklist: {
      type: Boolean,
      default: false,
    },
    showAppointmentBtn: {
      type: Boolean,
      default: false,
    },
    showRequestCourseBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      operationScheduleType,
      bookCourseTeacherInfo,
      bookCoursePackageInfo,
      active: 0,
      packageList: [],
      student: {},
      coursePackageID: null,
      now: moment(this.DateTimeUtils.getNextHalfHour().toISOString())
        .subtract(30, "minutes")
        .toISOString(),
      showTeacherTimeTable: false,
      filedValueNameMap,
      customerStyle: {
        height: `${window.innerHeight - 110 || 220}px`,
      },
      tutorBaseInfo: {},
      options: null,
      threePieceInfo: Array.from({ length: 3 }, (_, i) => ({
        label: threePieceLabelMap[i],
        domesticLink: null,
        overseasLink: null,
      })),
      shoucang,
      yishoucang,
      jiaruhei,
      yichuhei,
      collectStatus: "",
      opsCollectStatus: false,
      blackStatus: false,
      languageConfigIdsLabel: "",
      languageLabelMap: {},
      scheduleType: "",
      scheduleTypeMap: {
        bookOneClass: 1,
        bookMoreClass: 2,
        requestClass: 3,
      },
    };
  },
  async mounted() {
    if (this.tutorId && this.showTeacherCard) {
      await this.getLanguage();
      this.getRadarInfo(this.tutorId);
      this.getTutorBaseInfo(this.tutorId);
      this.getCollectStatus(this.tutorId);
    }
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    showTeacherCard() {
      if (this.tutorId && this.showTeacherCard) {
        this.getLanguage();
        this.getRadarInfo(this.tutorId);
        this.getTutorBaseInfo(this.tutorId);
        this.getCollectStatus(this.tutorId);
      }
    },
  },
  methods: {
    goBack() {
      bookParamsTimes.value = [];
      this.active = 2;
    },
    async handleBook(type) {
      this.scheduleType = type;
      await this.$Api.classManagement.reqBookFromTeacherCheckFirst({
        scheduleType: this.scheduleTypeMap[type],
        tutorId: this.tutorId,
      });
      operationScheduleType.value = type;
      this.showTeacherTimeTable = true;
    },
    async handleChangePackage(id) {
      let val;
      this.packageList.some((e) => {
        if (e.packageId === id) {
          val = e;
          return true;
        }
      });
      await this.$Api.classManagement.reqBookFromTeacherCheckSecond({
        scheduleType: this.scheduleTypeMap[this.scheduleType],
        tutorId: this.tutorId,
        planId: val.planId,
      });
      bookCoursePackageInfo.value = val;
      bookCoursePackageInfo.value.progressDescEN = val.packageNameCommon;
      bookCoursePackageInfo.value.progressDescZH = val.packageNameCommon;
      bookCoursePackageInfo.value.coursePackageId = val.packageId;
      bookCoursePackageInfo.value.duration = val.duration;
      this.active = 2;
    },
    onUserChange(val) {
      this.student = val;
      this.packageList = [];
      this.coursePackageID = "";
      this.packageList = val.packageList;
      this.active = 1;
    },
    handleCloseTeacherTimeTable() {
      this.showTeacherTimeTable = false;
      this.student = {};
      this.coursePackage = null;
      this.packageList = [];
      this.active = 0;
    },
    transformArray,
    async getLanguage() {
      const res = await this.$Api.tutorManagement.getExamineDic(5);
      if (res.status === 200 && res.data.code === 200) {
        this.languageLabelMap = this.transformArray(
          res.data.data.map((item) => ({
            label: item.typeKey,
            value: item.id,
          }))
        );
      }
    },
    async getTutorBaseInfo(tutorId) {
      this.tutorBaseInfo = {};
      this.loading = true;
      try {
        let res = await this.$Api.tutorManagement.getTeacherDetail({
          tutorUserId: tutorId,
        });
        this.tutorBaseInfo = res;
        threePieceFieldMap.forEach((v, i) => {
          this.threePieceInfo[i].domesticLink = res.tutorInfo[v.zh];
          this.threePieceInfo[i].overseasLink = res.tutorInfo[v.en];
        });
        this.languageConfigIdsLabel = "";
        if (res.languageConfigIds && res.languageConfigIds.length) {
          res.languageConfigIds.forEach((e) => {
            this.languageConfigIdsLabel +=
              this.$t(this.languageLabelMap[e]) + "；";
          });
        }
        this.opsCollectStatus = res.isFavoriteOpsUser;
        this.blackStatus = res.isBlackOpsUser;
        bookCourseTeacherInfo.value = res.tutorInfo;
      } catch {
        this.$notify({
          message: "获取教师信息失败",
          type: "error",
        });
      } finally {
        this.loading = false;
      }
    },
    getRadarInfo(tutorId) {
      this.options = null;
      this.$Api.tutorManagement.getRadarInfo(tutorId).then((res) => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            let indicatorArr = [],
              seriesValue = [];
            res.data.data.data?.forEach((item) => {
              indicatorArr.push({ name: item.label, max: 5 });
              seriesValue.push(item.score);
            });
            this.options = {
              tooltip: {},
              color: ["rgb(167, 56, 54)"],
              radar: {
                name: {
                  textStyle: {
                    color: "#666",
                    fontSize: 12,
                    padding: 0,
                  },
                },
                splitArea: {
                  show: false,
                },
                indicator: indicatorArr,
                radius: 70,
              },
              series: [
                {
                  name: "综合实力",
                  type: "radar",
                  data: [
                    {
                      value: seriesValue,
                      areaStyle: {
                        color: "rgb(188, 111, 110)",
                      },
                    },
                  ],
                },
              ],
            };
            let radar = echarts.init(document.querySelector(".radar"));
            radar.setOption(this.options, true);
          }
        }
      });
    },
    closeCustomerDetailDialog(closeAllDialog) {
      bookParamsTimes.value = [];
      this.$emit("closeTeacherCardDialog", closeAllDialog);
    },
    async getCollectStatus(tutorId) {
      if (!this.showCollect) return;
      let parentId = window.sessionStorage.getItem("parentUserId");
      this.collectStatus =
        await this.$Api.classManagement.reqIsParentFavoriteTeacher({
          parentUserId: parentId,
          tutorUserId: tutorId,
        });
    },
    goToVideos() {
      this.closeCustomerDetailDialog(false);
      const url = `/tutorManagement/teacherInfo?id=${this.tutorId}&realName=${
        this.realName || ""
      }&tabName=teachRecord`;
      window.open(url, "_blank");
    },
    handleCopySuccess(item, area) {
      this.$message.success(this.$t("复制成功"));
    },
    async switchCollect(isCollect) {
      const parentUserId = window.sessionStorage.getItem("parentUserId");
      const studentUserId = window.sessionStorage.getItem("student");
      const reqFn = isCollect
        ? this.$Api.classManagement.reqAddParentFavoriteTeacher
        : this.$Api.classManagement.reqCancelParentFavoriteTeacher;
      try {
        await reqFn({
          parentUserId,
          studentUserId,
          tutorUserId: this.tutorId,
        });
        this.collectStatus = isCollect ? 1 : 0;
        this.$notify({
          message: this.$t("操作成功"),
          type: "success",
        });
      } catch {
        this.$notify({
          message: this.$t("操作失败"),
          type: "error",
        });
      }
    },
    async switchOPSCollect(isCollect) {
      const reqFn = isCollect
        ? this.$Api.tutorManagement.reqAddOPSFavoriteTeacher
        : this.$Api.tutorManagement.reqCancelOPSFavoriteTeacher;
      try {
        await reqFn({
          tutorUserId: this.tutorId,
        });
        this.opsCollectStatus = isCollect;
        this.$notify({
          message: this.$t("操作成功"),
          type: "success",
        });
      } catch {
        this.$notify({
          message: this.$t("操作失败"),
          type: "error",
        });
      }
    },
    async switchBlackStatus(isAddBlack) {
      const reqFn = isAddBlack
        ? this.$Api.tutorManagement.reqAddOPSBlackListTeacher
        : this.$Api.tutorManagement.reqCancelOPSBlackListTeacher;
      try {
        await reqFn({
          tutorUserId: this.tutorId,
        });
        this.blackStatus = isAddBlack;
        this.$notify({
          message: this.$t("操作成功"),
          type: "success",
        });
      } catch {
        this.$notify({
          message: this.$t("操作失败"),
          type: "error",
        });
      }
    },
  },
  components: {
    BookTeacherTime,
    FilterByStudent,
  },
};
</script>

<style lang="scss" scoped>
.radar {
  height: 220px;
  padding-top: 20px;
}
.customer-detail {
  outline: none !important;
}
.icon {
  color: #666666;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
}
.customer-detail-content-wrap {
  width: 100%;
  height: 100%;
  img {
    width: 80px;
    height: 80px;
    right: 20px;
    border-radius: 40px;
  }
  .title {
    width: 100%;
    bottom: -14px;
    display: flex;
    align-items: center;
    ::v-deep .el-rate__icon {
      margin-right: 0;
    }
    .name {
      min-width: 110px;
      max-width: 110px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    span {
      color: #c4c4c5;
      font-weight: 600;
      margin-right: 10px;
    }
    .el-icon-arrow-right {
      margin-left: 10px;
    }
  }

  .customer-detail-info-content {
    width: 100%;
    border-radius: 6px;
    padding: 20px 0;
    padding-bottom: 10px;
    .base-info-wrap {
      width: 100%;
      .base-info-wrap-content {
        width: 100%;
        position: relative;
        margin-bottom: 16px;
        ul {
          padding-left: 0;
          li {
            font-size: 14px;
            span {
              display: inline-block;
              font-size: 14px;
              color: #666;
              width: 110px;
            }
          }
        }
        a {
          font-size: 14px;
          color: #409eff;
          margin-right: 16px;
        }
        .empty {
          a,
          .el-dropdown-link {
            pointer-events: none;
            color: #c0c4cc;
          }
        }
        .el-dropdown-link {
          cursor: pointer;
          color: #409eff;
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }
      }
    }
    .description-info-wrap-content {
      padding: 20px;
      text-indent: 28px;
      font-size: 14px;
      color: #666;
      line-height: 20px;
    }
  }

  .intro {
    margin-top: 10px;
  }
}
.base-info-wrap-header {
  width: 100%;
  display: flex;
  .base-info-wrap-header-color-div {
    width: 8px;
    height: 30px;
    background-color: #f90;
  }
  .base-info-wrap-header-text-div {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    margin-left: 10px;
    font-size: 14px;
    color: #000;
    position: relative;
  }
}
ul {
  flex: 1;
  list-style-type: none;
  align-items: center;
  padding-left: 21px !important;
}
li {
  display: flex;
  margin-bottom: 15px;
}
.student-info-wrap-content {
  > div {
    width: 100% !important;
    border-top: 1px solid #eee;
    margin-left: 20px;
    padding-top: 20px;
    ul {
      width: 50%;
      margin-top: 0;
      padding-left: 0 !important;
    }
  }
}
.label {
  font-size: 12px;
  width: 70px;
  display: inline-block;
  color: #8f8f8f;
  flex: 1;
  white-space: nowrap;
}
.value {
  font-size: 12px;
  width: 50px;
  display: inline-block;
  flex: 1;
  white-space: nowrap;
  padding: 0;
  text-align: left;
}
.el-dropdown-menu {
  padding-left: 0 !important;
  .el-dropdown-menu__item {
    margin-bottom: 0;
  }
}
.collect-warp {
  width: 50%;
  float: left;
  text-align: left;
  padding-top: 20px;
  .collect-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    vertical-align: middle;
  }
}
.btn-warp {
  float: right;
  width: 50%;
  padding-top: 15px;
}
.drawer-warp {
  .el-icon-back-warp {
    position: absolute;
    top: 22px;
    right: 25px;
    cursor: pointer;
    font-size: 20px;
    color: #72767b;
    font-weight: 600;
  }
}
</style>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 80vh;
  overflow: auto;
  padding-top: 0px;
}
</style>

<style>
.el-drawer__header {
  margin-bottom: 0px !important;
}
</style>
