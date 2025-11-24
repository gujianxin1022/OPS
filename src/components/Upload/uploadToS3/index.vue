<template>
  <div class="upload-img-to-s3">
    <draggable
      :list="fileDataList"
      class="img-list"
      v-if="config.showImgList"
      :animation="200"
      :move="onMove"
    >
      <div class="img-warp" v-for="item in fileDataList" :key="item.uid">
        <div
          v-if="item.type.includes('image')"
          @mouseenter="item.mask = true"
          @mouseleave="item.mask = false"
        >
          <el-image
            style="width: 90px; height: 90px"
            :src="item.imgSrc"
            fit="contain"
            :preview-src-list="[item.imgSrc]"
          ></el-image>
          {{ item.mask }}
          <div class="mask" @click="handleRemove(item)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <!-- video -->
        <div
          style="text-align: center"
          v-else-if="item.type.includes('video')"
          @mouseenter="item.mask = true"
          @mouseleave="item.mask = false"
        >
          <img style="width: 50px; height: 50px" :src="videoIcon" alt="" />
          <div :title="item.name" class="fileName text-overflowTow">
            {{ item.name }}
          </div>
          <div class="mask" v-show="item.mask" @click="handleRemove(item)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <!-- audio -->
        <div
          style="text-align: center"
          v-else-if="item.type.includes('audio')"
          @mouseenter="item.mask = true"
          @mouseleave="item.mask = false"
        >
          <img style="width: 50px; height: 50px" :src="audioIcon" alt="" />
          <div :title="item.name" class="fileName text-overflowTow">
            {{ item.name }}
          </div>
          <div class="mask" v-show="item.mask" @click="handleRemove(item)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <!-- pdf -->
        <div
          style="text-align: center"
          v-else-if="item.type.includes('pdf')"
          @mouseenter="item.mask = true"
          @mouseleave="item.mask = false"
        >
          <img style="width: 50px; height: 50px" :src="pdfIcon" alt="" />
          <div :title="item.name" class="fileName text-overflowTow">
            {{ item.name }}
          </div>
          <div class="mask" v-show="item.mask" @click="handleRemove(item)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <!-- zip -->
        <div
          style="text-align: center"
          v-else-if="item.type.includes('zip')"
          @mouseenter="item.mask = true"
          @mouseleave="item.mask = false"
        >
          <img style="width: 50px; height: 50px" :src="zipIcon" alt="" />
          <div :title="item.name" class="fileName text-overflowTow">
            {{ item.name }}
          </div>
          <div class="mask" v-show="item.mask" @click="handleRemove(item)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <!-- 其他 -->
        <div
          style="text-align: center"
          v-else
          @mouseenter="item.mask = true"
          @mouseleave="item.mask = false"
        >
          <img style="width: 50px; height: 50px" :src="allTypeIcon" alt="" />
          <div :title="item.name" class="fileName text-overflowTow">
            {{ item.name }}
          </div>
          <div class="mask" v-show="item.mask" @click="handleRemove(item)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
      </div>
    </draggable>
    <el-upload
      class="upload-warp"
      :multiple="config.multiple"
      :limit="config.limit"
      :on-exceed="handleExceed"
      :file-list="fileDataList"
      :accept="config.accept"
      :http-request="handleUpload"
      :show-file-list="false"
      :before-upload="beforeUpload"
    >
      <span class="upload-btn" v-show="fileDataList.length < config.limit">
        <el-button id="upload" :loading="loading" size="small" type="text">{{
          loading ? $t("上传中...") : $t("点击上传")
        }}</el-button></span
      >
    </el-upload>
    <div slot="tip" style="color: #c0c4cc" class="el-upload__tip">
      {{ config.tips }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, onUnmounted } from "@vue/composition-api";
import axios from "axios";
import { validateFileSize } from "./verify";
let controllerImg /* 取消请求 */ = null;
import Draggable from "vuedraggable";
import allTypeIcon from "@/assets/fileType/通用文件.png";
import videoIcon from "@/assets/fileType/video.png";
import audioIcon from "@/assets/fileType/MP3图标.png";
import pdfIcon from "@/assets/fileType/PDF.png";
import zipIcon from "@/assets/fileType/文件_压缩包.png";

export default {
  components: { Draggable },
  props: {
    config: {
      type: Object,
      default: {},
    },
  },
  setup(props, { root, emit, refs }) {
    const fileDataList = ref([]);
    emit("changFileData", fileDataList.value);
    const defaultConfig = ref({
      showImgList: true,
      limit: 10,
      maxSize: 2,
      multiple: true,
      accept: "image/jpg, image/png, image/jpeg",
      tips: "",
      getSignFun:
        null /* 获取预签名地址(后端不同业务请求地址不同,so这里写活) */,
      pasteUpload: false /* 是否支持粘贴上传 */,
    });
    const config = props.config;
    onMounted(() => {
      Object.assign(defaultConfig.value, config);
      if (defaultConfig.value.pasteUpload) {
        document.addEventListener("paste", pasteFun);
      }
    });

    const handleRemove = (file) => {
      fileDataList.value = fileDataList.value.filter((e) => {
        return e.uid !== file.uid;
      });
      emit("changFileData", fileDataList.value);
    };
    const handleExceed = () => {
      root.$notify.warning(
        root.$t("当前限制选择$个文件").replace(`$`, props.config.limit)
      );
    };
    const loading = ref(false);
    const beforeUpload = async (file) => {
      await validateFileSize(file.size, defaultConfig.value.maxSize);
    };
    const base64Src = ref("");
    const fileToBase64 = async (file) => {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = async (e) => {
          base64Src.value = e.target.result;
          resolve(e.target.result);
        };
      });
    };
    const uploadImg = reactive({
      imageUploadPercent: 0,
      imageFlag: false,
      imgDisabled: false,
    });

    const currFilePath = ref("");
    const handleUpload = async ({ file }) => {
      try {
        loading.value = true;
        emit("setUploading", true);
        const nameSplitArr = file.name.split(".");
        const fileType = nameSplitArr[nameSplitArr.length - 1];
        const fileMsg = await props.config.getSignFun(fileType);
        currFilePath.value = fileMsg["filePath"];
        let imgSrc = await fileToBase64(file.raw || file);
        fileDataList.value.push({
          name: file.name,
          filePath: fileMsg["filePath"],
          imgSrc: imgSrc,
          mask: false,
          type: file.type,
        });
        let keys = Object.keys(fileMsg);
        let url = fileMsg[keys[0]];
        controllerImg = new AbortController();
        const res = await axios.put(url, file, {
          signal: controllerImg.signal,
          headers: { "Content-Type": file.type },
          onUploadProgress: ({ lengthComputable, loaded, total }) => {
            if (!lengthComputable) return;
            uploadImg.imageUploadPercent = ~~((loaded / total) * 100);
          },
        });
        uploadImg.imgDisabled = false;
        root.$notify.success(root.$t("上传成功"));
        emit("changFileData", fileDataList.value);
      } catch {
        root.$notify.error(root.$t("上传失败"));
      } finally {
        loading.value = false;
        emit("setUploading", false);
        Object.assign(uploadImg, { imageUploadPercent: 0, imageFlag: false });
      }
    };
    /* 粘贴上传 */
    const pasteFun = async (event) => {
      if (fileDataList.value.length >= defaultConfig.value.limit) {
        return handleExceed();
      }
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) return;
      await validateFileSize(file.size, defaultConfig.value.maxSize);
      handleUpload({ file });
    };
    /* 拖拽 */
    const onMove = () => {
      emit("changFileData", fileDataList.value);
    };
    onUnmounted(() => {
      if (defaultConfig.value.pasteUpload) {
        document.removeEventListener("paste", pasteFun);
      }
    });
    /* 暴露点击事件供不展示页面使用 */
    const triggerClick = () => {
      var element = document.getElementById("upload");
      element.click();
    };

    return {
      config: defaultConfig,
      fileDataList,
      loading,
      handleRemove,
      handleExceed,
      handleUpload,
      beforeUpload,
      onMove,
      triggerClick,
      allTypeIcon,
      videoIcon,
      audioIcon,
      pdfIcon,
      zipIcon,
    };
  },
};
</script>

<style scoped lang="scss">
.upload-img-to-s3 {
  .upload-warp {
    display: inline-block;
  }
  .img-list {
    display: inline-block;
    vertical-align: middle;
    .img-warp {
      display: inline-block;
      width: 100px;
      height: 100px;
      box-sizing: border-box;
      margin-right: 4px;
      position: relative;
      margin-top: 4px;
      padding: 5px;
      background: #fbfdff;
      border: 1px solid #c0ccda;
      border-radius: 4px;
      overflow: hidden;
      .fileName {
        width: 100%;
        height: 40px;
        margin-top: -10px;
        line-height: 20px;
        font-size: 11px;
        color: #989898;
      }
      .mask {
        width: 100%;
        height: 20px;
        line-height: 20px;
        background-color: rgba(0, 0, 0, 0.4);
        position: absolute;
        bottom: 0;
        left: 0;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        color: #fff;
      }
    }
  }
  .upload-btn {
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 4px;
    border: 1px dashed #c0ccda;
    line-height: 100px;
    background-color: #fbfdff;
  }
}
</style>
