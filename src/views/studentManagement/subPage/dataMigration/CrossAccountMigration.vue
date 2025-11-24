<template>
  <el-dialog
    :title="$t('跨账号迁移课时')"
    :center="true"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
  >
    <div>
      <el-form
        ref="myForm"
        :rules="rules"
        :model="formState"
        :label-width="isEn ? '200px' : '120px'"
      >
        <el-form-item prop="" :label="$t('课程包名称') + ':'">
          {{ isEn ? coursePackageNameEn : coursePackageName }}
        </el-form-item>
        <el-form-item prop="" :label="$t('账户余额') + ':'">
          {{ balance }}
        </el-form-item>
        <el-form-item prop="toParentUserId" :label="$t('迁入家长ID') + ':'">
          <el-input
            :placeholder="$t('请输入')"
            v-model.trim="formState.toParentUserId"
            style="width: 198px"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="toStudentId"
          :label="$t('选择学员')"
          :rules="[
            { required: true, message: $t('请选择'), trigger: 'change' },
          ]"
        >
          <el-select
            v-model="formState.toStudentId"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="amount"
          :label="$t('迁入数量') + ':'"
          :rules="[
            { required: true, message: $t('请输入'), trigger: 'change' },
          ]"
        >
          <el-input-number
            :placeholder="$t('请输入')"
            :max="balance > 0 ? balance : -1"
            :min="balance > 0 ? 1 : -Infinity"
            v-model="formState.amount"
            :precision="0"
          />
        </el-form-item>
        <el-form-item
          prop="reasons"
          :label="$t('操作原因') + ':'"
          :rules="[
            { required: true, message: $t('请输入'), trigger: 'change' },
          ]"
        >
          <el-input
            type="textarea"
            :placeholder="$t('请谨慎操作并详细描述原因')"
            rows="4"
            v-model.trim="formState.reasons"
            class="text-wrap"
            style="width: 198px"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
        >{{ $t("确定修改") }}</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { computed, reactive, unref, ref, watch } from "@vue/composition-api";

export default {
  name: "CrossAccountMigration",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: null,
    },
    balanceId: {
      type: Number,
      default: null,
    },
    parentUserId: {
      type: String,
      default: null,
    },
    studentUserId: {
      type: String,
      default: null,
    },
    parentUserName: {
      type: String,
      default: null,
    },
    coursePackageId: {
      type: Number,
      default: null,
    },
    coursePackageName: {
      type: String,
      default: null,
    },
    coursePackageNameEn: {
      type: String,
      default: null,
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const formState = ref({
      balanceId: props.balanceId,
      toParentUserId: "",
      toStudentId: "",
      amount: "",
      reasons: "",
    });

    const initFormState = () => {
      formState.value = {
        balanceId: props.balanceId,
        toParentUserId: "",
        toStudentId: "",
        amount: "",
        reasons: "",
      };
      studentList.value = [];
      oldParentUserName.value = null;
      oldParentUserNameIsError.value = false;
    };

    const submitLoading = ref(false);
    const studentList = ref([]);
    const oldParentUserName = ref(null);
    const oldParentUserNameIsError = ref(false);
    let validateParentUserId = async (rule, value, callback) => {
      if (!value) {
        formState.value.toStudentId = null;
        studentList.value = [];
        oldParentUserName.value = null;
        return callback(new Error(root.$t("请输入")));
      }
      if (value === oldParentUserName.value) {
        if (oldParentUserNameIsError.value)
          return callback(new Error(this.$t("家长账号不存在")));
        return callback();
      }
      oldParentUserName.value = value;
      formState.value.toStudentId = null;
      studentList.value = [];
      const {
        status,
        data: { code, data },
      } = await root.$Api.financeManagement.getStudentListByParentId({
        parentUserId: value,
        status: 1,
      });
      if (status !== 200 || code !== 200 || data.length <= 0) {
        oldParentUserNameIsError.value = true;
        return callback(new Error(root.$t("家长账号不存在")));
      }
      oldParentUserNameIsError.value = false;
      studentList.value = data;
      formState.value.toStudentId = data[0].id;
      callback();
    };
    const rules = {
      toParentUserId: [
        { required: true, validator: validateParentUserId, trigger: "blur" },
      ],
    };

    const handleClose = () => {
      Object.assign(formState.value, {
        studentList: [],
      });
      refs.myForm.clearValidate();
      emit("update:visible", false);
    };
    watch(
      () => props.visible,
      (val) => !val && initFormState()
    );
    const handleSubmit = async () => {
      await refs["myForm"].validate();
      submitLoading.value = true;
      try {
        await root.$Api.studentManagement.reqClassHourMigration(
          formState.value
        );
        root.$notify.success(root.$t("操作成功"));
        emit("ok");
        handleClose();
      } finally {
        submitLoading.value = false;
      }
    };
    // 6337995391053055
    return {
      handleClose,
      formState,
      rules,
      studentList,
      handleSubmit,
      submitLoading,
      isEn,
    };
  },
};
</script>

<style lang="scss" scoped>
.operation-button {
  line-height: 32px;
  margin-right: 8px;
  cursor: pointer;
}
</style>
