<template>
  <el-dialog
    :title="$t('分配学管老师')"
    :visible="visible"
    width="1200px"
    :before-close="handleClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div>
      <FamilyLaList :parentUserId="currentInfo.parentUserId" />
      <label for="la">{{ $t("学管老师") }}</label>
      <el-select
        style="margin-top: 30px"
        id="la"
        clearable
        filterable
        v-model="params.toUserId"
        :placeholder="$t('请选择')"
      >
        <el-option
          v-for="item in laList"
          :key="item.value"
          :label="`${item.nameEn}-${item.nameZh}`"
          :value="item.userId"
        ></el-option>
      </el-select>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit('ruleForm')"
      >{{ $t("确定") }}</el-button>
    </span>
  </el-dialog>
</template> 

<script>
import { onMounted, reactive, computed, ref } from "@vue/composition-api";
import { getStorage } from "@/utils/handleStorage";
import { ABNORMAL_CODE } from "@/utils/constants";
import FamilyLaList from "../components/familyLaList";

export default {
  name: "assignLA",
  components: {
    FamilyLaList,
  },
  props: {
    visible: { type: Boolean, default: false },
    currentInfo: { type: Object, default: () => { } /*  */ },
    userRole: { type: String, default: `` },
    localKey: { type: Number, default: 0 },
    taskCode: { type: Number, default: 0 },
  },
  setup (props, { root, emit }) {
    const loading = ref(false);
    const handleClose = () => {
      emit("update:visible", false);
    };
    const params = reactive({
      toUserId: "",
    });
    const laList = ref([]);

    const handleSubmit = async () => {
      if (!params.toUserId) {
        return root.$message.warning(root.$t("请选择分配学管"));
      }
      loading.value = true;
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.task.submitAssignLa({
          xgUserId: params.toUserId,
          studentLearningPlanId: props.currentInfo.course.studentPlanId,
        });
        if (code === ABNORMAL_CODE.noBindingsWeChat) {
          return root.$notify.error('学习计划不存在或已经被交接');
        }
        if (status !== 200 || code !== 200) return Promise.reject();
        root.$message.success(root.$t("Allocation succeeded"));
        emit("refreshPage");
        handleClose()
      } finally {
        loading.value = false;
      }
    };

    const reqLaList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.task.reqAssignLaList({
        funcCodeGroup: 200300,
        userld: JSON.parse(getStorage("userInfo")).id,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      laList.value = data || [];
    };

    onMounted(async () => {
      reqLaList();
    });
    return {
      loading,
      params,
      laList,
      handleClose,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss">
</style>
