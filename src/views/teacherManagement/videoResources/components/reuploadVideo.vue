<template>
  <el-dialog
    :visible.sync="dialogVisible"
    center
    :close-on-click-modal="false"
    :title="$t('重新上传视频')"
    :before-close="closeReuploadVideo"
  >
    <el-upload
      class="avatar-uploader reupload"
      action="https://jsonplaceholder.typicode.com/posts/"
      accept="video/mp4"
      :disabled="videoDisabled"
      :show-file-list="false"
      :before-upload="videoValidate"
      :http-request="handleUpload"
    >
      <video
        v-if="uploadForm.url && videoFlag == false"
        ref="uploadVideo"
        :src="uploadForm.url"
        class="avatar"
        controls="controls"
      >
        {{$t('您的浏览器不支持视频播放')}}
      </video>
      <i v-else-if="uploadForm.url == '' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
      <el-progress
        v-if="videoFlag"
        type="circle"
        :percentage="videoUploadPercent"
        style="height: 178px; width:178px"
      />
    </el-upload>
    <p>{{$t('视频格式：.Mp4')}}</p>
    <p>{{$t('大小不超过500MB')}}</p>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="!(uploadForm.url && videoFlag == false)" :loading="reUploading" type="primary" @click="handleReUpload">{{$t('确认上传')}}</el-button>
      <el-button @click="closeReuploadVideo">{{$t('取消')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ref, reactive, toRefs } from '@vue/composition-api';
import { uploadVideoFun } from "./uploadVideoFun";

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    courseVideoId: {type: Number, default: -1}
  },
  setup(props, {root, emit, refs}) {
    const {
      uploadForm,
      uploadVideo,
      videoValidate,
      uploadVideoFile,
      closecCntroller,
    } = uploadVideoFun(root, refs);
    const reUploading = ref(false);

    // 关闭弹框
    const closeReuploadVideo = () => {
      uploadForm.url = '';
      uploadVideo.videoFlag = false;
      uploadVideo.videoDisabled = false;
      emit("update:dialogVisible", false);
      Object.keys(uploadForm).map(key => {
        uploadForm[key] = '';
      });
      closecCntroller();
    };

    // 确认上传
    const handleReUpload = () => {
      reUploading.value = true;
      root.$Api.teacherManagement.reupload({
        url: uploadForm.url,
        size: +uploadForm.size,
        duration: +uploadForm.duration,
        videoId: props.courseVideoId
      })
      .then(({data: {code, data}}) => {
        if (code === 200) {
          root.$notify({
            message: '上传成功',
            type: 'success'
          });
          uploadForm.url = '';
          uploadVideo.videoFlag = false;
          reUploading.value = false;
          emit("update:dialogVisible", false);
          emit("getTableData");
        } else {
          this.$notify({
            message: '上传失败',
            type: 'success'
          })
        }
      })
      .finally(() => {
        reUploading.value = false
      })
    };
    const handleUpload = async (file) => {
      const res = await uploadVideoFile(file);
      console.log(res)
      if (res && res.path && res.path.length) {
        await root.$Api.teacherManagement.reqRcloneVideo(res)
      }
    };

    return {
      ...toRefs(uploadVideo),
      uploadForm,
      handleReUpload,
      closeReuploadVideo,
      videoValidate,
      uploadVideoFile,
      handleUpload
    }
  },
}
</script>

<style lang="scss" scoped>
</style>