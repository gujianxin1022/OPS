<template>
  <div class="teach-train-wrap">
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
        :default-time="['00:00:00', '23:59:59']"
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
        v-model="screenData.mainTrainUserId"
        :placeholder="$t('my-home-Select') + ' ' + $t('培训师')"
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
        :placeholder="$t('my-home-Select') + ' ' + $t('培训版本')"
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
          :label="$t('教学培训日期')"
          width="150"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.teachTime).split(" ")[0]
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
          :label="$t('招聘专员')"
          :width="currentLang === 'en' ? 150 : 120"
          prop="recruitUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('培训版本')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{currentLang === 'zh'?scope.row.courseEditionZhName:scope.row.courseEditionName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('主培训师')"
          width="120"
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
          :label="$t('终面时间')"
          width="150"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.finalTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('终面考官')"
          width="120"
          prop="finalUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          width="180"
          prop="name"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleDistribution(scope.row)">{{
              $t("student-management-Assign")
            }}</el-button>
            <span> | </span>
            <el-button
              :disabled="
                scope.row.mainTrainUserId == null &&
                scope.row.millTrainUserId == null
              "
              type="text"
              @click="toExamine(scope.row)"
              >{{ $t("Audit") }}</el-button
            >
            <span> | </span>
            <el-button @click="showLastInterviewDiaog(scope.row)" type="text">{{
              $t("安排终面")
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
        :title="$t('教学培训审核')"
        center
        :visible.sync="examineDialogFlag"
      >
        <div>
          <el-form
            :model="examineForm"
            :rules="examineRules"
            ref="examineForm"
            :label-width="currentLang === 'en' ? '180px' : '110px'"
            class="examine-form"
          >
            <el-form-item :label="$t('审核结论')" prop="examineStatus">
              <el-radio-group v-model="examineForm.examineStatus">
                <el-radio :label="3">{{
                  $t("教培通过并进入技术培训阶段")
                }}</el-radio>
                <el-radio :label="2">{{ $t("回退") }}</el-radio>
                <el-radio :label="4">{{ $t("淘汰") }}</el-radio>
                <el-radio :label="5">{{ $t("老师主动放弃") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('技术培训日期')"
              prop="skillTime"
            >
              <el-date-picker
                v-model="examineForm.skillTime"
                clearable
                type="date"
                :placeholder="$t('请选择') + $t('技术培训日期')"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('技术培训师')"
              prop="skillUserId"
            >
              <el-select
                clearable
                filterable
                v-model="examineForm.skillUserId"
                :placeholder="$t('my-home-Select') + $t('培训师')"
              >
                <el-option
                  v-for="item in skillUserList"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 2"
              :label="$t('教学培训情况')"
              prop="isTeach"
            >
              <el-radio-group v-model="examineForm.isTeach">
                <el-radio :label="1">{{ $t("完成教培") }}</el-radio>
                <el-radio :label="0">{{ $t("未完成教培") }}</el-radio>
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
                :placeholder="$t('my-home-Select') + $t('回退阶段')"
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
                :placeholder="$t('my-home-Select') + $t('淘汰原因')"
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
                :placeholder="$t('my-home-Select') + $t('放弃原因')"
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
              prop="teachRemark"
            >
              <el-input
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="4"
                :placeholder="
                  $t('glb-input') + currentLang == 'en' ? '...' : '内容'
                "
                v-model="examineForm.teachRemark"
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
                  $t('glb-input') + currentLang == 'en' ? '...' : '内容'
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
    <!-- 分配 start -->
    <div class="distribution-wrap">
      <el-dialog
        :before-close="closeDistribution"
        :close-on-click-modal="false"
        :title="$t('student-management-Assign')"
        center
        :visible.sync="distributionDialogFlag"
      >
        <div class="distribution-form-wrap">
          <el-form
            :model="distributionForm"
            :rules="distributionRules"
            ref="distributionForm"
            :label-width="currentLang === 'en' ? '170px' : '100px'"
            class="distribution-form"
          >
            <el-form-item :label="$t('主培训师')" prop="mainTrainUserId">
              <el-select
                clearable
                v-model="distributionForm.mainTrainUserId"
                :placeholder="$t('my-home-Select') + $t('主培训师')"
              >
                <el-option
                  v-for="item in mainTrainUserList"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('磨课培训师')" prop="millTrainUserId">
              <el-select
                clearable
                v-model="distributionForm.millTrainUserId"
                :placeholder="$t('磨课培训师')"
              >
                <el-option
                  v-for="item in mainTrainUserList"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDistribution">{{
            $t("my-home-CCancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="sureDistribution"
            :loading="sureDistributionLoading"
            >{{ $t("my-home-Confirm") }}</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 分配 end -->
    <!-- 安排终面 start -->
    <div class="last-interview-wrap">
      <el-dialog
        :before-close="closeLastInterview"
        :close-on-click-modal="false"
        :title="$t('安排终面')"
        center
        :visible.sync="lastInterviewDialogFlag"
      >
        <el-form
          :model="lastInterviewForm"
          :rules="lastInterviewRules"
          ref="lastInterviewForm"
          :label-width="currentLang === 'en' ? '130px' : '100px'"
          class="last-interview-form"
        >
          <el-form-item :label="$t('终面时间')" required>
            <el-form-item
              prop="date1"
              style="width: 30%; margin: 0; display: inline-block"
            >
              <el-date-picker
                type="date"
                :placeholder="$t('选择日期')"
                v-model="lastInterviewForm.date1"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <span>-</span>
            <el-form-item
              prop="date2"
              style="width: 30%; margin: 0; display: inline-block"
            >
              <el-time-select
                :placeholder="$t('choose time')"
                v-model="lastInterviewForm.date2"
                style="width: 100%"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30',
                }"
              >
              </el-time-select>
            </el-form-item>
          </el-form-item>
          <el-form-item :label="$t('终面考官')" prop="finalUserId">
            <el-select
              clearable
              v-model="lastInterviewForm.finalUserId"
              :placeholder="$t('my-home-Select') + $t('终面考官')"
            >
              <el-option
                v-for="item in mainTrainUserList"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeLastInterview">{{
            $t("my-home-CCancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="sureLastInterview"
            :loading="sureLastInterviewLoaing"
            >{{ $t("my-home-Confirm") }}</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 安排终面 end -->
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
      skillUserList: [],
      sureLastInterviewLoaing: false,
      sureDistributionLoading: false,
      rollbackList: [],
      examineForm: {
        examineStatus: 3,
        skillTime: "",
        skillUserId: "",
        isTeach: "",
        nextStage: "",
        outReasonId: "",
        teachRemark: "",
        outRemark: "",
      },
      examineRules: {},
      date: 0,
      applyDate: [],
      total: 0,
      loading: false,
      tableData: [],
      screenData: {
        pageSize: 50,
        pageNum: 1,
        editionId: "",
        mainTrainUserId: "",
        dateType: null,
      },
      mainTrainUserList: [],
      examineDialogFlag: false,
      distributionDialogFlag: false,
      distributionForm: {
        mainTrainUserId: "",
        millTrainUserId: "",
      },
      distributionRules: {},
      lastInterviewDialogFlag: false,
      lastInterviewForm: {
        finalTime: "",
        finalUserId: "",
        date1: "",
        date2: "",
      },
      lastInterviewRules: {},
      sureDistributionObj: null,
      examineObj: null,
      sureSubmitExamineLoading: false,
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
    examineDialogFlag(newData) {
      if (newData && this.skillUserList.length == 0) {
        let code = "jishupeixunshi";
        this.$Api.tutorManagement.getRoleList(code).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.skillUserList = data.data;
          }
        });
      }
    },
  },
  methods: {
    initData() {
      this.rollbackList = [
        { label: this.$t("新注册"), id: 1 },
        { label: this.$t("试讲阶段"), id: 2 },
      ];
      this.examineRules = {
        examineStatus: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("审核结论"),
            trigger: "blur",
          },
        ],
        skillTime: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("技术培训时间"),
            trigger: "blur",
          },
        ],
        teachRemark: [
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
        isTeach: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("是否完成教学培训"),
            trigger: "blur",
          },
        ],
        nextStage: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("回退阶段"),
            trigger: "blur",
          },
        ],
        skillUserId: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("技术培训师"),
            trigger: "blur",
          },
        ],
      };
      this.distributionRules = {
        mainTrainUserId: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("主培训师"),
            trigger: "blur",
          },
        ],
        millTrainUserId: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("磨课培训师"),
            trigger: "blur",
          },
        ],
      };
      this.lastInterviewRules = {
        finalTime: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("终面时间"),
            trigger: "blur",
          },
        ],
        finalUserId: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("终面考官"),
            trigger: "blur",
          },
        ],
        date1: [
          {
            required: true,
            message: this.$t("请选择终面日期"),
            trigger: "blur",
          },
        ],
        date2: [
          {
            required: true,
            message: this.$t("请选择") + this.$t("终面时间"),
            trigger: "blur",
          },
        ],
      };
    },
    // 确定提交终面信息
    sureLastInterview() {
      this.$refs["lastInterviewForm"].validate((valid) => {
        if (valid) {
          this.sureLastInterviewLoaing = true;
          let str = `${new Date(
            this.lastInterviewForm.date1
          ).toLocaleDateString()} ${this.lastInterviewForm.date2}`;
          this.lastInterviewForm.finalTime = new Date(str).toISOString();
          this.$Api.tutorManagement
            .finalApi(this.sureLastInterviewObj.id, this.lastInterviewForm)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("安排成功"),
                  type: "success",
                });
                this.getTableData();
                this.closeLastInterview();
              }
              this.sureLastInterviewLoaing = false;
            });
        } else {
          this.$notify({
            message: this.$t("缺少必填项"),
            type: "warning",
          });
        }
      });
    },
    // 打开终面 dialog
    showLastInterviewDiaog(scopeRow) {
      this.sureLastInterviewObj = scopeRow;
      if (scopeRow.finalTime != null) {
        this.lastInterviewForm.date1 = new Date(
          scopeRow.finalTime
        ).toLocaleDateString();
        let timeh = new Date(scopeRow.finalTime).getHours();
        if (timeh < 10) {
          timeh = `0${timeh}`;
        }
        let timem = new Date(scopeRow.finalTime).getMinutes();
        if (timem < 10) {
          timem = `0${timem}`;
        }
        this.lastInterviewForm.date2 = `${timeh}:${timem}`;
      }
      if (scopeRow.finalUserId == null && scopeRow.millTrainUserId != null) {
        this.lastInterviewForm.finalUserId = scopeRow.millTrainUserId;
      } else {
        this.lastInterviewForm.finalUserId = scopeRow.finalUserId;
      }
      this.lastInterviewDialogFlag = true;
    },
    // 关闭安排终面
    closeLastInterview() {
      this.lastInterviewDialogFlag = false;
      this.lastInterviewForm = this.$options.data().lastInterviewForm;
    },
    // 确定分配
    sureDistribution() {
      this.$refs["distributionForm"].validate((valid) => {
        if (valid) {
          this.sureDistributionLoading = true;

          this.$Api.tutorManagement
            .distributionApi(this.sureDistributionObj.id, this.distributionForm)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("分配成功"),
                  type: "success",
                });
                this.getTableData();
                this.closeDistribution();
                this.sureDistributionLoading = false;
              }
            });
        } else {
          this.$notify({
            message: this.$t("缺少必填项"),
            type: "warning",
          });
        }
      });
    },
    // 关闭分配弹窗
    closeDistribution() {
      this.distributionDialogFlag = false;
      this.distributionForm = this.$options.data().distributionForm;
    },
    // 打开分配弹窗
    handleDistribution(scopeRow) {
      if (scopeRow.mainTrainUserId) {
        this.distributionForm.mainTrainUserId = scopeRow.mainTrainUserId;
      }
      if (scopeRow.millTrainUserId != null) {
        this.distributionForm.millTrainUserId = scopeRow.millTrainUserId;
      }
      this.sureDistributionObj = scopeRow;
      this.distributionDialogFlag = true;
    },
    closeExamine() {
      this.examineDialogFlag = false;
      this.$refs["examineForm"].resetFields();
      this.examineForm = this.$options.data().examineForm;
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
    // 关闭审核dialog
    loseExamine() {
      this.examineDialogFlag = false;
      this.$refs["examineForm"].resetFields();
      this.examineForm = this.$options.data().examineForm;
    },
    // 打开审核弹窗
    toExamine(scopeRow) {
      this.examineObj = scopeRow;
      this.examineDialogFlag = true;
    },
    // 获取教学（主）培训师 select列表
    getMainTrainUserList() {
      let code = "jiaoxuepeixunshi";
      this.$Api.tutorManagement.getRoleList(code).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.mainTrainUserList = data.data;
        }
      });
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
      let {
        pageSize,
        pageNum,
        editionId,
        mainTrainUserId,
        dateType,
      } = this.screenData;
      let params = {
        editionId,
        mainTrainUserId,
        dateType,
        startTime,
        endTime,
        ...this.userParams,
      };
      this.$Api.tutorManagement
        .getTeacherProcessList(3, pageNum, pageSize, params)
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