<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :rules="rules"
      :model="form"
      :label-width="currentLang === 'en' ? '120px' : '100px'"
    >
      <el-form-item prop="subject" :label="$t('薪酬标签') + ':'">
        <el-select
          v-model="form.subject"
          :placeholder="$t('请选择薪酬标签')"
          style="width: 500px"
        >
          <el-option
            v-for="item in subjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{
        $t("确定")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SalaryLabelChange",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        subject: "",
      },
      rules: {
        subject: [
          {
            required: true,
            message: this.$t("请选择薪酬标签"),
            trigger: "change",
          },
        ],
      },
      subjectOptions: [
        { value: "0", label: "标签1" },
        { value: "1", label: "标签2" },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    
  },
  created() {
    this.initFormData();
  },
  watch: {
    tableData: {
      handler: 'initFormData',
      immediate: true
    },
    visible: {
      handler(val) {
        if (val) {
          this.initFormData();
        }
      },
      immediate: true
    }
  },
  methods: {
    initFormData() {
      this.dialogTitle = this.tableData? this.$t("更换薪酬标签") : this.$t("添加薪酬标签");
      if (this.tableData && this.visible) {
        this.$set(this.form, 'subject', this.tableData.contractStatus?.toString() || "");
      }
    },
    handleClose() {
      this.$refs.formRef.resetFields();
      this.$emit("update:visible", false);
    },
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit("ok");
          this.handleClose();
        }
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.btn-box {
  text-align: right;
  margin: 0 0 10px;
}
.span-info {
  color: #a3a3a3;
  font-size: 12px;
}
.span-warn {
  color: #ff0000;
}
.ml-10 {
  margin-left: 10px;
}
.upload-demo {
  .el-upload__tip {
    color: #909399;
    font-size: 12px;
    margin-top: 7px;
  }
}
</style>
  