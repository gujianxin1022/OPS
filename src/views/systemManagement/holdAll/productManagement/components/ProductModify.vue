<template>
  <el-dialog
    custom-class="product-modify"
    width="1080px"
    :title="$t(`基本信息`)"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" label-width="220px" :model="formState">
      <el-form-item :label="$t('课程版本')">
        <el-select
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          multiple
          v-model="formState.courseEditionId"
        >
          <el-option
            v-for="item in formState.editionList"
            :key="item.editionId"
            :label="item.editionId | mapEdtion"
            :value="item.editionId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="productName"
        :label="$t('产品名称(中文)')"
        :rules="[
          { required: true, validator: validateProductName, trigger: 'blur' },
        ]"
      >
        <el-input
          maxlength="250"
          :disabled="isEdit"
          :placeholder="$t('请输入')"
          v-model="formState.productName"
        />
      </el-form-item>
      <el-form-item :label="$t('产品描述(中文)')">
        <el-input
          maxlength="500"
          type="textarea"
          :rows="4"
          :placeholder="$t('请输入')"
          v-model="formState.descriptionCn"
        />
      </el-form-item>
      <el-form-item
        prop="productNameEn"
        :label="$t('产品名称(英文)')"
        :rules="[
          { required: true, validator: validateProductName, trigger: 'blur' },
        ]"
      >
        <el-input
          maxlength="250"
          :disabled="isEdit"
          :placeholder="$t('请输入')"
          v-model="formState.productNameEn"
        />
      </el-form-item>
      <el-form-item :label="$t('产品描述(英文)')">
        <el-input
          maxlength="500"
          type="textarea"
          :rows="4"
          :placeholder="$t('请输入')"
          v-model="formState.descriptionEn"
        />
      </el-form-item>
      <el-form-item
        prop="classTypeId"
        :label="$t('产品类型')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-select
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          v-model="formState.classTypeId"
        >
          <el-option
            v-for="item in CLASS_TYPE_LIST"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="effectiveTime"
        :label="$t('有效时间')"
        :rules="[
          {
            type: 'array',
            required: true,
            message: $t('请选择'),
            trigger: 'change',
          },
        ]"
      >
        <el-date-picker
          v-model="formState.effectiveTime"
          type="datetimerange"
          :disabled="isEdit"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        />
      </el-form-item>
      <el-form-item
        prop="currencyId"
        :label="$t('货币标识')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-select
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          v-model="formState.currencyId"
        >
          <el-option
            v-for="item in formState.currencyList"
            :key="item.id"
            :label="item.currency"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="unitPrice"
        :label="$t('课时单价')"
        :rules="[{ required: true, message: $t('请输入'), trigger: 'blur' }]"
      >
        <el-input-number
          :placeholder="$t('请输入')"
          :disabled="isEdit"
          :min="0"
          v-model="formState.unitPrice"
        />
      </el-form-item>
      <el-form-item
        prop="duration"
        :label="$t('课时时长')"
        :rules="[{ required: true, message: $t('请输入'), trigger: 'blur' }]"
      >
        <el-input-number
          :placeholder="$t('请输入')"
          :disabled="isEdit"
          :min="0"
          :precision="0"
          v-model="formState.duration"
        />
        <span>{{ $t("分钟") }}</span>
      </el-form-item>
      <el-form-item
        prop="agreementId"
        :label="$t('支付条款协议')"
        :rules="[{ required: true, message: $t('请输入'), trigger: 'blur' }]"
      >
        <el-select
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          v-model="formState.agreementId"
        >
          <el-option
            v-for="item in formState.agreementList"
            :key="item.id"
            :label="isZh ? item.titleCh : item.titleEn"
            :value="item.id"
          />
        </el-select>
        <el-button type="text" v-if="!isEdit" @click="protocolVisible = true">
          {{ $t("添加支付条款协议") }}
        </el-button>
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
    </el-form>
    <AddProtocol :visible.sync="protocolVisible" @ok="getProtocolList" />
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
  onMounted,
  reactive,
  watch,
  markRaw,
  computed,
  ref,
  unref,
} from "@vue/composition-api";
import { CLASS_TYPE_LIST, STATUS_LIST, IS_SHOW_LIST } from "../../constants";

import AddProtocol from "./AddProtocol";

const { id, username } = JSON.parse(localStorage.userInfo);

export default {
  props: {
    visible: { type: Boolean, default: false },
    id: { type: Number, default: null },
  },
  components: {
    AddProtocol,
  },
  setup(props, { root, refs, emit }) {
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");
    const isEdit = computed(() => !isNull(props.id));

    const submitLoading = ref(false);
    const protocolVisible = ref(false);

    const formState = reactive({
      courseEditionId: [],
      productName: null,
      descriptionCn: null,
      productNameEn: null,
      descriptionEn: null,
      classTypeId: null,
      effectiveTime: [],
      currencyId: null,
      status: null,
      isShow: null,
      agreementId: null,
      unitPrice: void 0,
      duration: void 0,

      editionList: [],
      currencyList: [],
      agreementList: [],
    });

    const validateProductName = (_, value, callback) => {
      if (!value?.trim()) {
        callback(new Error(root.$t(`请输入`)));
      } else {
        callback();
      }
    };

    const getProductById = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getProductById(props.id);
      if (status !== 200 || code !== 200) return Promise.reject();
      const { editionList, currencyList, agreementList, ...rest } = formState;
      Object.keys(rest).forEach((v) => (formState[v] = data[v]));
      formState.effectiveTime = [data.validStartTime, data.validEndTime];
    };

    watch(
      () => props.visible,
      (val) => {
        if (!val || isNull(props.id)) return;
        getProductById();
      }
    );

    const handleClose = () => {
      emit("update:visible", false);
      Object.assign(formState, {
        descriptionCn: null,
        descriptionEn: null,
        courseEditionId: [],
      });
      refs.ruleForm.resetFields();
    };

    const addPorduct = async () => {
      const {
        editionList,
        currencyList,
        agreementList,
        effectiveTime: [validStartTime, validEndTime],
        ...params
      } = formState;
      const {
        status,
        data: { code },
      } = await root.$Api.systemManagement.addPorduct({
        ...params,
        validStartTime,
        validEndTime,
        createUserId: id,
        currency: currencyList.find((v) => v.id === params.currencyId).currency,
        createUserName: username,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
    };

    const updateProdunct = async () => {
      const { descriptionCn, descriptionEn, status, isShow } = formState;
      const {
        status: _status,
        data: { code },
      } = await root.$Api.systemManagement.updateProdunctStatus({
        id: props.id,
        descriptionCn,
        descriptionEn,
        status,
        isShow,
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
          await updateProdunct();
          root.$message.success(root.$t("修改成功"));
        } else {
          await addPorduct();
          root.$message.success(root.$t("添加成功"));
        }
        emit("ok");
        handleClose();
      } finally {
        submitLoading.value = false;
      }
    };

    const getAllCourseList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.base.courseEdition();
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.editionList = markRaw(data);
    };

    const getEffectiveCurrencyList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getEffectiveCurrencyList();
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.currencyList = markRaw(data);
    };

    const getProtocolList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getProtocolList();
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.agreementList = markRaw(data);
    };

    onMounted(() => {
      getEffectiveCurrencyList();
      getProtocolList();
      getAllCourseList();
    });

    return {
      CLASS_TYPE_LIST,
      STATUS_LIST,
      IS_SHOW_LIST,

      isZh,
      isEdit,
      formState,
      submitLoading,
      protocolVisible,

      validateProductName,
      getProtocolList,
      handleClose,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .product-modify {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0 !important;
  .el-dialog__body {
    height: 70vh;
    overflow-y: auto;
  }
}
.el-select,
.el-input,
.el-input-number,
.el-textarea,
.el-date-editor {
  width: 350px;
}
::v-deep .el-radio {
  .el-radio__label {
    display: inline-block;
    width: 100px;
  }
}
</style>
