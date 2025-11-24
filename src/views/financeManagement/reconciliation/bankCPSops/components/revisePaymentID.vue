<template>
  <div>
    <el-dialog
      :title="$t('修正流水号')"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div v-if="reference.length">
        <el-form
          v-if="isMultipleReference"
          label-position="top"
          :model="formData"
          :rules="rules"
          ref="formData"
          :label-width="currentLang === 'en' ? '120px' : '80px'"
        >
          <el-form-item
            v-for="(item, index) in reference"
            :key="item.reference"
            :label="item.label"
          >
            <el-input
              class="maxlength-input"
              v-model="formData.referenceAdditions[index].reference"
              :placeholder="$t('请输入')"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <el-form
          v-else
          label-position="top"
          :model="formData"
          ref="formData"
          :label-width="currentLang === 'en' ? '120px' : '80px'"
        >
          <el-form-item :label="reference[0].label">
            <el-input
              class="maxlength-input"
              v-model="formData.changeReference"
              :placeholder="$t('请输入')"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t("确认") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "@vue/composition-api";

export default {
  props: {
    dialogVisible: { type: Boolean, define: false },
    orderId: { type: Number, define: -1 },
    selectRow: { type: Object, define: {} },
  },
  setup(props, { root, emit, refs }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const formData = reactive({
      changeReference: "",
      referenceAdditions: null,
    });
    const rules = computed(() => ({
      changeReference: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
    }));

    const confirm = () => {
      const params = { ...formData, ...{ orderId: props.orderId } };
      if (params.referenceAdditions !== null) {
        params.referenceAdditions = JSON.stringify(params.referenceAdditions);
      }
      root.$Api.financeManagement
        .updateReference(params)
        .then(({ status, data: { code, data } }) => {
          if (status == 200 && code == 200) {
            handleClose();
            emit("updateTable");
            root.$notify.success({ message: "操作成功" });
          }
        });
    };

    const handleClose = () => {
      formData.changeReference = "";
      formData.referenceAdditions = null;
      reference.value=[]
      refs.formData.resetFields();
      emit("update:dialogVisible", false);
    };
    const reference = ref([]);
    const isMultipleReference = ref(false);
    onMounted(() => {
      if (props.selectRow[0]?.referenceArr?.length) {
        //多笔流水
        isMultipleReference.value = true;
        reference.value = props.selectRow[0].referenceArr;
        formData.referenceAdditions = JSON.parse(
          props.selectRow[0].referenceAdditions
        );
        reference.value.forEach((e) => {
          e.label = e.reference;
        });
      } else {
        //单笔流水
        reference.value = [
          {
            label: props.selectRow[0].reference,
            reference: props.selectRow[0].reference,
          },
        ];
        formData.changeReference = props.selectRow[0].reference;
      }
    });

    return {
      currentLang,
      formData,
      rules,
      reference,
      isMultipleReference,
      confirm,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped></style>
