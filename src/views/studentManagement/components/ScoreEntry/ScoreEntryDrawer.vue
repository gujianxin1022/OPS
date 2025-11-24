<template>
  <!-- 成绩录入 -->
  <div class="score-entry-warp">
    <div v-loading="loading">
      <el-form
        class="my-form"
        :rules="rules"
        ref="myForm"
        :model="formState"
        :label-width="isEn ? '180px' : '100px'"
      >
        <el-form-item :label="$t('考试日期')" prop="examDate">
          <el-date-picker
            :picker-options="pickerOptions"
            :default-value="new Date(Date.now())"
            v-model="formState.examDate"
            type="date"
            :placeholder="$t('请选择')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('考试类型')" prop="examTypeId">
          <el-select
            v-model="formState.examTypeId"
            filterable
            clearable
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in examTypesList"
              :key="item.value"
              :label="isEn ? item.nameEn : item.nameZh"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('总成绩')" prop="score">
          <el-input
            maxlength="20"
            v-model="formState.score"
            clearable
            :placeholder="$t('请输入')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('满分制')" prop="fullMarks">
          <el-input
            maxlength="20"
            v-model="formState.fullMarks"
            clearable
            :placeholder="$t('请输入')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('图片')" prop="scoreImageUrls">
          <UploadToS3
            class="upload-to-s3"
            style="display: inline-block"
            ref="UploadToS3"
            :config="config"
            @changFileData="uploadSuccessFun"
          />
        </el-form-item>
        <el-form-item :label="$t('其他说明')" prop="remarks">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            :rows="5"
            v-model="formState.remarks"
            clearable
            :placeholder="$t('请输入')"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="close" type="text">{{ $t("取消") }}</el-button>
      <el-button @click="submit" :loading="loading" type="primary">{{
        $t("保存")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  computed,
  watch,
  ref,
  onMounted,
} from "@vue/composition-api";
import { getStorage } from "@/utils/handleStorage";
import UploadToS3 from "@/components/Upload/uploadToS3";

export default {
  name: "studentData",
  props: {
    courseType: {
      type: Number,
      default: -1, // 0：中文 1：英文
    },
    studentId: {
      type: Number,
      default: -1,
    },
    parentUserId: {
      type: Number,
      default: -1,
    },
    operationType: { type: String, default: "" },
    currentRowData: {
      type: Object,
      default: {},
    },
  },
  components: { UploadToS3 },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loading = ref(false);
    const getSignUrl = async (fileType) => {
      /* 获取预签名函数 */
      const res = await root.$Api.financeManagement.reqPointsMallUploadSign({
        fileType: fileType,
      });
      return res;
    };
    const config = {
      accept: ".mov,.png,.jpeg,.gif",
      limit: 5,
      maxSize: 3,
      multiple: false,
      showImgList: true,
      getSignFun: getSignUrl,
      pasteUpload: false,
    };
    const { id, username } = JSON.parse(localStorage.userInfo);
    const mediaCdn = ref("");
    const reqMediaCdn = async () => {
      const res = await root.$Api.workBench.reWorkOrderConfig({
        userId: id,
      });
      mediaCdn.value = res.mediaCdn;
      let { scoreImageUrls } = props.currentRowData;
      if (scoreImageUrls && scoreImageUrls.length) {
        let arr = [];
        scoreImageUrls.forEach((e, i) => {
          arr.push({
            imgSrc: e,
            filePath: e.replace(mediaCdn.value, ""),
            uid: i,
            mask: false,
            type: "image",
          });
        });
        refs.UploadToS3.fileDataList = arr;
        console.log(arr);
        formState.value.scoreImageUrls = JSON.stringify(scoreImageUrls);
      } else {
        formState.value.scoreImageUrls = null;
      }
    };
    const examTypesList = ref([]);
    const reqExamTypes = async () => {
      const res = await root.$Api.studentManagement.reqExamTypes(
        props.courseType
      );
      examTypesList.value = res || [];
    };
    const uploadSuccessFun = async (fileList) => {
      let imgList = [];
      if (fileList && fileList.length) {
        fileList.forEach(async (e) => {
          imgList.push(`${mediaCdn.value}${e.filePath}`);
        });
        formState.value.scoreImageUrls = JSON.stringify(imgList);
      } else {
        formState.value.scoreImageUrls = null;
      }
    };
    const formState = ref({
      id: null,
      subjectTypeId: props.courseType,
      studentId: props.studentId - 0,
      parentId: props.parentUserId,
      examDate: "",
      examTypeId: "",
      score: "",
      fullMarks: "",
      remarks: "",
      scoreImageUrls: "",
      creatorId: id,
      creatorName: username,
    });
    const rules = reactive({
      examDate: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      examTypeId: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      score: {
        required: true,
        message: root.$t("请输入"),
        trigger: "change",
      },
    });
    const pickerOptions = reactive({
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
    });
    const resetForm = () => {};
    const submit = async () => {
      await refs["myForm"].validate();
      loading.value = true;
      let params = { ...formState.value };
      console.log(params.examDate);
      params.examDate = new Date(params.examDate).toISOString();
      try {
        if (props.operationType === "create") {
          await root.$Api.studentManagement.reqCreateScoreRecords(params);
        } else {
          await root.$Api.studentManagement.reqUpdateScoreRecords(params);
        }
        root.$message({
          message: root.$t("操作成功"),
          type: "success",
        });
        resetForm();
        emit("refresh");
      } finally {
        loading.value = false;
      }
    };
    const close = () => {
      resetForm();
      emit("close");
    };

    watch(
      () => props.courseType,
      (val) => {
        formState.subjectTypeId = val;
      }
    );
    watch(
      () => props.studentId,
      (val) => {
        formState.studentId = val;
      }
    );
    onMounted(() => {
      reqMediaCdn();
      reqExamTypes();
      if (props.operationType === "edit") {
        console.log(props.currentRowData);
        let {
          id,
          examDate,
          examTypeId,
          score,
          fullMarks,
          scoreImageUrls,
          remarks,
        } = props.currentRowData;
        formState.value.id = id;
        formState.value.examDate = examDate;
        formState.value.examTypeId = examTypeId;
        formState.value.score = score;
        formState.value.fullMarks = fullMarks;
        formState.value.remarks = remarks;
      }
    });
    return {
      isEn,
      loading,
      formState,
      submit,
      close,
      pickerOptions,
      config,
      rules,
      uploadSuccessFun,
      examTypesList,
    };
  },
};
</script>

<style lang="scss" scoped>
.score-entry-warp {
  height: 100%;
  padding: 0px 20px;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  .follow-type {
    .btn-style {
      margin-left: 0px;
    }
  }
  .textarea {
    margin-top: 30px;
  }
  .footer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
<style lang="scss">
.score-entry-warp {
  .el-input__count {
    right: 18px !important;
  }
}
</style>
