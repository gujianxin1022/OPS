<template>
  <el-dialog
    :title="$t('更新岗位信息')"
    :visible.sync="show"
    :width="currentLang == 'en' ? '500px' : '400px'"
    :before-close="handleClose"
    center
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="currentLang == 'en' ? '188px' : '120px'"
      :rules="rules"
    >
      <el-form-item :label="$t('岗位编码')" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item :label="$t('职责编码')" prop="type">
        <el-select :disabled="disabled" v-model="form.funcCode" :placeholder="$t('请选择岗位类别')">
          <el-option
            v-for="(item, index) in Constants.functionCodeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="岗位类型" prop="leader">
        <el-select v-model="form.leader" placeholder="请选择岗位类型">
          <el-option
            v-for="(item, index) in leaderList"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item :label="$t('岗位中文名称')" prop="nameZh">
        <el-input v-model="form.nameZh"></el-input>
      </el-form-item>
      <el-form-item :label="$t('岗位英文名称')" prop="nameEn">
        <el-input v-model="form.nameEn"></el-input>
      </el-form-item>
      <el-form-item :label="$t('岗位说明')" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item :label="$t('岗位类别')" prop="type">
        <el-select :disabled="disabled" v-model="form.type" :placeholder="$t('请选择岗位类别')">
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('在职/离职标识')" prop="type">
        <el-select v-model="form.dimissionStatus" :placeholder="$t('在职/离职标识')">
          <el-option
            v-for="item in Constants.getInServiceStatusList()"
            :key="item.value"
            :label="currentLang == 'en' ? item.en : item.zh"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button
        :loading="updateLoading"
        type="primary"
        @click="handleUpdate"
        >{{ $t("更新") }}</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    nodeInfo: {
      type: Object,
      default: () => {},
    },
    currentNode: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      updateLoading: false,
      form: {
        code: "",
        leader: 1,
        nameZh: "",
        nameEn: "",
        remark: "",
        type: "",
        funcCode: "",
        dimissionStatus:""
      },
      leaderList: [
        {
          label: "管理岗",
          value: 1,
        },
        {
          label: "基层员工岗",
          value: 2,
        },
      ],
      typeList: [
        {
          label: "岗位",
          value: 1,
        },
        {
          label: "部门",
          value: 2,
        },
        {
          label: "公司",
          value: 3,
        },
      ],
      rules: {
        code: [{ required: true, message: "请输入岗位编码", trigger: "blur" }],
        leader: [
          { required: true, message: "请输入岗位类型", trigger: "blur" },
        ],
        nameZh: [
          { required: true, message: "请输入岗位中文名称", trigger: "blur" },
        ],
        nameEn: [
          { required: true, message: "请输入岗位英文名称", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入岗位描述", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入岗位类别", trigger: "blur" }],
      },
      disabled: false,
    };
  },
  computed: {
    ...mapState({
      currentLang: (state) => state.app.currentLang,
    }),
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleUpdate() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.updateLoading = true;
          this.$Api.systemManagement
            .updateJobInfo(this.form.id, this.form)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.handleClose();
                this.$notify({
                  message: "更新成功",
                  type: "success",
                });
                this.$emit("getData");
              } else {
                this.$notify({
                  message: "更新失败",
                  type: "success",
                });
              }
              this.updateLoading = false;
            });
        }
      });
    },
  },
  mounted() {
    Object.assign(this.form, this.nodeInfo);
    /**
     * 更新岗位信息，以下2种情况职责编码和岗位类别不可修改
     * 1、操作节点为岗位，且拥有子节点
     * 2、操作节点为岗位，且父级节点岗位类别也是岗位
    */
    this.disabled =
      (this.nodeInfo.type === 1 &&
        this.nodeInfo.subList !== undefined &&
        this.nodeInfo.subList !== null &&
        this.nodeInfo.subList.length > 0) ||
      (this.nodeInfo.type === 1 && this.currentNode.parent.data.type === 1);
  },
};
</script>
