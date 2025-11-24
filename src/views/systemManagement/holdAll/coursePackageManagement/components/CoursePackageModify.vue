<template>
  <el-dialog
    custom-class="course-package-modify"
    width="1080px"
    :title="$t(`基本信息`)"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" label-width="220px" :model="formState">
      <el-form-item
        prop="productId"
        :label="$t('关联产品')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-select
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          v-model="formState.productId"
        >
          <el-option
            v-for="item in formState.productList"
            :key="item.id"
            :label="isZh ? item.productName : item.productNameEn"
            :value="item.id"
          />
        </el-select>
        <span v-if="productPriceInfo">
          {{ $t("单价") }}
          {{ productPriceInfo.unitPrice }}
          {{ productPriceInfo.currency }}
        </span>
      </el-form-item>
      <el-form-item
        prop="name"
        :label="$t('课包名称')"
        :rules="[{ required: true, validator: validateName, trigger: 'blur' }]"
      >
        <el-input
          maxlength="64"
          :disabled="isEdit"
          :placeholder="$t('请输入')"
          v-model="formState.name"
        />
      </el-form-item>
      <el-form-item
        :label="$t('课时数量')"
      >
        <el-input-number
          :placeholder="$t('请输入')"
          :disabled="isEdit"
          :min="0"
          :precision="0"
          v-model="formState.amount"
        />
        <span v-if="productPriceInfo && formState.amount">
          {{ $t("总价") }}
          {{ formState.amount * productPriceInfo.unitPrice }}
          {{ productPriceInfo.currency }}
        </span>
      </el-form-item>
      <el-form-item
        prop="area"
        :label="$t('地区')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-select
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          v-model="formState.area"
        >
          <el-option
            v-for="item in AREA_LIST"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="type"
        :label="$t('类型')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-select
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          v-model="formState.type"
        >
          <el-option
            v-for="item in TYPE_LIST"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <section class="term-block">
        <el-form-item
          prop="duration"
          :label="$t('期限')"
          :rules="[{ required: true, message: $t('请选择'), trigger: 'blur' }]"
        >
          <el-input-number
            :placeholder="$t('请输入')"
            :disabled="isEdit"
            :min="0"
            :precision="0"
            v-model="formState.duration"
          />
        </el-form-item>
        <el-form-item
          prop="typeOfDuration"
          :rules="[
            { required: true, message: $t('请选择'), trigger: 'change' },
          ]"
        >
          <el-select
            :disabled="isEdit"
            :placeholder="$t('请选择')"
            v-model="formState.typeOfDuration"
          >
            <el-option
              v-for="item in TERM_UNIT_LIST"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </section>
      <el-form-item
        prop="isCoin"
        :label="$t('是否能积分兑换')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-radio-group :disabled="isEdit" v-model="formState.isCoin">
          <el-radio :label="1">{{ $t("能") }}</el-radio>
          <el-radio :label="0">{{ $t("不能") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="isShow"
        :label="$t('是否显示')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-radio-group v-model="formState.isShow">
          <el-radio
            v-for="item in IS_SHOW_LIST"
            :label="item.value"
            :key="item.value"
          >
            {{ $t(item.label) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="status"
        :label="$t('状态')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-radio-group v-model="formState.status">
          <el-radio
            v-for="item in STATUS_LIST"
            :label="item.value"
            :key="item.value"
          >
            {{ $t(item.label) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button type="primary" @click="handleOk" :loading="submitLoading">
        {{ $t("确定") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isNull } from "lodash-es";
import {
  reactive,
  watch,
  markRaw,
  onMounted,
  computed,
  unref,
  ref,
} from "@vue/composition-api";
import {
  TYPE_LIST,
  STATUS_LIST,
  IS_SHOW_LIST,
  AREA_LIST,
  TERM_UNIT_LIST,
} from "../../constants";

const { id, username } = JSON.parse(localStorage.userInfo);

export default {
  props: {
    visible: { type: Boolean, default: false },
    id: { type: Number, default: null },
  },
  setup(props, { root, refs, emit }) {
    const isEdit = computed(() => !isNull(props.id));
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");

    const formState = reactive({
      productId: null,
      name: null,
      amount: void 0,
      area: null,
      type: null,
      duration: 100,
      typeOfDuration: "YEAR",

      isCoin: null,
      isShow: null,
      status: null,

      productList: [],
    });

    const validateName = (_, value, callback) => {
      if (!value?.trim()) {
        callback(new Error(root.$t(`请输入`)));
      } else {
        callback();
      }
    };

    const submitLoading = ref(false);

    const productPriceInfo = computed(() =>
      formState.productList.find((v) => v.id === formState.productId)
    );

    const getCoursePackageById = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getCoursePackageById(props.id);
      if (status !== 200 || code !== 200) return Promise.reject();
      const { productList, ...rest } = formState;
      Object.keys(rest).forEach((v) => (formState[v] = data[v]));
    };

    watch(
      () => props.visible,
      (val) => {
        if (!val || isNull(props.id)) return;
        getCoursePackageById();
      }
    );

    const handleClose = () => {
      emit("update:visible", false);
      refs.ruleForm.resetFields();
      formState.amount = void 0;
    };

    const addCoursePackage = async () => {
      const { productList, ...params } = formState;
      const {
        status,
        data: { code },
      } = await root.$Api.systemManagement.addCoursePackage({
        ...params,
        createUserId: id,
        createUserName: username,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
    };

    const updateCoursePackage = async () => {
      const { isShow, status } = formState;
      const {
        status: _status,
        data: { code },
      } = await root.$Api.systemManagement.updateCoursePackage({
        id: props.id,
        isShow,
        status,
        updateUserId: id,
        updateUserName: username,
      });
      if (_status !== 200 || code !== 200) return Promise.reject();
    };

    const handleOk = async () => {
      try {
        submitLoading.value = true;
        await refs.ruleForm.validate();
        if (unref(isEdit)) {
          await updateCoursePackage();
          root.$message.success(root.$t("修改成功"));
        } else {
          await addCoursePackage();
          root.$message.success(root.$t("添加成功"));
        }
        emit("ok");
        handleClose();
      } finally {
        submitLoading.value = false;
      }
    };

    const getEffectiveProductList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getEffectiveProductList();
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.productList = markRaw(data);
    };

    onMounted(getEffectiveProductList);

    return {
      TYPE_LIST,
      IS_SHOW_LIST,
      STATUS_LIST,
      AREA_LIST,
      TERM_UNIT_LIST,
      isEdit,
      isZh,
      formState,
      submitLoading,
      productPriceInfo,

      validateName,
      handleClose,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .course-package-modify {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0 !important;
  .el-dialog__body {
    height: 470px;
    overflow-y: auto;
  }
}
.el-select,
.el-input,
.el-input-number {
  width: 250px;
}
::v-deep .el-radio {
  .el-radio__label {
    display: inline-block;
    width: 100px;
  }
}
::v-deep .term-block {
  display: flex;
  .el-input-number {
    width: 140px;
    margin-right: 10px;
  }
  .el-select {
    width: 100px;
  }
  .el-form-item {
    &:last-child {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
