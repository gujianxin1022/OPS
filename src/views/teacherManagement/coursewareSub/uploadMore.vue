<template>
  <div class="upload-more-wrap">
    <div class="top-course-select-wrap">
      <el-select
        style="width:130px"
        v-model="courseEditionId"
        :placeholder="$t('版本')"
        @change="changeEdition"
      >
        <el-option
          v-for="item in editionListData"
          :label="item.editionId | mapEdtion"
          :value="item.editionId"
          :key="item.editionId"
        ></el-option>
      </el-select>
      <el-select
        style="width:100px"
        v-model="courseLevel"
        :placeholder="$t('级别')"
        @change="changeLevel"
      >
        <el-option
          v-for="item in levelList"
          :label="item.courseName"
          :value="item.courseLevel"
          :key="item.courseName"
        ></el-option>
      </el-select>
      <el-select
        style="width:100px"
        v-model="unitNo"
        :placeholder="$t('单元')"
        @change="changeUnit"
      >
        <el-option
          v-for="item in unitList"
          :key="item.id"
          :label="strUnit(item.unitNo)"
          :value="item.unitNo"
        ></el-option>
      </el-select>
      <el-select style="width:100px" v-model="type" @change="changeUnit">
        <el-option
          v-for="(item, index) in typeList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button-group>
        <el-button
          @click="changeLessonId(item.value)"
          v-for="item in lessonList"
          :key="item.value"
          :type="item.value == lessonId ? 'primary' : ''"
          >{{ item.label }}</el-button
        >
      </el-button-group>
    </div>
    <div class="upload-wrap">
      <el-progress
        class="mb20"
        v-show="percentage > 0"
        :text-inside="true"
        :stroke-width="15"
        :percentage="percentage"
        :format="format"
        :status="processStatus"
      ></el-progress>
      <el-upload
        class="upload-demo"
        :http-request="handleUpdateFile"
        ref="upload"
        :auto-upload="false"
        drag
        :before-upload="beforeUpload"
        action="https://upload.api.lingoace.net/uploadapi/batch/uploadCourseWare"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("将文件拖到此处，或") }}<em>{{ $t("选择文件") }}</em>
        </div>
        <div class="el-upload__tip">
          {{ $t("支持扩展名：ppt、pptx、pdf、zip") }}
        </div>
        <div class="el-upload__tip" style="color: #de858e">
          {{ $t("文件命名请务必规范，格式为 “")
          }}<span style="color: red">{{
            $t("课件类型-课件名称.文件格式")
          }}</span
          >{{ $t("”，识别失败将无法上传") }}
        </div>
      </el-upload>
      <el-button
        @click="submitUpload"
        class="mt10 mb10"
        v-show="!uploadLoading"
        :loading="uploadLoading"
        >{{
          uploadLoading ? `${$t("上传中...")}` : `${$t("开始上传")}`
        }}</el-button
      >
      <el-button @click="cancelUpload" v-show="uploadLoading" class="mt10">{{
        $t("取消上传")
      }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "uploadMore",
  data() {
    return {
      percentage: 0,
      processStatus: "",
      fileList3: [],
      fileData: "",
      courseEditionId: 1,
      courseLevel: 1,
      unitNo: 1,
      lessonId: "",
      files: [],
      type: 2,
      editionListData: [],
      levelList: [],
      unitList: [],
      lessonList: [],
      typeList: [],
      uploadForm: new FormData(),
      uploadLoading: false,
      source: null
    };
  },
  computed: {
    ...mapGetters(["currentLang"])
  },
  methods: {
    initData() {
      this.typeList = [
        { label: `${this.$t("覆盖更新")}`, value: 2 },
        { label: `${this.$t("归档")}`, value: 1 }
      ];
    },
    beforeUpload(file) {
      // console.log(this.files,1111111)
      // var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
      // const extension = testmsg === 'mp4'
      // const extension2 = testmsg === 'gif'
      // // const isLt2M = file.size / 1024 / 1024 < 10
      // if(!extension && !extension2) {
      //   this.$notify({
      //     message: '上传文件只能是 xls、xlsx格式!',
      //     type: 'warning'
      //   })
      // }
      // return extension || extension2
    },
    format(percentage) {
      if (percentage === 100 && this.processStatus === "exception") {
        return "上传失败";
      } else {
        return `${percentage}%`;
      }
    },
    changeEdition(val) {
      this.levelList = [];
      this.unitList = [];
      this.lessonList = [];
      this.courseLevel = "";
      this.unitNo = "";
      this.lessonId = "";
      this.editionListData.forEach(item=>{
        if(item.editionId==val){
            this.levelList=item.courseLevelInfoList
        }
      })
    },
    changeLevel(val) {
      this.unitList = [];
      this.lessonList = [];
      this.unitNo = "";
      this.lessonId = "";
      this.levelList.forEach(item=>{
        if(item.courseLevel==val){
          this.unitList=item.courseUnitList
        }
      })
    },
    changeUnit() {
      this.lessonList = [];
      this.lessonId = "";
      this.$Api.base
        .getLessonList(this.courseEditionId, this.courseLevel, this.unitNo)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200 && data.data.length != 0) {
            data.data.forEach(item => {
              item.label = `lesson ${item.lessonNo}`;
              item.value = item.id;
            });
            this.lessonList = data.data;
          } else {
            this.lessonList = [];
          }
        });
    },
    changeLessonId(lessonId) {
      this.lessonId = lessonId;
      this.percentage = 0;
      this.$refs.upload.clearFiles();
      this.uploadForm = this.$options.data().uploadForm;
      this.files = [];
    },
    strUnit(unit) {
      return `unit${unit}`;
    },
    resetUploadStatus() {
      this.percentage = 0; // 重置进度条
      this.files = []; // 清空文件列表
      this.$refs.upload.clearFiles(); // 清空dom文件列表
      this.uploadForm = this.$options.data().uploadForm; // 清空 uploadform
      this.uploadLoading = false;
    },
    cancelUpload() {
      if (this.source) {
        this.source.cancel(`${this.$t("取消成功")}`);
        this.resetUploadStatus();
      }
    },
    // 上传文件事件
    submitUpload() {
      this.$refs.upload.submit(); // 触发添加文件事件

      let _this = this;
      let cancelToken = this.$Axios.CancelToken; //axios cancel token
      this.source = cancelToken.source();

      if (this.files.length == 0) {
        this.$notify({
          message: this.$t("请先上传文件"),
          type: "warning"
        });
        return;
      }

      let filesrule = "ppt、pptx、pdf、zip";

      let flag = this.files.every(item =>
        filesrule.includes(item.name.substring(item.name.lastIndexOf(".") + 1))
      );
      if (!flag) {
        this.$notify({
          message: this.$t("请上传ppt、pptx、pdf、zip类型的文件"),
          type: "warning"
        });
        return;
      }

      this.processStatus = ""; // 进度条默认为空走系统颜色
      this.uploadLoading = true;

      this.files.forEach(item => {
        this.uploadForm.append("files", item);
      });
      this.uploadForm.append("lessonId", this.lessonId);
      this.uploadForm.append("type", this.type);

      this.$Axios({
        method: "post",
        url: `${process.env.VUE_APP_UPLOAD_URL}/uploadapi/batch/uploadCourseWare`,
        data: this.uploadForm,
        headers: {
          "Content-type": "multipart/form-data",
          authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`
        },
        cancelToken: _this.source.token,
        // axios 的进度条监听，客户端 to 服务端
        onUploadProgress(processEvent) {
          if (processEvent.lengthComputable) {
            let val = parseInt(
              ((processEvent.loaded / processEvent.total) * 100).toFixed(0)
            );
            // let randomNumber = _this.Filters.getRandom(1, 10)
            // if( val > 70 ) {
            //   val -= randomNumber
            // }
            _this.percentage = val;
          }
        }
      })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            // 此处200 是服务端 to s3/拓客云完成以后
            this.percentage = 100; // 把进度条搞满，哈哈哈哈
            this.processStatus = "success";
            this.$notify({
              message: this.$t("上传成功"),
              type: "success"
            });
          } else {
            this.processStatus = "exception";
            if (data.code == 500 && Array.isArray(data.data)) {
              let errResult = [];
              data.data.forEach(item => {
                errResult.push(Object.entries(item)[0]); // => [['11','value']]
              });
              let str = "";
              errResult.forEach(item => {
                str += `${item[0]}: ${item[1]}`;
              });
              this.$notify({
                message: `${str} （ ${this.$t(
                  "这是一条不会自动关闭的消息"
                )} ）`,
                type: "error",
                duration: 0
              });
            } else {
              this.$notify({
                message: `${data.message} （ ${this.$t(
                  "这是一条不会自动关闭的消息"
                )} ） `,
                type: "error"
              });
            }
          }
          this.resetUploadStatus();
          this.uploadLoading = false;
        })
        .catch(err => {
          this.$notify({
            message: err.message,
            type: "success"
          });
          this.resetUploadStatus();
        });
    },
    handleUpdateFile(e) {
      this.files.push(e.file);
    }
  },
  created() {
    this.initData();
    this.$Api.base.courseEdition().then(res => {
      if (res.status === 200) {
        this.editionListData = res.data.data;

        this.editionListData.forEach(item => {
          if (item.editionId == this.courseEditionId) {
            this.levelList = item.courseLevelInfoList;
          }
        });
        this.levelList.forEach(item => {
          if (item.levelId == this.courseLevel) {
            this.unitList = item.courseUnitList;
          }
        });

        this.$Api.base
          .getLessonList(this.courseEditionId, this.courseLevel, this.unitNo)
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200 && data.data.length != 0) {
              data.data.forEach(item => {
                item.label = `lesson ${item.unitLessonNo}`;
                item.value = item.id;
              });
              this.lessonList = data.data;
              this.lessonId = this.lessonList[0].id;
            } else {
              this.lessonList = [];
            }
          });
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.upload-more-wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.upload-wrap {
  width: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  text-align: center;
}
.upload-wrap ::v-deep .el-upload {
  width: 90%;
}
.upload-wrap ::v-deep .el-upload ::v-deep .el-upload-dragger {
  width: 100%;
}
</style>
