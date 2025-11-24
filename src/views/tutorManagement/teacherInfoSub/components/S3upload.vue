<template>
  <div class="upload_img">
    <div class="img_list">
      <template v-if="imgList.length">
        <div style="display: inline-block">
          <div class="img_box" v-for="(item, index) in imgList" :key="index">
            <el-image
              style="width: 150px; height: 150px"
              :src="item"
              :preview-src-list="[item]"
            />
            <span v-if="!disabled" class="del_btn" @click="handleRemove(index)">
              {{ $t("删除") }}
            </span>
          </div>
        </div>
      </template>
      <el-upload
        v-if="!disabled && imgList.length !== limit"
        class="custom-upload"
        :accept="accept"
        :disabled="disabled || imgList.length === limit"
        :multiple="false"
        :before-upload="handleBeforeUpload"
        :http-request="handleUploadFile"
        :show-file-list="false"
      >
        <div
          :class="
            disabled || imgList.length === limit
              ? 'disabled add_num'
              : 'add_num'
          "
        >
          <i class="el-icon-plus"></i>
          <span class="img_num">{{ imgList.length }} / {{ limit }}</span>
        </div>
      </el-upload>
    </div>
    <el-progress v-if="uploading" :percentage="progress" />
    <div class="tips-text">
      {{
        $t("限$1格式，上限$2")
          .replace("$1", "jpg、png")
          .replace("$2", `${maxFileSize}M`)
      }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  toRefs,
  reactive,
  ref,
  onBeforeUnmount,
  watch,
  computed,
  onMounted,
} from "@vue/composition-api";

let controller /* 取消请求 */ = null;

export default {
  props: {
    id: { type: String, default: null }, // 用于生成唯一文件名
    multiple: { type: Boolean, default: false }, // 同时上传多个
    limit: { type: Boolean, default: void 0 }, // 最多上传几个
    maxFileSize: { type: Boolean, default: void 0 }, // 文件大小MB
    field: { type: String, default: null }, // 上传后图片返回字段
    imgList: { type: Array, default: () => [] }, // 图片路径
    disabled: { type: Boolean, default: false },
    accept: { type: String, default: null },
  },
  setup(props, { root, emit, refs }) {
    // const filesList = ref([]);
    const uploadState = reactive({ progress: 0, uploading: false });

    const {
      // validateFileType,
      validateFileSize,
    } = useValidate(props, root);

    // 上传前校验
    const handleBeforeUpload = async (file) => {
      // await validateFileType(file.type);
      await validateFileSize(file.size);
    };
    // 获取预签名URL
    const getSignUrl = async (extension) => {
      const fileName = `${props.id}_${Date.now()}.${extension}`;
      const {
        status,
        data: { code, data },
      } = await root.$Api.tutorManagement.getS3SignUrl(fileName);
      if (status !== 200 || code !== 200) return Promise.reject();
      return data;
    };

    // 上传图片
    const handleUploadFile /* 上传文件 */ = async ({ file }) => {
      try {
        uploadState.uploading = true;
        const nameSplit = file.name.split(".");
        const url = await getSignUrl(nameSplit[nameSplit.length - 1]);
        controller = new AbortController();
        await axios.put(url, file, {
          signal: controller.signal,
          headers: { "Content-Type": file.type },
          onUploadProgress: ({ lengthComputable, loaded, total }) => {
            if (!lengthComputable) return;
            uploadState.progress = ~~((loaded / total) * 100);
          },
        });
        root.$message.success(root.$t("上传成功"));
        props.imgList.push(url.split("?")[0]);
        emit("imgUrl", {
          field: props.field,
          imgUrl: props.imgList,
        });
      } catch (err) {
        root.$message.error(root.$t("上传失败"));
      } finally {
        Object.assign(uploadState, { progress: 0, uploading: false });
      }
    };
    // 删除图片
    const handleRemove = (index) => {
      console.log("index: ", index);
      props.imgList.splice(index, 1);
      emit("imgUrl", {
        field: props.field,
        imgUrl: props.imgList,
      });
    };
    watch(
      () => props.disabled,
      (val) => {
        val && controller?.abort();
      }
    );

    onBeforeUnmount(() => void controller?.abort());
    return {
      ...toRefs(uploadState),
      handleBeforeUpload,
      handleRemove,
      handleUploadFile,
    };
  },
};

const useValidate = (props, root) => {
  // const validateFileType /* 校验文件类型 */ = (fileType) => {
  //   // console.log('fileType: ', fileType);
  //   if (props.accept.includes(fileType)) return;
  //   root.$message.error(root.$t("暂不支持此类型的文件"));
  //   return Promise.reject();
  // };

  const validateFileSize /* 校验文件大小 */ = (fileSize) => {
    const { maxFileSize } = props;
    if (fileSize / 1024 / 1024 <= maxFileSize) return;
    const msg = root.$t("上传的文件大于$M，请编辑后重新上传");
    root.$message.error(msg.replace("$", maxFileSize));
    return Promise.reject();
  };

  return {
    // validateFileType,
    validateFileSize,
  };
};
</script>

<style lang="scss" scoped>
.upload_img {
  .img_list {
    display: flex;
    flex-wrap: wrap;
    .img_box {
      position: relative;
      margin: 0 10px 10px 0;
    }
    .del_btn {
      position: absolute;
      right: 0;
      top: 0;
      padding: 5px 10px;
      background: #13ce66;
      color: #fff;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
    }
    .isSHow {
      display: none;
    }
  }
  .upload_box {
    display: inline-block;
  }
  .add_num {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 10px;
    font-size: 28px;
    .img_num {
      margin: 10px 0 0;
      line-height: 1;
      font-size: 18px;
    }
  }
  .disabled {
    background: rgba($color: #f5f7fa, $alpha: 0.8);
    color: #d9d9d9;
  }
}
</style>
