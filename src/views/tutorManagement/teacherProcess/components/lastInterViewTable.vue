<template>
  <div class="last-interview-wrap">
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
        :placeholder="$t('请选择终面考官')"
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
        :placeholder="$t('请选择终面版本')"
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
          prop="recruitUserName"
          :width="currentLang === 'en' ? 150 : 120"
        ></el-table-column>
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
          :label="$t('技术培训师')"
          width="120"
          prop="skillUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('终面版本')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{currentLang === 'zh'?scope.row.courseEditionZhName:scope.row.courseEditionName}}</span>
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
          :width="currentLang === 'en' ? 160 : 120"
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
          width="180"
          prop="name"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.finalUserId == null"
              @click="toExamine(scope.row)"
              type="text"
              >{{ $t("Audit") }}</el-button
            >
            <span> | </span>
            <el-button type="text" @click="showDeviceTestDialog(scope.row)">{{
              $t("设备检测")
            }}</el-button>
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
          label-width="100px"
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
                :placeholder="$t('选择日期')"
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
              :placeholder="
                $t('请选择') + currentLang == 'en' ? '...' : '终面考官'
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
            >{{ $t("确定") }}</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 安排终面 end -->
    <div class="device-test-wrap">
      <DeviceTest
        :deviceObj="deviceObj"
        @getTableData="getTableData"
        @closeDeviceTestDialog="closeDeviceTestDialog"
        :deviceDialogFlag="deviceDialogFlag"
      ></DeviceTest>
    </div>
    <!-- 审核 start -->
    <div class="examine-wrap">
      <el-dialog
        :before-close="closeExamine"
        :close-on-click-modal="false"
        :title="$t('终面审核')"
        center
        :visible.sync="examineDialogFlag"
      >
        <div>
          <el-form
            :model="examineForm"
            :rules="examineRules"
            ref="examineForm"
            label-width="110px"
            class="examine-form"
          >
            <el-form-item :label="$t('审核结论')" prop="examineStatus">
              <el-radio-group v-model="examineForm.examineStatus">
                <el-radio :label="3">{{
                  $t("终面通过并进入磨课阶段")
                }}</el-radio>
                <el-radio :label="2">{{ $t("回退") }}</el-radio>
                <el-radio :label="4">{{ $t("淘汰") }}</el-radio>
                <el-radio :label="5">{{ $t("老师主动放弃") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('磨课时间')"
              required
            >
              <el-form-item
                prop="date1"
                style="width: 30%; margin: 0; display: inline-block"
              >
                <el-date-picker
                  type="date"
                  :placeholder="$t('选择日期')"
                  v-model="examineForm.date1"
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
                  v-model="examineForm.date2"
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
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('磨课考官')"
              prop="millExaUserId"
            >
              <el-select
                clearable
                v-model="examineForm.millExaUserId"
                :placeholder="
                  $t('请选择') + currentLang == 'en' ? '...' : '磨课考官'
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
            </el-form-item>
            <!--  -->
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('授课建议')"
              prop="courseAdviceIdList"
            >
              <div style="display: flex; align-items: center">
                <el-tag class="mr10" v-if="examineObj">{{
                  examineObj.courseEditionId | mapEdtion
                }}</el-tag>
                <el-checkbox-group v-model="examineForm.courseAdviceIdList">
                  <el-checkbox
                    v-for="item in currentExamineLevels"
                    :key="item.levelId"
                    style="margin-right: 10px"
                    :label="item.levelId"
                    >level {{ item.levelNo }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </el-form-item>
            <!--  -->
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('教学风格')"
              prop="tutorStyleLabelList"
            >
              <el-select
                v-model="examineForm.tutorStyleLabelList"
                multiple
                filterable
                allow-create
                default-first-option
                :placeholder="
                  $t('请选择') + currentLang == 'en' ? '...' : '文章标签'
                "
              >
                <el-option
                  v-for="item in tutorStyleLabelListData"
                  :key="item.id"
                  :label="item.typeKey"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('语言标签')"
              prop="languageLabelList"
            >
              <el-select
                v-model="examineForm.languageLabelList"
                multiple
                filterable
                allow-create
                default-first-option
                :placeholder="
                  $t('请选择') + currentLang == 'en' ? '...' : '文章标签'
                "
              >
                <el-option
                  v-for="item in languageLabelListData"
                  :key="item.id"
                  :label="item.typeKey"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 3"
              :label="$t('小班试讲')"
            >
              <el-checkbox v-model="isAdviseSmall">{{
                $t("建议老师试讲小班课")
              }}</el-checkbox>
            </el-form-item>
            <el-form-item
              v-if="examineForm.examineStatus == 2"
              :label="$t('终面情况')"
              prop="isFinal"
            >
              <el-radio-group v-model="examineForm.isFinal">
                <el-radio :label="1">{{ $t("完成终面") }}</el-radio>
                <el-radio :label="0">{{ $t("未完成终面") }}</el-radio>
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
                  $t('请选择') + currentLang == 'en' ? '...' : '回退阶段'
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
                  $t('请选择') + currentLang == 'en' ? '...' : '淘汰原因'
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
                  $t('请选择') + currentLang == 'en' ? '...' : '放弃原因'
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
              prop="finalRemark"
            >
              <el-input
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="4"
                :placeholder="$t('glb-input')"
                v-model="examineForm.finalRemark"
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import DeviceTest from "./deviceTest";
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
      checkList: [],
      date: 0,
      applyDate: [],
      total: 0,
      loading: false,
      tableData: [],
      screenData: {
        editionId: "",
        pageSize: 50,
        pageNum: 1,
        dateType: null,
        finalUserId: "",
      },
      mainTrainUserList: [],
      deviceObj: null,
      deviceDialogFlag: false,
      lastInterviewDialogFlag: false,
      lastInterviewForm: {
        finalTime: "",
        finalUserId: "",
        date1: "",
        date2: "",
      },
      lastInterviewRules: {},
      examineDialogFlag: false,
      examineForm: {
        examineStatus: 3,
        millTime: "",
        millExaUserId: "",
        courseAdviceIdList: [],
        tutorStyleLabelList: [],
        languageLabelList: [],
        isAdviseSmall: "",
        isFinal: "",
        outReasonId: "",
        finalRemark: "",
        outRemark: "",
        nextStage: "",
        date1: "",
        date2: "",
      },
      isAdviseSmall: false,
      examineRules: {},
      tutorStyleLabelListData: [],
      languageLabelListData: [],
      examineObj: null,
      currentExamineLevels: [],
      sureSubmitExamineLoading: false,
      sureLastInterviewLoaing: false,
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
      // this.$refs['examineForm'].resetFields();
      this.examineForm.examineStatus = newData;
    },
    examineDialogFlag(newData) {
      if (newData && this.tutorStyleLabelListData.length == 0) {
        this.$Api.tutorManagement.getExamineDic(4).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tutorStyleLabelListData = data.data;
          }
        });
      }
      if (newData && this.languageLabelListData.length == 0) {
        this.$Api.tutorManagement.getExamineDic(5).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.languageLabelListData = data.data;
          }
        });
      }
    },
  },
  methods: {
    initData() {
      this.lastInterviewRules = {
        finalTime: [
          {
            required: true,
            message: this.$t("请选择终面时间"),
            trigger: "blur",
          },
        ],
        finalUserId: [
          {
            required: true,
            message: this.$t("请选择终面考官"),
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
            message: this.$t("请选择终面时间"),
            trigger: "blur",
          },
        ],
      };
      this.examineRules = {
        examineStatus: [
          {
            required: true,
            message: this.$t("请选择审核结论"),
            trigger: "blur",
          },
        ],
        millTime: [
          {
            required: true,
            message: this.$t("请选择磨课时间"),
            trigger: "blur",
          },
        ],
        millExaUserId: [
          {
            required: true,
            message: this.$t("请选择磨课考官"),
            trigger: "blur",
          },
        ],
        courseAdviceIdList: [
          {
            required: true,
            message: this.$t("请选择老师可教级别"),
            trigger: "blur",
          },
        ],
        tutorStyleLabelList: [
          {
            required: true,
            message: this.$t("请选择老师教学风格"),
            trigger: "blur",
          },
        ],
        // languageLabelList: [{ required: true, message: '请选择老师语言标签', trigger: 'blur' }],
        finalRemark: [
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
        isFinal: [
          {
            required: true,
            message: this.$t("请选择是否完成试讲"),
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
        date1: [
          {
            required: true,
            message: this.$t("请选择磨课日期"),
            trigger: "blur",
          },
        ],
        date2: [
          {
            required: true,
            message: this.$t("请选择磨课时间"),
            trigger: "blur",
          },
        ],
      };
      this.rollbackList = [
        { label: this.$t("新注册"), id: 1 },
        { label: this.$t("试讲阶段"), id: 2 },
        { label: this.$t("教学培训阶段"), id: 3 },
        { label: this.$t("技术培训阶段"), id: 4 },
      ];
    },
    //确认提交审核
    sureSubmitExamine() {
      this.$refs["examineForm"].validate((valid) => {
        if (valid) {
          this.sureSubmitExamineLoading = true;
          if (this.examineForm.date1 && this.examineForm.date2) {
            let str = `${new Date(
              this.examineForm.date1
            ).toLocaleDateString()} ${this.examineForm.date2}`;
            this.examineForm.millTime = new Date(str).toISOString();
          }

          if (this.isAdviseSmall) {
            this.examineForm.isAdviseSmall = 1;
          } else {
            this.examineForm.isAdviseSmall = 0;
          }
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
      // this.$refs['examineForm'].resetFields();
      this.examineForm = this.$options.data().examineForm;
    },
    // 打开审核弹窗
    toExamine(scopeRow) {
      this.examineObj = scopeRow;
      if (this.examineObj.millTrainUserId != null) {
        this.examineForm.millExaUserId = this.examineObj.millTrainUserId;
      }
      if (this.examineObj.millTime) {
        this.examineForm.date1 = new Date(
          scopeRow.millTime
        ).toLocaleDateString();
        let timeh = new Date(scopeRow.millTime).getHours();
        if (timeh < 10) {
          timeh = `0${timeh}`;
        }
        let timem = new Date(scopeRow.millTime).getMinutes();
        if (timem < 10) {
          timem = `0${timem}`;
        }
        this.examineForm.date2 = `${timeh}:${timem}`;
      }
      let flag = this.editionList.find(
        (item) => item.editionId == scopeRow.courseEditionId
      );
      this.currentExamineLevels = [];
      if (flag) {
        this.currentExamineLevels = flag.levelInfoList;
      }
      this.examineDialogFlag = true;
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
      let { pageSize, pageNum, finalUserId, dateType, editionId } = this.screenData;
      let params = {
        finalUserId,
        dateType,
        editionId,
        startTime,
        endTime,
        ...this.userParams,
      };
      this.$Api.tutorManagement
        .getTeacherProcessList(5, pageNum, pageSize, params)
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
