<template>
  <div class="batc-cancel-class-wrap">
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('取消课程')"
      :show-close="true"
      :visible.sync="show"
      :before-close="close"
      :width="isEn ? '610px' : '610px'"
      append-to-body
      center
    >
      <div
        slot="title"
        style="text-align: left; color: #303133; font-size: 18px"
      >
        {{ $t("取消课程") }} - {{ $route.query.studentName }}
      </div>
      <div class="dialog-content-wrap">
        <div style="padding: 20px 0 0 50px">
          <span>{{ $t("取消原因") }}：</span>
          <el-radio-group
            style="display: inline-block; vertical-align: top"
            v-model="cancelByTimetableIdParams.cancelReasonType"
          >
            <div
              style="margin-bottom: 10px"
              v-for="item in cancelReasonList"
              :key="item.id"
            >
              <el-radio :label="item.id">{{
                isEn ? item.en : item.zh
              }}</el-radio>
            </div>
          </el-radio-group>
          <el-input
            v-if="cancelByTimetableIdParams.cancelReasonType === 100"
            v-model.trim="cancelByTimetableIdParams.cancelReasonDesc"
            :placeholder="$t('请填写原因')"
            maxlength="100"
            rows="4"
            resize="none"
            show-word-limit
            style="padding-left: 73px"
            type="textarea"
          ></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t("关闭") }}</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="sureCancel"
          :disabled="
            !cancelByTimetableIdParams.cancelReasonType ||
            (cancelByTimetableIdParams.cancelReasonType === 100 &&
              cancelByTimetableIdParams.cancelReasonDesc.length <= 0)
          "
          >{{ $t("取消课程") }}</el-button
        >
      </div>
    </el-dialog>
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
import { logEvent } from "@/utils/analyticsNew";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    currentCoursePkg: {
      type: Object,
      default: null,
    },
    timetableIdList: {
      type: Array,
      default: [],
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const goBack = () => {
      emit("goBack");
    };
    const cancelReasonList = ref([]);
    const reqCancelReason = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.studentManagement.reqCancelReason();
      if (status !== 200 || code !== 200) return Promise.reject();
      cancelReasonList.value = data || [];
    };
    const close = () => {
      emit("closeCancelClassDialog");
    };
    const cancelByTimetableIdParams = reactive({
      cancelReasonDesc: "",
      cancelReasonType: null,
      coursePackageId: props.currentCoursePkg.packageId,
      studentUserId: root.$route.query.studentId,
      timetableIdList: props.timetableIdList,
    });
    const loading = ref(false);
    const sureCancel = async () => {
      try {
        loading.value = true;
        await root.$Api.classManagement.reqBatchCancelClass(
          cancelByTimetableIdParams
        );
        root.$notify.success(root.$t("操作成功"));
        logEvent("submit_batch_cancel_class", "提交批量取消课程", {
          studentUserId: root.$route.query.studentId,
        });
        emit("success");
        close();
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      reqCancelReason();
    });
    return {
      isEn,
      goBack,
      cancelReasonList,
      close,
      cancelByTimetableIdParams,
      loading,
      sureCancel,
    };
  },
};
</script>
