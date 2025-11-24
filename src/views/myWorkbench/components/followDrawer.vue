<template>
  <!-- 学员Follow抽屉 -->
  <div class="student-follow-new">
    <p>{{ $t("跟进类型") }}</p>
    <div v-loading="loading">
      <div class="follow-type">
        <el-button
          :type="params.followType === item.id ? 'primary' : ''"
          v-for="(item,index) in followTypeList"
          :key="item.id"
          :class="index===3&&currentLang === 'en' ? 'btn-style':''"
          :style="currentLang === 'en' ?'margin-bottom:10px;':''"
          @click="params.followType = item.id"
        >{{ currentLang === "en" ? item.nameEn : item.nameZh }}</el-button>
      </div>
      <div class="textarea">
        <el-input
          type="textarea"
          :rows="15"
          :placeholder="$t('请填写沟通内容')"
          v-model="params.content"
          maxlength="1000"
          show-word-limit
          resize="none"
        >
        </el-input>
      </div>
    </div>

    <div class="footer">
      <el-button
        @click="close"
        type="text"
      >{{ $t("取消") }}</el-button>
      <el-button
        @click="submit"
        :disabled="!params.followType || params.content.length <= 0"
        :loading="loading"
        type="primary"
      >{{ $t("保存") }}</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch, ref,onMounted } from "@vue/composition-api";
import { getStorage } from "@/utils/handleStorage";
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
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const loading = ref(false);
    const followTypeList = reactive([
      { id: 1, nameZh: "日常沟通", nameEn: "Daily Communication" },
      { id: 2, nameZh: "课消沟通", nameEn: "Class Communication" },
      { id: 3, nameZh: "续费沟通", nameEn: "Renewals Communication" },
      { id: 4, nameZh: "转介绍沟通", nameEn: "Referral Communication" },
      { id: 5, nameZh: "学情沟通", nameEn: "Learning Communication" },
      { id: 6, nameZh: "家长反馈", nameEn: "Parent Feedback" },
    ]);
    const params = reactive({
      studentUserId: props.studentId,
      subjectTypeId: props.courseType,
      followType: null,
      content: "",
      createUserId: JSON.parse(getStorage("userInfo")).id,
      createUsername: JSON.parse(getStorage("userInfo")).username,
    });
    const resetForm = () => {
      params.followType = null;
      params.content = "";
    };
    const submit = async () => {
      loading.value = true;
      try {
        const {
          status,
          data: { code, message },
        } = await root.$Api.studentManagement.studentFollowInsert(params);
        if (status !== 200 || code !== 200) return Promise.reject();
        root.$message({
          message: root.$t(message),
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
        params.subjectTypeId = val;
      }
    );
    watch(
      () => props.isShow,
      (val) => {
        if (!val) {
          params.followType = null;
          params.content = "";
        }
      }
    );
     watch(
      () => props.studentId,
      (val) => {
       params.studentUserId = val;
      }
    );
    return {
      currentLang,
      loading,
      followTypeList,
      params,
      submit,
      close,
    };
  },
};
</script>

<style lang='scss' scoped>
.student-follow-new {
  height: 100%;
  padding: 0px 20px;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  .follow-type{
    .btn-style{
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
<style lang='scss'>
.student-follow-new {
  .el-input__count {
    right: 18px !important;
  }
}
</style>