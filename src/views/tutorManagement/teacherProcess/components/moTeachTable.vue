<template>
  <div class="mo-teach-wrap">
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
        :default-time="['00:00:00', '23:59:59']"
        style="width: 300px"
        range-separator="-"
        clearable
        v-model="applyDate"
        @change="changeApplyDate"
        type="daterange"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
      >
      </el-date-picker>
      <el-select
        clearable
        filterable
        v-model="screenData.finalUserId"
        :placeholder="
          $t('my-home-Select') + (currentLang == 'en' ? ' ' : '终面负责人')
        "
      >
        <el-option
          v-for="item in mainTrainUserList"
          :key="item.id"
          :label="item.userName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        clearable
        filterable
        v-model="screenData.editionId"
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
          :label="$t('磨课时间')"
          width="150"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.millTime).substr(
                0,
                DateTimeUtils.dateClockTime(scope.row.millTime).length - 3
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
          :label="$t('my-home-Age')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.birthdayMapToAge(scope.row.birthday)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('学历')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.highestDegree | highestDegreeFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('是否在读')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isSchool | isSchoolFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('就职单位')"
          width="120"
          prop="currentEmployer"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('工作年限')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <div>{{ Constants.teachAgoComputed(scope.row.teachingStartTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-3-Country of Residence')"
          :width="currentLang === 'en' ? 150 : 120"
          prop="countryOfResidence"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('版本')"
          width="180"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{currentLang === 'zh'?scope.row.courseEditionZhName:scope.row.courseEditionName}}</span>
            <span
              v-for="item in scope.row.courseAdviceList"
              :key="item.courseName"
              >Level{{ item.courseLevel }}&nbsp;</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('招聘专员')"
          :width="currentLang === 'en' ? 150 : 120"
          prop="recruitUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('试讲考官')"
          width="120"
          prop="tryUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('教学培训师')"
          :width="currentLang === 'en' ? 130 : 120"
          prop="mainTrainUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('磨课培训师')"
          :width="currentLang === 'en' ? 150 : 120"
          prop="millTrainUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('技术培训师')"
          width="120"
          prop="skillUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('终面考官')"
          width="120"
          prop="finalUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('磨课考官')"
          :width="currentLang === 'en' ? 170 : 120"
          prop="millExaUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('设备检测结果')"
          :width="currentLang === 'en' ? 140 : 120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              Filters.isDeviceFilters(scope.row.isDevice, currentLang)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          el-table-column
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
            <span> | </span>
            <el-button type="text" @click="showDeviceTestDialog(scope.row)">{{
              $t("设备检测")
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
        :title="$t('磨课审核')"
        center
        :visible.sync="examineDialogFlag"
      >
        <div>
          <el-form
            :model="examineForm"
            :rules="examineRules"
            ref="examineForm"
            :label-width="currentLang === 'en' ? '175px' : '110px'"
            class="examine-form"
          >
            <el-form-item :label="$t('审核结论')" prop="examineStatus">
              <el-radio-group v-model="examineForm.examineStatus">
                <el-radio :label="3">{{
                  $t("磨课通过并进入待上岗阶段")
                }}</el-radio>
                <el-radio :label="2">{{ $t("回退") }}</el-radio>
                <el-radio :label="4">{{ $t("淘汰") }}</el-radio>
                <el-radio :label="5">{{ $t("老师主动放弃") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 2"
              :label="$t('磨课情况')"
              prop="isMill"
            >
              <el-radio-group v-model="examineForm.isMill">
                <el-radio :label="1">{{ $t("完成磨课") }}</el-radio>
                <el-radio :label="0">{{ $t("未完成磨课") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 2"
              :label="$t('回退阶段')"
              prop="nextStage"
            >
              <el-select
                clearable
                v-model="examineForm.nextStage"
                :placeholder="
                  $t('my-home-Select') +
                  (currentLang == 'en' ? ' ' : '回退阶段')
                "
              >
                <el-option
                  v-for="item in rollbackList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
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
                  $t('my-home-Select') +
                  (currentLang == 'en' ? ' ' : '淘汰原因')
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
                  $t('my-home-Select') +
                  (currentLang == 'en' ? ' ' : '放弃原因')
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
              prop="millRemark"
            >
              <el-input
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="4"
                :placeholder="$t('glb-input')"
                v-model="examineForm.millRemark"
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
                :placeholder="$t('glb-input')"
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
    <div class="device-test-wrap">
      <DeviceTest
        :deviceObj="deviceObj"
        @getTableData="getTableData"
        @closeDeviceTestDialog="closeDeviceTestDialog"
        :deviceDialogFlag="deviceDialogFlag"
      ></DeviceTest>
    </div>
  </div>
</template>
<script>
import DeviceTest from "./deviceTest";
import { mapGetters } from "vuex";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

export default {
  components: {
    DeviceTest,
    FilterByUserAccount,
  },
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
  data() {
    return {
      userParams: {},
      rollbackList: [],
      date: 0,
      applyDate: [],
      total: 0,
      loading: false,
      tableData: [{ name: 1 }],
      screenData: {
        pageSize: 50,
        pageNum: 1,
        dateType: null,
        finalUserId: "",
        editionId: "",
      },
      mainTrainUserList: [],
      deviceObj: null,
      deviceDialogFlag: false,
      examineDialogFlag: false,
      examineObj: null,
      examineForm: {
        examineStatus: 3,
        isMill: "",
        outRemark: "",
        millRemark: "",
        outReasonId: "",
        nextStage: "",
      },
      examineRules: null,
      sureSubmitExamineLoading: false,
      // editionList:[]
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    examineStatus() {
      return this.examineForm.examineStatus;
    },
  },
  watch: {
    examineStatus(newData) {
      this.examineForm = this.$options.data().examineForm;
      this.$refs["examineForm"].resetFields();
      this.examineForm.examineStatus = newData;
    },
    currentLang() {
      this.initData();
    },
  },
  methods: {
    initData() {
      this.rollbackList = [
        { label: this.$t("新注册"), id: 1 },
        { label: this.$t("试讲阶段"), id: 2 },
        { label: this.$t("教学培训阶段"), id: 3 },
        { label: this.$t("技术培训阶段"), id: 4 },
        { label: this.$t("终面阶段"), id: 5 },
      ];
      this.examineRules = {
        examineStatus: [
          {
            required: true,
            message: this.$t("请选择审核结论"),
            trigger: "blur",
          },
        ],
        millRemark: [
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
        isMill: [
          {
            required: true,
            message: this.$t("请选择是否完成磨课"),
            trigger: "blur",
          },
        ],
        nextStage: [
          {
            required: true,
            message: this.$t("请选择回退阶段"),
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
          this.$Api.tutorManagement
            .examineApi(this.examineObj.id, this.examineForm)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("审核通过"),
                  type: "success",
                });
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
    // 打开审核弹窗
    toExamine(scopeRow) {
      this.examineObj = scopeRow;
      this.examineDialogFlag = true;
    },
    closeDeviceTestDialog() {
      this.deviceDialogFlag = false;
    },
    // 打开设备检测 dialog
    showDeviceTestDialog(scopeRow) {
      this.deviceObj = scopeRow;
      this.deviceDialogFlag = true;
    },
    changeApplyDate() {
      this.screenData.dateType = null;
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
      let { pageSize, pageNum, finalUserId, dateType, editionId } =
        this.screenData;
      let params = {
        finalUserId,
        dateType,
        editionId,
        startTime,
        endTime,
        ...this.userParams,
      };
      this.$Api.tutorManagement
        .getTeacherProcessList(6, pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    getMainTrainUserList() {
      let code = "jiaoxuepeixunshi";
      this.$Api.tutorManagement.getRoleList(code).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.mainTrainUserList = data.data;
        }
      });
    },
  },
  created() {
    this.initData();
    this.getTableData();
    this.getMainTrainUserList();
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