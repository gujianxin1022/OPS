<template>
  <div class="auditedTopMessage" v-if="pageData">
    <div>
      <p>
        {{ $t("提交老师") }}：
        <span v-once >{{ pageData.trealName || "-" }}</span>
      </p>
      <p>
        {{ $t("my-home-Student") }}：
        <span v-once>{{ pageData.realName || "-" }}</span>
      </p>
      <p>
        {{ $t("单元") }}：
        <span
        v-once
          >{{ pageData.courseEdition | mapEdtion }} level{{
            pageData.courseLevel
          }}
          Unit{{ pageData.unit }}</span
        >
      </p>
    </div>
    <div>
      <p>
        {{ $t("Teacher's telephone") }}：
        <span v-once>{{ pageData.phone || "-" }}</span>
      </p>
      <p>
        {{ $t("本单元起始日期") }}：
        <span
          >{{ DateTimeUtils.dateClockTime(pageData.firstStartTime) }} -
          {{ DateTimeUtils.dateClockTime(pageData.lastStartTime) }}</span
        >
      </p>
      <p>
        {{ $t("本单元结束时间") }}：
        <span>{{ DateTimeUtils.dateClockTime(pageData.lastStartTime) }}</span>
      </p>
    </div>
    <div>
      <p>
        {{ $t("my-home-Submission Time") }}：
        <span>{{ DateTimeUtils.dateClockTime(pageData.submitTime) }}</span>
      </p>
      <p>
        {{ $t("提交次数") }}：
        <span>{{ pageData.submitCount || "0" }}</span>
      </p>
      <p>
        {{ $t("common-Learning Advisor") }}：
        <span v-once>{{ pageData.xgUserName || "-" }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    pageData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageData: {},
    };
  },
  mounted() {},
  watch: {},
  methods: {},
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.auditedTopMessage {
  display: flex;
  font-size: 14px;
  display: flex;
  div {
    margin: 0 40px;
  }
}
</style>
