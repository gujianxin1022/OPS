<template>
  <div class="gt-detail-wrap" v-loading="loading">
    <el-button
      v-if="groupTypeInfo && groupTypeInfo.status == 0"
      @click="stopGroupType"
      class="stopBtn"
      >{{ $t("停用班型") }}</el-button
    >
    <ul v-if="groupTypeInfo">
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班型中文名称")
        }}</span>
        <span class="value">{{ groupTypeInfo.classtypeNameZh }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班型英文名称")
        }}</span>
        <span class="value">{{ groupTypeInfo.classtypeNameEn }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("负责团队")
        }}</span>
        <span class="value">{{
          Filters.teamFilter(groupTypeInfo.team, currentLang === "en")
        }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班型类型")
        }}</span>
        <span class="value">{{ groupTypeInfo.type | groupTypeFilter }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 1">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班型课程")
        }}</span>
        <span class="value">{{
          currentLang === "en"
            ? groupTypeInfo.lessonDescEN
            : groupTypeInfo.lessonDescZH
        }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 2">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班型首课")
        }}</span>
        <span class="value">{{
          currentLang === "en"
            ? groupTypeInfo.lessonDescEN
            : groupTypeInfo.lessonDescZH
        }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 2">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("发车日期")
        }}</span>
        <span class="value">{{
          DateTimeUtils.dateClockTime(groupTypeInfo.classStartTime)
        }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 2">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("上课周期")
        }}</span>
        <span class="value">{{
          Filters.normalWeekListMap(
            groupTypeInfo.weekList,
            currentLang === "en"
          )
        }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 2">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班型课节总数")
        }}</span>
        <span class="value">{{ groupTypeInfo.lessonNum }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 1">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("开课周期")
        }}</span>
        <span class="value">{{
          Filters.tryWeekListMap(groupTypeInfo.weekList).split(" ")[0]
        }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 1">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("上课时间")
        }}</span>
        <span class="value">{{ groupTypeInfo.weekList[0].time }}</span>
      </li>
      <li v-if="groupTypeInfo.type == 1">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("有效日期")
        }}</span>
        <span class="value"
          >{{ DateTimeUtils.dateClockTime(groupTypeInfo.applyStartTime) }} -
          {{ DateTimeUtils.dateClockTime(groupTypeInfo.applyEndTime) }}</span
        >
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班级容量")
        }}</span>
        <span class="value">{{ groupTypeInfo.userMax }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("成班人数")
        }}</span>
        <span class="value">{{ groupTypeInfo.userMin }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("语言标签")
        }}</span>
        <span class="value">{{
          groupTypeInfo.languageLabel | languageLabelFilter
        }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("年龄标签")
        }}</span>
        <span class="value">{{ groupTypeInfo.ageLabel | ageLabelFilter }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班型状态")
        }}</span>
        <span class="value">{{
          groupTypeInfo.status | groupTypeStatusFilter
        }}</span>
      </li>
      <!-- 正式班型展示 -->
      <li v-if="groupTypeInfo.type == 2">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("是否自动续排")
        }}</span>
        <span class="value">{{
          groupTypeInfo.isRenew == 1 ? $t("是") : $t("否")
        }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("创建人")
        }}</span>
        <span class="value">{{ groupTypeInfo.createUser }}</span>
      </li>
      <li>
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("创建时间")
        }}</span>
        <span class="value">{{
          DateTimeUtils.dateClockTime(groupTypeInfo.createTime)
        }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "groupTypeDetail",
  data() {
    return {
      groupTypeInfo: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    groupTypeId() {
      return this.$route.query.groupTypeId;
    },
  },
  methods: {
    stopGroupType() {
      this.$confirm(
        this.$t("此操作将停用当前班型, 是否继续?"),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("继续"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      )
        .then(() => {
          if (this.groupTypeInfo.type == 1) {
            // 停用试听
            this.$Api.groupManagement
              .stopTryStopClassType(this.groupTypeId)
              .then(({ status, data }) => {
                if (status == 200 && data.code == 200) {
                  this.getGroupInfo();
                  this.$notify({
                    message: this.$t("停用成功"),
                    type: "success",
                  });
                }
              });
          } else if (this.groupTypeInfo.type == 2) {
            // 停用正式
            this.$Api.groupManagement
              .stopNormalStopClassType(this.groupTypeId)
              .then(({ status, data }) => {
                if (status == 200 && data.code == 200) {
                  this.getGroupInfo();
                  this.$notify({
                    message: this.$t("停用成功"),
                    type: "success",
                  });
                }
              });
          }
        })
        .catch(() => {});
    },
    getGroupInfo() {
      this.loading = true;
      this.$Api.groupManagement
        .getClassTypeDetails(this.groupTypeId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.groupTypeInfo = data.data;
          }
          this.loading = false;
        });
    },
  },
  created() {
    this.getGroupInfo();
  },
};
</script>
<style lang="scss" scoped>
.gt-detail-wrap {
  width: 100%;
  padding: 4px;
  height: 100%;
  position: relative;
  .stopBtn {
    position: absolute;
    top: 4px;
    right: 4px;
  }
  ul {
    list-style: none;
    font-size: 14px;
    li {
      line-height: 33px;
      .label {
        display: inline-block;
        text-align: right;
        width: 85px;
      }
      .en-label {
        display: inline-block;
        text-align: right;
        width: 230px;
      }
      .value {
        color: #666666;
        margin-left: 15px;
      }
    }
  }
}
</style>
