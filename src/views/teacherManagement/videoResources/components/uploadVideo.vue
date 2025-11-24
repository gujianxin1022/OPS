<template>
  <div>
    <el-dialog
      class="uploadVideoDialog"
      :visible.sync="dialogVisible"
      :before-close="handleCancelUpload"
      top="8vh"
      width="580px"
      center
      :close-on-click-modal="false"
      :title="$t('上传视频')"
    >
      <div
        class="portWrap"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="加载中"
        element-loading-background="rgba(20, 34, 58, 0.8)"
      >
        <div class="upload-video-wrap">
          <el-form
            ref="uploadForm"
            :model="uploadForm"
            label-width="120px"
            :rules="uploadRules"
          >
            <div class="upload-box">
              <el-form-item :label="$t('上传视频封面')" prop="poster">
                <el-tooltip
                  :content="$t('图片格式：JPG/PNG/JPEG; 大小不超过3MB')"
                  placement="top"
                  @click.stop.prevent
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                <el-upload
                  class="avatar-uploader"
                  accept="image/jpeg, image/jpg, image/png"
                  :disabled="imgDisabled"
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                  :http-request="uploadImage"
                >
                  <el-progress
                    v-if="imageFlag"
                    type="circle"
                    :percentage="imageUploadPercent"
                    style="height: 178px; width: 178px"
                  />
                  <img
                    v-if="uploadForm.poster"
                    :src="uploadForm.poster"
                    class="avatar"
                  />
                  <i
                    v-if="!uploadForm.poster && !imageFlag"
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </el-upload>
              </el-form-item>
              <el-form-item
                v-if="!isEdit"
                :label="$t('上传视频文件')"
                prop="url"
              >
                <el-tooltip
                  :content="$t('视频格式：MP4; 大小不超过500MB')"
                  placement="top"
                  @click.stop.prevent
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                <el-upload
                  class="avatar-uploader"
                  accept="video/mp4"
                  :disabled="videoDisabled"
                  :show-file-list="false"
                  :before-upload="videoValidate"
                  :http-request="handleUpload"
                >
                  <el-progress
                    v-if="videoFlag"
                    type="circle"
                    :percentage="videoUploadPercent"
                    style="height: 178px; width: 178px"
                  />
                  <video
                    ref="uploadVideo"
                    v-if="uploadForm.url && videoFlag == false"
                    :src="uploadForm.url"
                    class="avatar"
                    controls="controls"
                  >
                    {{ $t("您的浏览器不支持视频播放") }}
                  </video>
                  <i
                    v-else-if="!uploadForm.url && !videoFlag"
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </el-upload>
              </el-form-item>
            </div>
            <el-divider><i class="el-icon-upload"></i></el-divider>
            <el-form-item :label="$t('视频名称')" prop="title">
              <el-input
                style="width: 350px"
                v-model.trim="uploadForm.title"
                :placeholder="$t('请输入视频名称')"
              />
            </el-form-item>
            <el-form-item :label="$t('英文名称')" prop="titleEn">
              <el-input
                style="width: 350px"
                v-model.trim="uploadForm.titleEn"
                :placeholder="$t('请输入英文名称')"
              />
            </el-form-item>
            <el-form-item :label="$t('视频描述')" prop="introduction">
              <el-input
                style="width: 350px"
                type="textarea"
                autosize
                maxlength="500"
                show-word-limit
                :placeholder="$t('请输入描述文案')"
                v-model="uploadForm.introduction"
              />
            </el-form-item>
            <el-form-item :label="$t('英文描述')" prop="introductionEn">
              <el-input
                style="width: 350px"
                type="textarea"
                autosize
                maxlength="500"
                show-word-limit
                :placeholder="$t('请输入英文描述文案')"
                v-model="uploadForm.introductionEn"
              />
            </el-form-item>
            <el-form-item
              v-show="uploadForm.url"
              :label="$t('视频格式')"
              prop="format"
            >
              <el-input
                style="width: 350px"
                v-model.trim="uploadForm.format"
                disabled
                :placeholder="$t('请输入')"
              />
            </el-form-item>
            <el-form-item
              v-show="uploadForm.url"
              :label="$t('比特率')"
              prop="codeRate"
            >
              <el-input
                style="width: 350px"
                v-model.trim="uploadForm.codeRate"
                disabled
                :placeholder="$t('请输入')"
              >
                <template slot="append">kbps</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-show="uploadForm.url"
              :label="$t('分辨率')"
              prop="resolution"
            >
              <el-input
                style="width: 350px"
                v-model.trim="uploadForm.resolution"
                disabled
                :placeholder="$t('请输入')"
              />
            </el-form-item>
            <el-form-item
              v-if="uploadForm.useType && uploadForm.useType === 4"
              :label="$t('视频主题')"
              prop="courseTopicIds"
            >
              <el-select
                style="width: 350px"
                v-model="uploadForm.courseTopicIds"
                multiple
                clearable
                :placeholder="$t('请选择')"
              >
                <el-option
                  v-for="item in videoTypesOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                uploadForm.useType && [1, 2, 3].includes(uploadForm.useType)
              "
              :label="$t('关联课程树')"
              prop="couresTree"
            >
              <el-cascader
                v-model="uploadForm.couresTree"
                :options="couresTreeList"
                :props="cascaderProps"
                :placeholder="$t('请选择课程树')"
                clearable
                style="width: 350px"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="upalodLoading"
          @click="handleSureUpload()"
          >{{ !isEdit ? $t("确认上传") : $t("确认保存") }}</el-button
        >
        <el-button @click="handleCancelUpload()">{{ $t("取消") }}</el-button>
      </span>
    </el-dialog>
    <LessonTreeTips
      v-if="tipsDialogVisible"
      :dialogVisible.sync="tipsDialogVisible"
      :tipsDialogData="tipsDialogData"
      :tipsUseType="tipsUseType"
      @repeatFun="handleSureUpload"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted, toRefs, watch } from "@vue/composition-api";
import { uploadVideoFun } from "./uploadVideoFun";
import { hooksFun } from "./hooks";
import axios from "axios";
import LessonTreeTips from "./lessonTreeTips.vue";

let controllerImg /* 取消请求 */ = null;

export default {
  components: { LessonTreeTips },
  props: {
    dialogVisible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    currentEditViode: { type: Object, default: () => ({}) },
    videoTypesOptions: { type: Array, default: () => [] },
    couresTreeList: { type: Array, default: () => [] },
  },
  setup(props, { root, emit, refs }) {
    const {
      uploadForm,
      uploadVideo,
      uploadRules,
      videoValidate,
      uploadVideoFile,
      validateFileType,
      validateFileSize,
      closecCntroller,
    } = uploadVideoFun(root, refs);
    const upalodLoading = ref(false);
    const uploadImg = reactive({
      imageUploadPercent: 0,
      imageFlag: false,
      imgDisabled: false,
    });
    const cascaderProps = { multiple: true };
    const loading = ref(false);
    const tipsDialogVisible = ref(false);
    const tipsDialogData = ref([]);
    const tipsUseType = ref("");
    const copyData = reactive({
      themeVal: [],
      lessonVal: [],
    });
    uploadForm.useType = 4;
    watch(
      () => uploadForm.useType,
      (val) => {
        val === 4
          ? (uploadForm.couresTree = copyData.lessonVal)
          : (uploadForm.courseTopicIds = copyData.themeVal);
      }
    );

    // 判断课程是否有绑定视频
    const judgeLessonBinding = async (arr) => {
      if (arr && arr.length) {
        const {
          data: { code, data },
        } = await root.$Api.teacherManagement.lessonBinding(arr);
        if (code === 200) {
          if (data && data.length) {
            tipsDialogVisible.value = true;
            tipsDialogData.value = data;
          }
        }
      }
    };
    // 确定上传 & 确认保存
    const handleSureUpload = (val) => {
      refs["uploadForm"].validate(async (valid) => {
        if (valid) {
          uploadForm.lessonIds = [];
          if (uploadForm.useType !== 4 && uploadForm?.couresTree.length) {
            uploadForm?.couresTree.forEach((item) => {
              uploadForm.lessonIds.push(item[item.length - 1]);
            });
            // 用途不为教辅时，清空主题
            uploadForm.courseTopicIds = [];
          }
          // 子组件触发上传，不需要触发该方法
          if (val !== "child") {
            tipsUseType.value = uploadForm.useType;
            await judgeLessonBinding(uploadForm.lessonIds);
            if (tipsDialogVisible.value) return;
          }
          upalodLoading.value = true;
          let interApi = !props.isEdit
            ? root.$Api.teacherManagement.insertVideo(uploadForm)
            : root.$Api.teacherManagement.editVideo(uploadForm);
          interApi.then(({ status, data }) => {
            if (status == 200 && data.code == 200) {
              !props.isEdit
                ? root.$notify({ type: "success", message: "上传成功" })
                : root.$notify({
                    type: "success",
                    message: "修改视频信息成功",
                  });
              handleCancelUpload();
              emit("getTableData");
            }
            upalodLoading.value = false;
          });
        }
      });
    };
    // 关闭弹框
    const handleCancelUpload = () => {
      uploadImg.imgDisabled = false;
      uploadVideo.videoDisabled = false;
      emit("update:dialogVisible", false);
      refs["uploadForm"].resetFields();
      Object.keys(uploadForm).map((key) => {
        uploadForm[key] = "";
      });
      emit("clearCurrentEditViode");
      closecCntroller();
      setTimeout(() => {
        controllerImg?.abort();
      }, 300);
    };
    // 图片上传校验
    const beforeImageUpload = async (file) => {
      await validateFileType(file.name, ["jpeg", "jpg", "png"]);
      await validateFileSize(file.size, 3);
    };
    // 获取预签名URL
    const getSignUrl = async (fileType) => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.teacherManagement.getS3Url(fileType);
      if (status !== 200 || code !== 200) return Promise.reject();
      return data;
    };
    // 上传图片
    const uploadImage = async ({ file }) => {
      try {
        uploadImg.imageFlag = true;
        uploadImg.imgDisabled = true;
        uploadForm.poster = "";
        const nameSplit = file.name.split(".");
        const fileMsg = await getSignUrl(nameSplit[nameSplit.length - 1]);
        let keys = Object.keys(fileMsg);
        let url = fileMsg[keys[0]];
        controllerImg = new AbortController();
        await axios.put(url, file, {
          signal: controllerImg.signal,
          headers: { "Content-Type": file.type },
          onUploadProgress: ({ lengthComputable, loaded, total }) => {
            if (!lengthComputable) return;
            uploadImg.imageUploadPercent = ~~((loaded / total) * 100);
          },
        });
        uploadForm.poster = `${process.env.VUE_APP_UPLOAD_CDN_VIDEO_IMG}${keys[0]}`;
        uploadImg.imgDisabled = false;
        refs.uploadForm.validateField("poster");
        root.$message.success("上传成功");
      } catch {
        root.$message.error("上传失败");
      } finally {
        Object.assign(uploadImg, { imageUploadPercent: 0, imageFlag: false });
      }
    };
    // 获取编辑数据
    const getEditData = () => {
      if (!props.isEdit) return;
      loading.value = true;
      root.$Api.teacherManagement
        .getVideoMsg(props.currentEditViode.id)
        .then(({ data: { code, data } }) => {
          if (code === 200) {
            if (data.courseIds && data.courseIds.length) {
              let couresTree = data.courseIds.reduce((pre, cur) => {
                pre.push({
                  editionId: cur.courseEditionId,
                  levelId: cur.courseId,
                  id: cur.id,
                });
                return pre;
              }, []);
              data.couresTree = couresTree.reduce((pre, cur) => {
                let newArr = [];
                Object.keys(cur).forEach((item) => newArr.push(cur[item]));
                pre.push(newArr);
                return pre;
              }, []);
            }
            copyData.themeVal = data?.courseTopicIds;
            copyData.lessonVal = data?.couresTree;
            Object.assign(uploadForm, data);
            if (data.resolutionWidth && data.resolutionHeight) {
              uploadForm.resolution = `${data.resolutionWidth} x ${data.resolutionHeight}`;
            }
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    onMounted(async () => {
      await getEditData();
    });
    const handleUpload = async (file) => {
      const res = await uploadVideoFile(file);
      if (res && res.path && res.path.length) {
        await root.$Api.teacherManagement.reqRcloneVideo(res)
      }
    };

    return {
      ...toRefs(uploadImg),
      ...toRefs(uploadVideo),
      uploadForm,
      uploadRules,
      loading,
      tipsDialogVisible,
      tipsDialogData,
      tipsUseType,
      videoValidate,
      uploadVideoFile,
      handleUpload,
      handleSureUpload,
      handleCancelUpload,
      uploadImage,
      beforeImageUpload,
      cascaderProps,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-box {
  display: flex;
  justify-content: space-between;
  ::v-deep .el-form-item--small {
    .el-form-item__content {
      margin-left: 20px !important;
    }
  }
}

.uploadVideoDialog {
  ::v-deep .el-textarea {
    .el-input__count {
      bottom: 1px;
      height: 30px;
    }
  }

  ::v-deep .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
}
</style>
