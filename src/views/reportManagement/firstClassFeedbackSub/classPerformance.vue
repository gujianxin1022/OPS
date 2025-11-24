<template>
  <div class="class-performance-content">
    <el-table
      border
      :data="classPerformanceData"
      style="width: 100%"
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
    >
      <el-table-column
        fixed
        prop="name"
        label=""
        align="center"
      ></el-table-column>
      <el-table-column
        prop="oneStar"
        :label="data.dimension[0]"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="twoStar"
        :label="data.dimension[1]"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="threeStar"
        :label="data.dimension[2]"
        align="center"
      ></el-table-column>
      <el-table-column
        align="center"
        :label="$t('操作')"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editClassPerformance(scope.row, 0)"
            :disabled="disabled"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑课堂表现维度 start-->
    <el-dialog
      v-if="classPerformanceData[0]"
      :title="'编辑' + classPerformanceData[0].name"
      :visible.sync="editClassPerformanceVisibility"
      width="60%"
    >
      <div class="assessment-content">
        <el-form
          :model="editClassPerformanceInfo"
          :rules="rules"
          ref="editAssessmentItem"
        >
          <el-form-item
            :label="classPerformanceData[0].dimension[0]"
            :label-width="formLabelWidth"
            prop="oneStar"
          >
            <el-input
              v-model.trim="editClassPerformanceInfo.oneStar"
              type="textarea"
              placeholder="请输入文案"
            ></el-input>
            <div
              v-if="language!=='CN'"
              style="font-size: 12px"
            >
              中文对照：{{ classPerformanceData[0].tips[0] }}
            </div>
          </el-form-item>
          <el-form-item
            :label="classPerformanceData[0].dimension[1]"
            :label-width="formLabelWidth"
            prop="twoStar"
          >
            <el-input
              v-model.trim="editClassPerformanceInfo.twoStar"
              type="textarea"
              placeholder="请输入文案"
            ></el-input>
            <div
              v-if="language!=='CN'"
              style="font-size: 12px"
            >
              中文对照：{{ classPerformanceData[0].tips[1] }}
            </div>
          </el-form-item>
          <el-form-item
            :label="classPerformanceData[0].dimension[2]"
            :label-width="formLabelWidth"
            prop="threeStar"
          >
            <el-input
              v-model.trim="editClassPerformanceInfo.threeStar"
              type="textarea"
              placeholder="请输入文案"
            ></el-input>
            <div
              v-if="language!=='CN'"
              style="font-size: 12px"
            >
              中文对照：{{ classPerformanceData[0].tips[2] }}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeClassPerformance">取 消</el-button>
        <el-button
          type="primary"
          @click="saveClassPerformance"
          :loading="loading"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑课堂表现维度 end-->
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: null,
      type: Object,
    },
    index: {
      default: null,
      type: Number,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    language: {
      default: "CN",
      type: String,
    },
  },
  data () {
    return {
      classPerformanceData: [],
      editClassPerformanceVisibility: false,
      editClassPerformanceInfo: {},
      formLabelWidth: "100px",
      loading: false,
      rules: {
        oneStar: [
          {
            required: true,
            message: "请输入" + this.data.dimension[0] + "文案",
            trigger: "blur",
          },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
        twoStar: [
          {
            required: true,
            message: "请输入" + this.data.dimension[1] + "文案",
            trigger: "blur",
          },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
        threeStar: [
          {
            required: true,
            message: "请输入" + this.data.dimension[2] + "文案",
            trigger: "blur",
          },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
      },
    };
  },
  mounted () {
    this.classPerformanceData.push(this.data);
  },
  methods: {
    editClassPerformance (data, index) {
      this.editClassPerformanceInfo = JSON.parse(JSON.stringify(data));
      this.editClassPerformanceVisibility = true;
    },
    closeClassPerformance () {
      this.editClassPerformanceVisibility = false;
      this.$refs["editAssessmentItem"].resetFields();
    },
    saveClassPerformance () {
      this.$refs["editAssessmentItem"].validate((val) => {
        if (val) {

          if (this.classPerformanceData[0].idArr && this.classPerformanceData[0].idArr.length > 0) {
            this.loading = true;
            // this.$$Api.unitReportManagement.changeClassPerformance()
            let params = [];
            let idIndexToKey = {
              0: "oneStar",
              1: "twoStar",
              2: "threeStar",
            };
            this.editClassPerformanceInfo.idArr.forEach((idItem, idIndex) => {
              params.push({
                id: idItem,
                showType: idIndex + 1,
                showTypeDesc: this.editClassPerformanceInfo.dimension[idIndex],
                showDesc: this.editClassPerformanceInfo[idIndexToKey[idIndex]],
              });
            });
            this.$Api.unitReportManagement
              .changeClassPerformance({ params: params })
              .then((res) => {
                if (res.status === 200) {
                  if (res.data.code === 200) {
                    this.$set(
                      this.classPerformanceData,
                      0,
                      JSON.parse(JSON.stringify(this.editClassPerformanceInfo))
                    );
                    this.closeClassPerformance();
                  }
                  // else {
                  //   this.$notify({
                  //     type: "error",
                  //     message: res.data.message,
                  //   });
                  // }
                }
              });
            this.loading = false;
          } else {
            this.loading = true;

            this.$Api.unitReportManagement
              .saveClassPerformance({
                name: this.classPerformanceData[0].name,
                language: this.language,
                nameLanguage: this.classPerformanceData[0].name,
                showInfos: [
                  {
                    showType: 1,
                    showTypeDesc: this.classPerformanceData[0].dimension[0],
                    showDesc: this.editClassPerformanceInfo.oneStar,
                  },
                  {
                    showType: 2,
                    showTypeDesc: this.classPerformanceData[0].dimension[1],
                    showDesc: this.editClassPerformanceInfo.twoStar,
                  },
                  {
                    showType: 3,
                    showTypeDesc: this.classPerformanceData[0].dimension[2],
                    showDesc: this.editClassPerformanceInfo.threeStar,
                  },
                ],
              })
              .then((res) => {
                if (res.status === 200) {
                  if (res.data.code === 200) {
                    this.$set(
                      this.classPerformanceData,
                      0,
                      JSON.parse(
                        JSON.stringify({
                          ...this.editClassPerformanceInfo,
                          idArr: res.data.data,
                          desArr: [
                            this.editClassPerformanceInfo.oneStar,
                            this.editClassPerformanceInfo.twoStar,
                            this.editClassPerformanceInfo.oneStar.threeStar,
                          ],
                        })
                      )
                    );
                    this.closeClassPerformance();
                    this.$emit("changelessonShowListObj", {
                      data: res.data.data,
                      index: this.data.name,
                    });
                  }
                  // else {
                  //   this.$notify({
                  //     type: "error",
                  //     message: res.data.message,
                  //   });
                  // }
                }
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.class-performance-content {
  margin-bottom: 30px;
}

.dialog-footer {
  text-align: center;
}
</style>
