<template>
  <div class="try-teach-wrap">
    <div class="search-wrap">
      <el-button-group class="type-btn">
        <el-button
          @click="changeDate(-1)"
          :type="this.screenData.dateType == -1 ? 'primary' : ''"
          >{{ $t("my-home-Yesterday") }}</el-button
        >
        <el-button
          @click="changeDate(0)"
          :type="this.screenData.dateType == 0 ? 'primary' : ''"
          >{{ $t("my-home-Today") }}</el-button
        >
        <el-button
          @click="changeDate(1)"
          :type="this.screenData.dateType == 1 ? 'primary' : ''"
          >{{ $t("my-home-Tomorrow") }}</el-button
        >
      </el-button-group>
      <el-date-picker
        style="width: 300px"
        range-separator="-"
        clearable
        @change="changeApplyDate"
        v-model="applyDate"
        type="daterange"
        :default-time="['00:00:00', '23:59:59']"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
      >
      </el-date-picker>
      <el-select
        clearable
        filterable
        v-model="screenData.recruitUserId"
        :placeholder="$t('请选择') + (currentLang == 'en' ? ' ' : '招聘专员')"
      >
        <el-option
          v-for="item in recruitUserList"
          :key="item.id"
          :label="item.userName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        clearable=""
        v-model="screenData.editionId"
        :placeholder="$t('请选择') + (currentLang == 'en' ? ' ' : '版本')"
      >
        <el-option
          v-for="item in editionList"
          :key="item.editionId"
          :label="currentLang=='en'?item.editionNameOpsEn:item.editionNameOpsZh"
          :value="item.editionId"
        />
      </el-select>
      <span style="display: inline-block; width: 412px;">
        <FilterByUserAccount
          @change="
            (params) => {
              userParams = params;
            }
          "
        />
      </span>
      <el-button type="primary" @click="search">{{
        $t("my-home-Search")
      }}</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('试讲时间')"
          width="150"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.tryTime).substring(
                0,
                DateTimeUtils.dateClockTime(scope.row.tryTime).length - 3
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Teacher\'s Account')"
          :min-width="250"
          prop="userName"
        >
          <template slot-scope="scope">
            <router-link
              v-if="scope.row"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.tutorName}`,
              }"
            >
              <el-button type="text">{{ scope.row.userName }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="tutorName"
          :label="$t('昵称')"
          align="center"
          width="120"
        />
        <el-table-column
          align="center"
          :label="$t('Teacher Gender')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{Filters.mapGender(scope.row.gender,currentLang)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('试讲版本')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{currentLang === 'zh'?scope.row.courseEditionZhName:scope.row.courseEditionName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :fixed="$t('试讲考官')"
          width="120"
          prop="tryUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('招聘专员')"
          :width="currentLang === 'en' ? 160 : 120"
          prop="recruitUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('流程说明')"
          :width="currentLang === 'en' ? 150 : 120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              Filters.processDescription(scope.row, currentLang)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="toExamine(scope.row)">{{
              $t("Audit")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <!-- 审核 start -->
    <div class="examine-wrap">
      <el-dialog
        :before-close="closeExamine"
        :close-on-click-modal="false"
        :title="$t('试讲审核')"
        center
        :visible.sync="examineDialogFlag"
      >
        <div>
          <el-form
            :model="examineForm"
            :rules="examineRules"
            ref="examineForm"
            :label-width="currentLang === 'en' ? '150px' : '100px'"
            class="examine-form"
          >
            <el-form-item :label="$t('审核结论')" prop="examineStatus">
              <el-radio-group v-model="examineForm.examineStatus">
                <el-radio :label="3">{{
                  $t("试讲审核通过并进入教培阶段")
                }}</el-radio>
                <el-radio :label="2">{{ $t("回新注册") }}</el-radio>
                <el-radio :label="4">{{ $t("淘汰") }}</el-radio>
                <el-radio :label="5">{{ $t("老师主动放弃") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('教培日期')"
              prop="teachTime"
            >
              <el-date-picker
                v-model="examineForm.teachTime"
                clearable
                type="date"
                :placeholder="
                  $t('请选择') + (currentLang == 'en' ? ' ' : '教培日期')
                "
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 2"
              :label="$t('试讲情况')"
              prop="isTry"
            >
              <el-radio-group v-model="examineForm.isTry">
                <el-radio :label="1">{{ $t("完成试讲") }}</el-radio>
                <el-radio :label="0">{{ $t("未完成试讲") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('淘汰原因')"
              v-if="examineForm.examineStatus == 4"
              prop="outReasonId"
            >
              <el-select
                clearable
                v-model="examineForm.outReasonId"
                :placeholder="
                  $t('请选择') + (currentLang == 'en' ? ' ' : '淘汰原因')
                "
              >
                <el-option
                  v-for="item in outReasonList"
                  :key="item.id"
                  :label="item.typeKey"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('放弃原因')"
              v-if="examineForm.examineStatus == 5"
              prop="outReasonId"
            >
              <el-select
                clearable
                v-model="examineForm.outReasonId"
                :placeholder="
                  $t('请选择') + (currentLang == 'en' ? ' ' : '放弃原因')
                "
              >
                <el-option
                  v-for="item in giveUpReassonList"
                  :key="item.id"
                  :label="item.typeKey"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                examineForm.examineStatus == 3 || examineForm.examineStatus == 2
              "
              :label="$t('student-info-Notes')"
              prop="tryRemark"
            >
              <el-input
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="4"
                :placeholder="
                  $t('glb-input') + (currentLang == 'en' ? ' ' : '内容')
                "
                v-model="examineForm.tryRemark"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="
                examineForm.examineStatus == 4 || examineForm.examineStatus == 5
              "
              :label="$t('student-info-Notes')"
              prop="outRemark"
            >
              <el-input
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="4"
                :placeholder="
                  $t('glb-input') + (currentLang == 'en' ? ' ' : '内容')
                "
                v-model="examineForm.outRemark"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeExamine">{{
            $t("my-home-CCancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="sureSubmitExamine"
            :loading="sureSubmitExamineLoading"
            >{{ $t("提交") }}</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 审核 end -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

export default {
  props: {
    currentActiveTopButtonId: {
      type: Number,
      default: -1,
    },
    // 淘汰原因
    outReasonList: {
      type: Array,
      default: () => [],
    },
    // 放弃原因
    giveUpReassonList: {
      type: Array,
      default: () => [],
    },
    // 获取课程版本
    editionList: {type: Array, default: () => ([])}
  },
  components: {
    FilterByUserAccount,
  },
  data() {
    return {
      userParams: {},
      // editionList:[],
      examineForm: {
        examineStatus: 3,
        teachTime: "",
        isTry: "",
        tryRemark: "",
        outRemark: "",
        outReasonId: "",
      },
      examineRules: {},
      applyDate: [],
      total: 0,
      loading: false,
      tableData: [],
      screenData: {
        pageSize: 50,
        pageNum: 1,
        recruitUserId: "",
        dateType: null,
        editionId: "",
      },
      recruitUserList: [],
      examineDialogFlag: false,
      examineObj: null,
      sureSubmitExamineLoading: false,
    };
  },
  computed: {
    examineStatus() {
      return this.examineForm.examineStatus;
    },
    ...mapGetters(["currentLang"]),
  },
  watch: {
    examineStatus(newData) {
      this.examineForm = this.$options.data().examineForm;
      this.$refs["examineForm"].resetFields();
      this.examineForm.examineStatus = newData;
    },
  },
  methods: {
    initData() {
      this.examineRules = {
        examineStatus: [
          {
            required: true,
            message: this.$t("请选择审核结论"),
            trigger: "blur",
          },
        ],
        teachTime: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("试讲时间"),
            trigger: "blur",
          },
        ],
        tryRemark: [
          { required: true, message: this.$t("请输入备注"), trigger: "blur" },
        ],
        outReasonId: [
          {
            required: true,
            message: this.$t("请选择淘汰（放弃）原因"),
            trigger: "blur",
          },
        ],
        outRemark: [
          {
            required: true,
            message: this.$t("请输入淘汰（放弃）备注"),
            trigger: "blur",
          },
        ],
        isTry: [
          {
            required: true,
            message: this.$t("请选择是否完成试讲"),
            trigger: "blur",
          },
        ],
      };
    },
    //确认提交审核
    sureSubmitExamine() {
      this.$refs["examineForm"].validate((valid) => {
        if (valid) {
          this.sureSubmitExamineLoading = true;
          this.examineForm.nextStage =
            this.examineForm.examineStatus == 2 ? 1 : "";
          this.$Api.tutorManagement
            .examineApi(this.examineObj.id, this.examineForm)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$emit("getCount");
                this.closeExamine();
                this.getTableData();
              }
              this.sureSubmitExamineLoading = false;
            });
        } else {
          this.$notify({
            message: this.$t("缺少必填项"),
            type: "warning",
          });
        }
      });
    },
    closeExamine() {
      this.examineDialogFlag = false;
      this.$refs["examineForm"].resetFields();
      this.examineForm = this.$options.data().examineForm;
    },
    changeDate(date) {
      this.screenData.dateType = date;
      this.applyDate = [];
      this.getTableData();
    },
    search() {
      this.screenData.pageNum = 1;
      this.screenData.pageSize = 50;
      this.getTableData();
    },
    // 获取招聘专员 select列表
    getRecruitUserList() {
      let code = "zhaopinzhuanyuan";
      this.$Api.tutorManagement.getRoleList(code).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.recruitUserList = data.data;
        }
      });
    },
    getTableData() {
      this.loading = true;
      let { applyDate } = this;
      let startTime = "",
        endTime = "";
      if (applyDate != null) {
        startTime = applyDate[0] ? new Date(applyDate[0]).toISOString() : "";
        endTime = applyDate[1] ? new Date(applyDate[1]).toISOString() : "";
      } else {
        startTime = "";
        endTime = "";
      }
      let { pageNum, pageSize, dateType, recruitUserId, editionId } =
        this.screenData;
      let params = {
        dateType,
        recruitUserId,
        startTime,
        endTime,
        editionId,
        ...this.userParams,
      };
      this.$Api.tutorManagement
        .getTeacherProcessList(2, pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
    changeApplyDate() {
      this.screenData.dateType = null;
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    // 打开审核弹窗
    toExamine(scopeRow) {
      this.examineObj = scopeRow;
      this.examineDialogFlag = true;
    },
  },
  created() {
    this.initData();
    this.getRecruitUserList();
    this.getTableData();
  },
};
</script>
<style lang="scss" scoped>
.search-wrap {
  width: 100%;
  position: relative;
  .create-teacher {
    position: absolute;
    right: 0;
  }
}
</style>