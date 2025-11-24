<template>
  <div class="book-one-warp">
    <div class="title">{{ $t("调课") }}</div>
    <br />
    <el-form
      v-loading="loading"
      ref="myForm"
      :model="formState"
      :rules="rule"
      label-width="100px"
    >
      <el-form-item :label="$t('教师')">
        {{ teacherName }}
      </el-form-item>
      <el-form-item :label="$t('学生')">
        {{ $route.query.studentName }}
      </el-form-item>
      <el-form-item :label="$t('课包')">
        {{ isEn ? bookCoursePackageInfo.nameEn : bookCoursePackageInfo.nameZh }}
      </el-form-item>
      <el-form-item :label="$t('学生时区')">
        {{ filterZoneName(userTimeZone, isEn) }}
      </el-form-item>
      <br />
      <br />
      <el-form-item :label="$t('原课堂时间')">
        {{ DateTimeUtils.dateClockTime(rowData.startTime) }}
      </el-form-item>
      <el-form-item prop="startTime" :label="$t('调课时间')">
        <BookTimePanel
          ref="bookTimePanel"
          @onSelectDateTime="onSelectDateTime"
          :minStartTime="minStartTime"
        ></BookTimePanel>
      </el-form-item>
      <el-form-item v-if="formState.startTime" prop="startTime" :label="$t('用户时间')">
        {{ toUserTimeZoneTime(userTimeZone, formState.startTime) }}
      </el-form-item>
      <el-form-item prop="reasonType" :label="$t('调课原因')">
        <el-radio-group v-model="formState.reasonType">
          <div class="mt10" v-for="item in reasonList" :key="item.reason">
            <el-radio :label="item.reason">{{ item.desc }}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formState.reasonType === 1099"
        prop="reasonDesc"
        :label="$t('描述')"
      >
        <el-input
          class="mt10"
          type="textarea"
          :rows="2"
          :placeholder="$t('请输入')"
          v-model="formState.reasonDesc"
          maxlength="150"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="bottom-btn-wrap">
          <el-button :loading="loading" @click="goBack" style="width: 100px">{{
            $t("返回")
          }}</el-button>
          <el-button
            :loading="loading"
            style="width: 100px"
            type="primary"
            @click="onSubmit"
            >{{ $t("确认") }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  ref,
  computed,
  onMounted,
  reactive,
  toRefs,
} from "@vue/composition-api";
import { bookCourseTeacherInfo, bookCoursePackageInfo } from "./bookCurriculum";
import { filterZoneName, toUserTimeZoneTime } from "@/utils/timeZone";
import BookTimePanel from "@/views/scheduleManagement/BookTimePanel.vue";
import { logEvent } from "@/utils/analyticsNew";
import moment from "moment";

export default {
  props: {
    teacherName: {
      type: String,
      default: "",
    },
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  components: { BookTimePanel },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const goBack = () => {
      emit("goBack");
    };
    const reasonList = ref([]);
    const reasonType = ref(-1);
    const getReason = async () => {
      reasonList.value =
        (await root.$Api.classManagement.reqOtoAdjustReason()) || [];
    };
    const formState = reactive({
      startTime: null,
      studentTimetableId: props.rowData.timetableId,
      reasonType: "",
      reasonDesc: "",
    });
    const onSelectDateTime = (date) => {
      formState.startTime = date;
    };
    const rule = {
      startTime: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      reasonType: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      reasonDesc: {
        required: true,
        message: root.$t("请输入"),
        trigger: "change",
      },
    };
    const minStartTime = ref(null);
    const reqMinStartTime = async () => {
      minStartTime.value = moment(root.DateTimeUtils.getNextHalfHour().toISOString()).subtract(30, "minutes").toISOString();

    };
    onMounted(() => {
      reqMinStartTime();
      getReason();
    });
    const loading = ref(false);
    const onSubmit = async () => {
      await refs["myForm"].validate();
      try {
        loading.value = true;
        await root.$Api.classManagement.reqOtoAdjust(formState);
        root.$notify.success(root.$t("操作成功"));
        logEvent("submit_do_1v1_adjust_single", "1v1提交调课", {
          studentUserId: root.$route.query.studentId,
        });
        goBack();
      } finally {
        loading.value = false;
      }
    };
    return {
      isEn,
      bookCourseTeacherInfo,
      bookCoursePackageInfo,
      userTimeZone: computed(() => root.$store.getters.userTimeZone),
      toUserTimeZoneTime,
      filterZoneName,
      goBack,
      onSubmit,
      minStartTime,
      reasonList,
      reasonType,
      formState,
      rule,
      loading,
      onSelectDateTime,
    };
  },
};
</script>
<style scoped lang="scss">
.book-one-warp {
  color: #444444;
  width: 100%;
  padding-left: 20px;
  .title {
    font-family: "Hiragino Sans GB";
    margin: 0px;
    font-weight: 700;
    text-align: center;
  }
  .bottom-btn-wrap {
    position: fixed;
    bottom: 20px;
    text-align: center;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
