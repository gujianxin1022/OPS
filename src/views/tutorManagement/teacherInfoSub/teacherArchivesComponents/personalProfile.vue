<template>
  <div>
    <div class="btn-box">
      <el-button
        v-show="isDisabled && Per.handleButtonPer('teach.tutorMT.teacherFile.allEditBtn')"
        @click="handleEditEvent"
      >
        {{$t('编辑')}}
      </el-button>
      <el-button
        v-show="!isDisabled"
        type="primary"
        @click="handleSave"
      >
      {{$t('preservation')}}
      </el-button>
      <el-button
        v-show="!isDisabled"
        @click="handleCancel"
      >
        {{$t('取消')}}
      </el-button>
    </div>
    <div class="panel-body">
      <el-form
        ref="personalProfile"
        :model="personalProfileForm"
        :label-width="currentLang === 'en' ? '250px' : '100px'"
      >
        <el-form-item :label="$t('中文简介')+':'">
          <el-input
            type="textarea"
            :rows="6"
            :disabled="isDisabled"
            :placeholder="$t('my-home-Select')+$t('中文简介')"
            v-model="personalProfileForm.descriptionZh"
          />
        </el-form-item>
        <el-form-item :label="$t('英文简介')+':'">
          <el-input
            type="textarea"
            :disabled="isDisabled"
            :rows="6"
            :placeholder="$t('my-home-Select')+$t('英文简介')"
            v-model="personalProfileForm.descriptionEn"
          />
        </el-form-item>
        <el-form-item :label="$t('法语简介')+':'">
          <el-input
            type="textarea"
            :disabled="isDisabled"
            :rows="6"
            :placeholder="$t('my-home-Select')+$t('法语简介')"
            v-model="personalProfileForm.descriptionFr"
          />
        </el-form-item>
        <el-form-item :label="$t('个人介绍海报')+':'">
          <UploadTeacherInfo
            ref="upload_1"
            mediaType="picture"
            accept="image/jpg, image/png, image/jpeg"
            :maxFileSize="20"
            :disabled="isDisabled"
            :id="$route.query.id"
            :domesticLink="personalProfileForm.posterFileUrl"
            :overseasLink="personalProfileForm.posterExternalFileUrl"
            @unpdate:domesticLink="val => personalProfileForm.posterFileUrl = val"
            @unpdate:overseasLink="val => personalProfileForm.posterExternalFileUrl = val"
          />
        </el-form-item>
        <el-form-item :label="$t('个人介绍视频')+':'">
          <UploadTeacherInfo
            ref="upload_2"
            mediaType="video"
            accept="video/mp4"
            :maxFileSize="300"
            :maxDuration="1.5"
            :disabled="isDisabled"
            :id="$route.query.id"
            :domesticLink="personalProfileForm.introduceFileUrl"
            :overseasLink="personalProfileForm.introduceExternalFileUrl"
            @unpdate:domesticLink="val => personalProfileForm.introduceFileUrl = val"
            @unpdate:overseasLink="val => personalProfileForm.introduceExternalFileUrl = val"
          />
          
        </el-form-item>
        <el-form-item :label="$t('授课样例片段')+':'">
          <UploadTeacherInfo
            ref="upload_3"
            mediaType="video"
            accept="video/mp4"
            :maxFileSize="300"
            :maxDuration="3.5"
            :disabled="isDisabled"
            :id="$route.query.id"
            :domesticLink="personalProfileForm.giveLessonsFileUrl"
            :overseasLink="personalProfileForm.giveLessonsExternalFileUrl"
            @unpdate:domesticLink="val => personalProfileForm.giveLessonsFileUrl = val"
            @unpdate:overseasLink="val => personalProfileForm.giveLessonsExternalFileUrl = val"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { markRaw, reactive, ref, unref, watch, computed, onMounted } from "@vue/composition-api";
import UploadTeacherInfo from '../components/UploadTeacherInfo.vue';

const domesticLinkKeys /* 三件套国内cdn域名对应的key */ = [
  "posterFileUrl",
  "introduceFileUrl",
  "giveLessonsFileUrl",
];
const overseasLinkKeys /* 三件套海外cdn域名对应的key */ = [
  "posterExternalFileUrl",
  "introduceExternalFileUrl",
  "giveLessonsExternalFileUrl",
];

const mediaRawData /* 三件套未修改前的数据，用于对比同步 */ = {
  ...Object.entries(domesticLinkKeys).reduce(
    (pre, [_, key]) => ((pre[key] = ""), pre),
    {}
  ),
};

export default {
  components: {UploadTeacherInfo},
  props: {
    tutorInfo: {type: Array, default: () => ({})},
    childIsUpdate: {type: Boolean, default: false},
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const personalProfileForm = reactive({
      realName: "", // 老接口必传参数
      working: "", // 老接口必传参数
      hide: "", // 老接口必传参数
      hideReason: "", // 老接口必传参数
      hideReasonRemark: "", // 老接口必传参数
      descriptionZh: "",
      descriptionEn: "",
      descriptionFr: "",
      ...Object.entries(domesticLinkKeys).reduce((pre, [_, key]) => (pre[key] = "", pre), {}),
      ...Object.entries(overseasLinkKeys).reduce((pre, [_, key]) => (pre[key] = "", pre), {}),
    });
    const currentLang = computed(() => root.$store.getters.currentLang);

    watch(
      () => props.childIsUpdate,
      (val) => {
        // console.log('更新个人简介: ', val);
        if (val) {
          updateComp()
        }
      }
    )

    const updateComp = () => {
      const newOBJ =  {
        realName: props.tutorInfo.realName,
        working: props.tutorInfo.working,
        hide: props.tutorInfo.hide,
        hideReason: props.tutorInfo.hideReason,
        hideReasonRemark: props.tutorInfo.hideReasonRemark,
        descriptionZh: props.tutorInfo.descriptionZh,
        descriptionEn: props.tutorInfo.descriptionEn,
        descriptionFr: props.tutorInfo.descriptionFr,
      };
      Object.assign(personalProfileForm, newOBJ);
      [...domesticLinkKeys].forEach(key => {
        mediaRawData[key] = props.tutorInfo[key];
        personalProfileForm[key] = props.tutorInfo[key];
      });
      [...overseasLinkKeys].forEach(key => {
        personalProfileForm[key] = props.tutorInfo[key];
      });
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }
    // 保存
    const handleSave = async () => {
      await validateUploadState();
      isDisabled.value = true; // 用来中断上传图片
      let mediaInfo = {};
      for (let key of domesticLinkKeys) {
        const value = personalProfileForm[key];
        mediaInfo[key] = value ? value.match(/(teacherInformation[a-zA-Z0-9_\/\.]*)/)[0] : ""
      }
      emit('updatePersonalProfile', {
        moduleName: 'personalProfile',
        moduleData: {
          ...mediaInfo,
          realName: personalProfileForm.realName,
          working: personalProfileForm.working,
          hide: personalProfileForm.hide,
          hideReason: personalProfileForm.hideReason,
          hideReasonRemark: personalProfileForm.hideReasonRemark,
          descriptionZh: personalProfileForm.descriptionZh,
          descriptionEn: personalProfileForm.descriptionEn,
          descriptionFr: personalProfileForm.descriptionFr,
        }
      });
    }
    // 编辑
    const handleEditEvent = () => {
      isDisabled.value = false;
    }
    // 取消
    const handleCancel = async () => {
      await validateUploadState();
      isDisabled.value = true; 
      emit('resetTeacherInfo');
    }
    /* S3同步资源到海外 */
    const syncS3Resources = () => {
      const params = {}
      for (let key of domesticLinkKeys) {
        const a = mediaRawData[key];
        const b = personalProfileForm[key];
        if (a !== b && b) {
          params[key] = b.match(/(teacherInformation[a-zA-Z0-9_\/\.]*)/)[0]
        }
      }
      const values = Object.values(params);
      if (values.length) {
        root.$Api.tutorManagement.syncS3Resources(values)
      }
    }
    const validateUploadState = async () => {
      if (domesticLinkKeys.some((_, i) => refs[`upload_${i + 1}`]["uploading"])) {
        await root.$confirm(
          root.$t("文件上传中, 是否取消本次上传"),
          root.$t('提示'),
          {
            confirmButtonText: root.$t("确定"),
            cancelButtonText: root.$t("取消"),
            type: "warning",
          }
        )
      }
    }

    return {
      isDisabled,
      personalProfileForm,
      currentLang,
      handleSave,
      handleEditEvent,
      handleCancel,
      syncS3Resources,
    }
  },




  // data() {
  //   return {
  //     isDisabled: true,
  //     personalProfileForm: {
  //       descriptionZh: "",
  //       descriptionEn: "",
  //       ...Object.entries(domesticLinkKeys).reduce((pre, [_, key]) => (pre[key] = "", pre), {}),
  //       ...Object.entries(overseasLinkKeys).reduce((pre, [_, key]) => (pre[key] = "", pre), {}),
  //     }
  //   }
  // },
  // computed: {
  //   ...mapGetters(['currentLang']),
  // },
  // methods: {
  //   // 点击编辑按钮
  //   handleEditEvent () {
  //     this.isDisabled = false;
  //   },
  //   // 取消
  //   async handleCancel () {
  //     await this.validateUploadState()
  //     // this.getTeacherUserInfo() // 获取老师详细信息
  //     this.isDisabled = true
  //   },
  //   /* S3同步资源到海外 */
  //   syncS3Resources () {
  //     const params = {}
  //     for (let key of domesticLinkKeys) {
  //       const a = mediaRawData[key];
  //       const b = this.personalProfileForm[key];
  //       if (a !== b && b) {
  //         params[key] = b.match(/(teacherInformation[a-zA-Z0-9_\/\.]*)/)[0]
  //       }
  //     }
  //     const values = Object.values(params)
  //     if (values.length) {
  //       this.$Api.tutorManagement.syncS3Resources(values)
  //     }
  //   },
  //   async validateUploadState () {
  //     if (domesticLinkKeys.some((_, i) => this.$refs[`upload_${i + 1}`]["uploading"])) {
  //       await this.$confirm(
  //         this.$t("文件上传中, 是否取消本次上传"),
  //         this.$t('提示'),
  //         {
  //           confirmButtonText: this.$t("确定"),
  //           cancelButtonText: this.$t("取消"),
  //           type: "warning",
  //         }
  //       )
  //     }
  //   },
  // }
}
</script>

<style lang='scss' scoped>
.btn-box {
  text-align: right;
  margin: 0 0 10px;
}
</style>