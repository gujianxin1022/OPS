<template>
  <el-dialog
    width="1080px"
    :title="$t(`新增原因`)"
    :visible="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" label-width="200px" :model="formData" :rules="rules" inline>
      <el-form-item prop="type" :label="$t('类型')">
        <el-select v-model="formData.type" :placeholder="$t('请选择')">
          <el-option
            v-for="item in costTypeList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="classify" :label="$t('使用方式')" >
        <el-select v-model="formData.classify" :placeholder="$t('请选择')">
          <el-option
            v-for="item in CLASSIFY_LIST"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="isShow" :label="$t('是否展示')">
        <el-select v-model="formData.isShow" :placeholder="$t('请选择')">
          <el-option
            v-for="item in SHOW_LIST"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="postId" :label="$t('归属部门')">
        <el-select v-model="formData.postId" :placeholder="$t('请选择')">
          <el-option
            v-for="item in departmentList"
            :key="item.value"
            :label="item.label"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="costCenter" :label="$t('成本中心')">
        <el-cascader
          clearable
          v-model="formData.costCenter"
          :options="costHas2LevelList"
          :placeholder="$t('请选择')"
        />
      </el-form-item>
      <el-form-item>
        <div style="width: 440px" />
      </el-form-item>
      <el-form-item prop="describeZh" :label="$t('原因详情-中文')">
        <el-input
          maxlength="100"
          v-model="formData.describeZh"
          :placeholder="$t(`请输入`)"
        />
      </el-form-item>
      <el-form-item prop="describeEn" :label="$t('原因详情-English')">
        <el-input
          maxlength="100"
          v-model="formData.describeEn"
          :placeholder="$t(`请输入`)"
        />
      </el-form-item>
      <el-form-item prop="describeClientZh" :label="$t('C端展示-中文')">
        <el-input
          maxlength="15"
          v-model="formData.describeClientZh"
          :placeholder="$t(`请输入`)"
        />
      </el-form-item>
      <el-form-item prop="describeClientEn" :label="$t('C端展示-English')">
        <el-input
          maxlength="30"
          v-model="formData.describeClientEn"
          :placeholder="$t(`请输入`)"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="handleOk" :loading="loading">
        {{ $t("确定") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reactive, ref, computed, unref, markRaw } from "@vue/composition-api";
import { useOptions } from "./useOptions";
import { addCoinReason, addPointReason } from "@/api/financeManagement";
import { CLASSIFY_LIST, SHOW_LIST, ON_LINE, COIN, CLASS_HOUR } from "./constants";

const API_MAP = {
  [COIN]: { addReason: addCoinReason },
  [CLASS_HOUR]: { addReason: addPointReason }
}
export default {
  props: {
    visible: { type: Boolean, default: false },
    type: { type: String, default: null /* coin: 积分；classHour: 课时 */ },
  },
  setup(props, { root, refs, emit }) {
    const api = computed(() => API_MAP[props.type]);

    const { departmentList, costList, costTypeList } = useOptions();
    const costHas2LevelList = computed(() =>
      markRaw(unref(costList).filter((v) => v.children?.length))
    );

    const loading = ref(false);
    const formData = reactive({
      type: null,
      classify: null,
      isShow: null,
      postId: null,
      costCenter: [],
      describeZh: "",
      describeEn: "",
      describeClientZh: "",
      describeClientEn: "",
    });
    const validateCostName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(root.$t(`请输入`)));
      } else {
        callback();
      }
    }
    const rules = computed(() => ({
      type: [{ required: true, message: root.$t(`请选择`), trigger: 'change' }],
      classify: [{ required: true, message: root.$t(`请选择`), trigger: 'change' }],
      isShow: [{ required: true, message: root.$t(`请选择`), trigger: 'change' }],
      postId: [{ required: true, message: root.$t(`请选择`), trigger: 'change' }],
      costCenter: [{ type: 'array', required: true, message: root.$t(`请选择`), trigger: 'change' }],
      describeZh: [{ required: true, validator: validateCostName}],
      describeEn: [{ required: true, validator: validateCostName }],
      describeClientZh: [{ required: true, validator: validateCostName }],
      describeClientEn: [{ required: true, validator: validateCostName }]
    }))

    const handleClose = () => {
      emit("update:visible", false);
    };
    const handleOk = async () => {
      await refs.ruleForm.validate();
      await addReason();
      refs.ruleForm.resetFields();
      emit("ok");
      handleClose();
    };
    const addReason = async () => {
      try {
        loading.value = true;
        const { id, username } = JSON.parse(localStorage.userInfo);
        const {
          costCenter: [costFirstId, costSecondId],
          postId: { nameZh: postNameZh, nameEn: postNameEn, value: postId },
          type,
          classify,
          isShow,
          describeZh,
          describeEn,
          describeClientZh,
          describeClientEn,
        } = formData;
        const costFirst = unref(costHas2LevelList).find(v => v.value === costFirstId);
        const costSecond = costFirst.children.find(v => v.value === costSecondId);
        const {
          status,
          data: { code },
        } = await unref(api).addReason({
          type,
          isShow: +isShow,
          classify: +classify,
          describeZh: describeZh.trim(),
          describeEn: describeEn.trim(),
          describeClientZh: describeClientZh.trim(),
          describeClientEn: describeClientEn.trim(),
          costFirstId,
          costFirstNameZh: costFirst.nameZh,
          costFirstNameEn: costFirst.nameEn,
          costSecondId,
          costSecondNameZh: costSecond.nameZh,
          costSecondNameEn: costSecond.nameEn,
          postId,
          postNameZh,
          postNameEn,
          createUserName: username,
          createUserId: id,
          status: ON_LINE /* 新增原因默认为上线 */,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
      } finally {
        loading.value = false;
      }
    };

    return {
      CLASSIFY_LIST,
      SHOW_LIST,
      formData,
      rules,
      departmentList,
      costHas2LevelList,
      costTypeList,

      handleClose,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-select,
.el-input,
.el-textarea,
.el-cascader {
  width: 250px;
}
.el-form-item {
  margin-bottom: 25px;
}
::v-deep .el-form-item__error {
  padding-top: 5px;
}
</style>
