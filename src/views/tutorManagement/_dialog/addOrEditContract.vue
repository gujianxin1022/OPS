<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :rules="rules"
        :model="form"
        :label-width="currentLang === 'en' ? '250px' : '150px'"
      >
        <el-form-item
          prop="contractTemplateName"
          :label="$t('合同模版名称') + ':'"
        >
          <el-input
            class="contract-name"
            v-model="form.contractTemplateName"
            type="text"
            :placeholder="$t('请输入合同模版名称')"
            maxlength="128"
            show-word-limit
            clearable
            style="width:80%"
            :disabled="isDetails"
          />
        </el-form-item>
        <el-form-item prop="subjectType" :label="$t('适用学科') + ':'">
          <el-select v-model="form.subjectType" :placeholder="$t('请选择适用学科')" style="width:80%" :disabled="isDetails">
            <el-option v-for="item in subjectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="templateScope" :label="$t('适用范围') + ':'">
          <el-select v-model="form.templateScope" :placeholder="$t('请选择适用范围')" style="width:80%" :disabled="isDetails">
            <el-option v-for="item in scopeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="contractType" :label="$t('合同类型') + ':'">
          <el-select v-model="form.contractType" :placeholder="$t('请选择合同类型')" style="width:80%" :disabled="isDetails">
            <el-option v-for="item in contractTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="contractDuration" :label="$t('合同周期') + ':'">
          <el-input-number 
            v-model="form.contractDuration" 
            :min="1"
            :max="99"
            :precision="0"
            :controls="true"
            @change="handleContractPeriodChange"
            :placeholder="$t('请输入')"
            style="width: 200px;"
            :disabled="isDetails"
          />
          <span class="ml-10">{{ $t('月') }}</span>
        </el-form-item>
        <el-form-item prop="validStartTime" :label="$t('合同模版生效时间') + ':'">
          <el-date-picker
            v-model="form.validStartTime"
            type="datetime"
            :placeholder="$t('请选择生效时间')"
            format="yyyy-MM-dd HH:mm:ss"
            style="width:80%"
            :picker-options="effectiveTimePickerOptions"
            @change="handleEffectiveTimeChange"
            :disabled="isDetails"
          />
        </el-form-item>
        <el-form-item prop="validEndTime" :label="$t('合同模版失效时间') + ':'">
          <el-date-picker
            v-model="form.validEndTime"
            v-if="isView"
            type="datetime"
            :placeholder="$t('请选择失效时间（选填）')"
            format="yyyy-MM-dd HH:mm:ss"
            style="width:80%"
            :picker-options="pickerOptions"
            disabled="true"
          />
          <el-date-picker
            v-model="form.validEndTime"
            v-else
            type="datetime"
            :placeholder="$t('请选择失效时间（选填）')"
            format="yyyy-MM-dd HH:mm:ss"      
            style="width:80%"
            :picker-options="pickerOptions"
            :disabled="!form.validStartTime"
          />
        </el-form-item>
        <el-form-item prop="attachmentAddr" :label="$t('合同附件') + ':'" required>
          <template v-if="isView || form.status === 1">
            {{ form.attachmentAddr }}
          </template>
          <el-upload
            v-else
            ref="upload"
            class="upload-demo"
            style="width:80%"
            accept=".pdf"
            :show-file-list="true"
            :auto-upload="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-remove="handleRemove"
            :disabled="false"
          >
            <el-button 
              size="small" 
              type="primary"
              :loading="uploadState.fileLoading"
              :disabled="uploadState.disabled || isDetails"
            >
              {{ uploadState.fileLoading ? $t("上传中...") : $t("点击上传") }}
            </el-button>
            <div slot="tip" class="el-upload__tip">
              {{ $t("仅支持PDF文件，大小不超过20MB") }}
            </div>
          </el-upload>
          <div v-if="fileList.length > 0" style="margin-top: 10px">
            <el-button 
              type="text" 
              @click="handlePreviewPdf(fileList[0].url)"
            >
              <i class="el-icon-document"></i> {{ $t("查看PDF") }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="isView">
        <el-button @click="handleClose">{{ $t("返回") }}</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="confirm" :loading="loading">{{ $t("确定") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted, watch } from "@vue/composition-api";
import { addContractTemplate } from "@/api/teacherContractTemplate";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => null
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    const isDetails = ref(false);
    const isEffective = ref(false);
    const form = reactive({
      contractTemplateName: "",
      subjectType: "",
      templateScope: "",
      contractType: 0,
      contractDuration: 1,
      validStartTime: "",
      validEndTime: "",
      attachmentAddr: null
    });
    // 上传相关的变量
    const uploadState = reactive({
      imageFlag: false,
      fileLoading: false,
      uploadFileArr: [],
      timers: null,
      uploadArr: [],
      done: false,
      picPdf: false,
      disabled: false,
      pdfOption: false,
      selectFile: "",
      category: "",
      source: null
    });

    const rules = {
      contractTemplateName: [
        { required: true, message: root.$t("请输入合同模版名称"), trigger: "blur" },
        // 合同模版名称左右两端不能有空格
        {
          validator: (rule, value, callback) => {
            if (value.trim() !== value) {
              callback(new Error(root.$t("合同模版名称左右两端不能有空格")));
            } else {
              callback();
            }
          },
          trigger: ['blur', 'change']
        },
        // 不允许输入特殊字符
        {
          validator: (rule, value, callback) => {
            if (/[#&？?]/.test(value)) {
              callback(new Error(root.$t("合同模版名称不能包含特殊字符 #、&、？")));
            } else {
              callback();
            }
          },
          trigger: ['blur', 'change']
        }
      ],
      subjectType: [
        { required: true, message: root.$t("请选择适用学科"), trigger: "change" }
      ],
      templateScope: [
        { required: true, message: root.$t("请选择适用范围"), trigger: "change" }
      ],
      contractType: [
        { required: true, message: root.$t("请选择合同类型"), trigger: "change" }
      ],
      contractDuration: [
        { required: true, message: root.$t("请输入合同周期"), trigger: "blur" },
        { 
          validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              callback(new Error(root.$t("请输入合同周期")));
            } else if (!Number.isInteger(value) || value <= 0) {
              callback(new Error(root.$t("请输入正整数")));
            } else if (value > 99) {
              callback(new Error(root.$t("周期过长，最多支持两位数")));
            } else {
              callback();
            }
          },
          trigger: ['blur', 'change']
        }
      ],
      validStartTime: [
        { required: true, message: root.$t("请选择生效时间"), trigger: "change" },
        { 
          validator: (rule, value, callback) => {
            if (isEffective.value) {
              callback();
              return;
            }
            if (!value) {
              callback(new Error(root.$t("请选择生效时间")));
            } else if (new Date(value).getTime() < Date.now()) {
              callback(new Error(root.$t("不支持选择过去时间")));
            } else {
              callback();
            }
          }, 
          trigger: "change" 
        }
      ],
      validEndTime: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback();
            } else {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              
              if (new Date(value).getTime() < tomorrow.getTime()) {
                callback(new Error(root.$t("失效时间不能选择今天，请从明天开始选择")));
              } else {
                callback();
              }
            }
          },
          trigger: "change"
        }
      ],
      attachmentAddr: [
        { required: true, message: root.$t("请上传合同附件"), trigger: "change" }
      ]
    };
    const formRef = ref(null);
    const fileList = ref([]);
    const isId=ref('')
    const contractTemplateNo=ref('')
    // 回显数据
    if (props.rowData) {
      form.contractTemplateName = props.rowData.contractTemplateName;
      form.subjectType = props.rowData.subjectType;
      form.templateScope = props.rowData.templateScope;
      form.contractType = props.rowData.contractType;
      form.contractDuration = props.rowData.contractDuration;
      form.validStartTime = props.rowData.validStartTime;
      form.validEndTime = props.rowData.validEndTime.includes('2099') ? '' : props.rowData.validEndTime;
      form.attachmentAddr = props.rowData.attachmentAddr;
      isId.value = props.rowData.id;
      contractTemplateNo.value = props.rowData.contractTemplateNo;
      if (props.rowData.attachmentAddr) {
        fileList.value = [{
          name: props.rowData.attachmentAddr || root.$t('合同文件.pdf'),
          url: props.rowData.attachmentAddr
        }];
        uploadState.selectFile = "pdf";
        uploadState.disabled = true;
      }
      // 是否是详情页 ==》全部禁用
      if(props.rowData && props.rowData.status === 0) {
        isDetails.value = true;
      }
      // 生效中==》只有失效时间可编辑
      if(props.rowData && props.rowData.status === 1) {
        isEffective.value = true;
        isDetails.value = true;
      }
    }
    
    const loading = ref(false);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const dialogTitle = computed(() => {
      if(props.isView) {
        return root.$t('查看合同模版');
      }
      return props.rowData ? root.$t('编辑合同模版') : root.$t('新建合同模版');
    });

    const subjectOptions = [
      { value: 0, label: "中文" },
      { value: 1, label: "英文" },
      { value: 2, label: "数学" }
    ];

    const scopeOptions = [
      { value: 0, label: "兼职教师" },
      { value: 1, label: "全职教师" },
      { value: 2, label: "全体教师" }
    ];

    const contractTypeOptions = [
      { value: 0, label: "员工合同" }
    ];

    const effectiveTimePickerOptions = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
      }
    };

    const handleEffectiveTimeChange = (val) => {
      if (val && new Date(val).getTime() < Date.now()) {
        form.validStartTime = ""; // 清空选择
        root.$message.warning(root.$t("不支持选择过去时间"));
      }
      // 每次修改生效时间时，清空失效时间
      form.validEndTime = "";
    };

    const pickerOptions = computed(() => ({
      disabledDate(time) {
        if (form.validStartTime) {
          // 禁用所有小于生效时间的日期，以及今天的日期
          const startTime = new Date(form.validStartTime).getTime();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return time.getTime() < startTime || time.getTime() < tomorrow.getTime();
        }
        return true;
      }
    }));

   

    const beforeUpload = (file) => {
      // 验证文件类型
      if (file.type !== "application/pdf") {
        root.$message.error(root.$t("仅支持上传PDF文件"));
        return false;
      }

      // 验证文件大小
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        root.$message.error(root.$t("上传的文件大于20MB，请编辑后重新上传！"));
        return false;
      }

      uploadState.category = "contractpdf";
      uploadState.selectFile = "pdf";
      uploadState.disabled = true;
      
      return true;
    };

    const handleExceed = (files, fileList) => {
      root.$message.warning(root.$t('最多只能上传1个文件'));
    };

    const handleFileChange = (file, fileList) => {
      if (fileList.length > 0) {
        form.attachmentAddr = file;
        uploadState.uploadFileArr = [file]; // 重置uploadFileArr数组
        if (uploadState.timers !== null) clearTimeout(uploadState.timers);
        uploadState.timers = setTimeout(() => {
          uploadFile(0);
        }, 1000);
      } else {
        form.attachmentAddr = null;
      }
      formRef.value.validateField('attachmentAddr');
    };

    // 添加文件上传函数
    const uploadFile = (i) => {
      const loading = root.$loading({
        lock: true,
        text: root.$t("上传文件中 ..."),
        color: "white",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      
      uploadState.imageFlag = true;
      uploadState.fileLoading = true;
      
      let fm = new FormData();
      let cancelToken = root.$Axios.CancelToken;
      uploadState.source = cancelToken.source();
      let e = uploadState.uploadFileArr[i];
      
      if (i === uploadState.uploadFileArr.length) {
        loading.close();
        uploadState.fileLoading = false;
        uploadState.uploadFileArr = [];
        return;
      }

      // fm.append("category", uploadState.category);
      fm.append("category", 'teacherContract');
      fm.append("file", e.raw);

      root.$Axios({
        method: "post",
        url: `${process.env.VUE_APP_BASE_API}/opsapi/usercenter-service/api/v1/pub/usercenter/ops/upload/api/uploadFile`,
        data: fm,
        headers: {
          "Content-type": "multipart/form-data",
          authorization: `Bearer ${JSON.parse(window.localStorage.getItem("userInfo")).jwtToken}`
        },
        cancelToken: uploadState.source.token
      }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          // 更新文件列表
          fileList.value = [{
            name: e.raw.name,
            url: data.data
          }];
          
          // 更新合同文件链接和状态
          form.attachmentAddr = data.data;
          uploadState.selectFile = "pdf";  // 确保设置文件类型为pdf
          uploadState.disabled = true;      // 禁用上传按钮
          
          loading.close();
          uploadState.fileLoading = false;
          uploadState.imageFlag = false;
          root.$message.success(root.$t("上传成功"));
          
          // 手动触发表单验证
          formRef.value.validateField('attachmentAddr');
        } else {
          uploadState.imageFlag = false;
          uploadState.fileLoading = false;
          loading.close();
          // 上传失败时清空文件列表
          fileList.value = [];
          form.attachmentAddr = null;
          uploadState.disabled = false;
          uploadState.selectFile = "";
          root.$notify({
            type: "error",
            message: root.$t("上传失败")
          });
        }
      }).catch(err => {
        uploadState.imageFlag = false;
        uploadState.fileLoading = false;
        loading.close();
        // 上传失败时清空文件列表
        fileList.value = [];
        form.attachmentAddr = null;
        uploadState.disabled = false;
        uploadState.selectFile = "";
        root.$notify({
          type: "error",
          message: root.$t("上传失败")
        });
        console.log(err);
      });
    };

    const handleRemove = () => {
      form.attachmentAddr = null;
      fileList.value = [];
      uploadState.uploadArr = [];
      uploadState.disabled = false;
      uploadState.selectFile = "";
      formRef.value.validateField('attachmentAddr');
    };

    const confirm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true;
          const params = {...form}
          if (props.rowData) {
            params.id = isId.value
            params.contractTemplateNo = contractTemplateNo.value
          }
          // 转换日期为ISO格式
          if (params.validStartTime) {
            params.validStartTime = new Date(params.validStartTime).toISOString();
          }
          if (params.validEndTime) {
            params.validEndTime = new Date(params.validEndTime).toISOString();
          }
          addContractTemplate(params).then(({ status, data: { code, data } }) => {
            if (status === 200 && code === 200) {
              props.rowData ? root.$message.success("编辑成功") : root.$message.success("添加成功");
              handleClose();
              emit("update-table");
              loading.value = false;
            } else {
              loading.value = false;
            }
          }).catch(() => {
            loading.value = false;
          })
        }
      });
    };

    const handleClose = () => {
      emit("update:visible", false);
      emit("close");
      formRef.value.resetFields();
      fileList.value = [];
      form.attachmentAddr = null;
    };

    const handleContractPeriodChange = (val) => {
      if (val > 99) {
        form.contractDuration = 99;
        root.$message.warning(root.$t("周期过长，最多支持两位数"));
      }
    };

    const handlePreviewPdf = (url) => {
      if (url) {
        window.open(url, '_blank');
      }
    };

    watch(() => props.visible, (newVal) => {
      if (newVal && props.rowData) {
        // Object.assign(form, props.rowData);
        if(props.isView) {
          isDetails.value = true;
        }
      }
    }, { immediate: true });

    return {
      currentLang,
      dialogTitle,
      form,
      rules,
      formRef,
      confirm,
      handleClose,
      subjectOptions,
      scopeOptions,
      contractTypeOptions,
      pickerOptions,
      effectiveTimePickerOptions,
      handleEffectiveTimeChange,
      handleFileChange,
      beforeUpload,
      handleExceed,
      handleRemove,
      handleContractPeriodChange,
      fileList,
      uploadState,
      handlePreviewPdf,
      loading,
      isDetails,
      isEffective,
      isId,
      contractTemplateNo
    };
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
.contract-name .el-input--small .el-input__inner{
  padding-right: 80px !important;
}
</style>
