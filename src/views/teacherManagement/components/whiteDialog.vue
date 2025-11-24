<template>
  <div>
    <el-form :model="form" label-width="100px">
      <!-- 视频主题 -->
      <el-form-item :label="$t('视频主题')">
        <el-select
          v-model="form.courseTopicId"
          :placeholder="$t('请选择视频主题')"
          clearable
          @change="changeEdition"
        >
          <el-option
            v-for="item in videoList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 家长用户名 -->
      <el-form-item :label="$t('家长ID')">
        <el-input
          v-model="form.parentUserId"
          clearable
          :placeholder="$t('请输入家长ID')"
        ></el-input>
        <!-- 添加 -->
        <el-button
          :disabled="form.parentUserId === ''"
          type="primary"
          @click="addList"
          >{{ $t("添加到待新增集合") }}</el-button
        >
        <el-upload
          style="display: inline-block; margin-left: 10px"
          accept=".xls,.xlsx"
          :http-request="upload"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <el-button :loading="loading">{{ $t("批量导入") }}</el-button>
        </el-upload>
      </el-form-item>
      <!-- tag -->
      <el-form-item label="">
        <div class="tag-top">
          <el-tag
            style="margin-right: 5px"
            :key="tag"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="deleteTag(tag)"
            :type="errTagsStr.includes(`,${tag},`) ? 'danger' : ''"
          >
            {{ tag }}
          </el-tag>
        </div>
        <!-- 清空 -->
        <div class="tag-bottom">
          <el-button type="primary" @click="deleteList">{{
            $t("清空集合")
          }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    form: {
      type: Object,
      default: null,
    },
    tags: {
      type: Array,
      default: null,
    },
    errTags: {
      type: Array,
      default: null,
    },
    videoList: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      requestUrl: `${process.env.VUE_APP_BASE_API_DISCOVER}/discover/course/video/excel/parent/name/export `,
      importParentList: [],
      errTagsStr: "",
    };
  },
  watch: {
    errTags: function (errTags) {
      this.errTagsStr = "," + errTags.join(",") + ","; //存在用户名123456和123如此包含关系，前后加分逗号以区分。
    },
  },
  methods: {
    // 下拉
    changeEdition(val) {
      this.$emit("changeEdition", val);
    },
    // 添加tag
    addList() {
      this.$emit("addList", this.form.parentUserId);
    },
    // 删除全部tag
    deleteList() {
      this.$emit("deleteList", []);
    },
    //删除单个tag
    deleteTag(val) {
      this.$emit("deleteTag", val);
    },
    // 批量导入
    upload(e) {
      const header = {
        "Content-type": "multipart/form-data",
        authorization: `Bearer ${
          JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
        }`,
      };
      this.loading = true;
      let _this = this;
      let cancelToken = this.$Axios.CancelToken;
      this.source = cancelToken.source();
      let fm = new FormData();
      fm.append("fileName", e.file);
      this.$Axios({
        method: "post",
        url: this.requestUrl,
        data: fm,
        responseType: "application/json",
        headers: header,
        cancelToken: _this.source.token,
      })
        .then((res) => {
          if (res.data.code === 200 && res?.data?.data) {
            _this.$message({
              message: _this.$t("导入成功"),
              type: "success",
            });
            _this.importParentList = [
              ...res.data.data?.notHasParentUserNames||[],
              ...res.data.data?.hasParentUserNames||[],
            ];
            _this.$emit("importList", _this.importParentList || []);
          } else {
            _this.$message({
              message: _this.$(res.data.message),
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$notify({
            message: err.message,
            type: "error",
          });
        })
        .finally((_) => {
          this.loading = false;
        });
    },
    beforeUpload(file) {
      if (file.size > 1024 * 1024 * 1024 * 2) {
        this.$notify({
          message: this.$t("上传的文件大于2M，请编辑后重新上传！"),
          type: "warning",
        });
        return false;
      }
      const [tail, ...rest] = [...file.name.split(".")].reverse();
      const typeStr = "xls,xlsx,XLS,XLSX";
      const isAllowType = typeStr.includes(tail);
      if (!isAllowType) {
        this.$notify({
          message: this.$t("格式错误,仅支持xls、xlsx格式"),
          type: "warning",
        });
        return isAllowType;
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-input,
.el-option {
  margin-right: 10px;
  width: 300px;
}
.tag-top {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  width: 700px;
  margin-right: 15px;
  float: left;
  height: 300px;
  overflow: scroll;
}
</style>
