<template>
  <div class="new-registry-wrap">
    <div class="search-wrap">
      <el-date-picker
        clearable
        v-model="applyDate"
        type="daterange"
        style="width: 300px"
        range-separator="-"
        :start-placeholder="$t('开始日期')"
        :default-time="['00:00:00', '23:59:59']"
        :end-placeholder="$t('结束日期')"
      >
      </el-date-picker>
      <el-select
        clearable
        filterable
        v-model="screenData.recruitUserId"
        :placeholder="
          $t('my-home-Select') + (currentLang == 'en' ? ' ' : '招聘专员')
        "
      >
        <el-option
          v-for="item in recruitUserList"
          :key="item.id"
          :label="item.userName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-input
        clearable
        v-model="screenData.tutorName"
        style="width: 15%"
        :placeholder="
          $t('glb-input') + (currentLang == 'en' ? ' ' : '老师账号')
        "
      ></el-input>
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
          :label="$t('my-home-Registration Date')"
          width="150"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
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
            <span>{{ Filters.mapGender(scope.row.gender, currentLang) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('招聘专员')"
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
            <el-button type="text" @click="handleDistribution(scope.row)">{{
              $t("student-management-Assign")
            }}</el-button
            ><span> | </span>
            <el-button
              :disabled="scope.row.recruitUserId == null"
              @click="toExamine(scope.row)"
              type="text"
              >{{ $t("Audit") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
      <!-- 审核 start -->
      <div class="examine-wrap">
        <el-dialog
          :before-close="closeExamine"
          :close-on-click-modal="false"
          :title="$t('审核资料')"
          center
          :visible.sync="examineDialogFlag"
        >
          <div>
            <el-form
              :model="examineForm"
              :rules="examineRules"
              ref="examineForm"
              :label-width="currentLang == 'en' ? '150px' : '100px'"
              class="examine-form"
            >
              <el-form-item :label="$t('审核结论')" prop="examineStatus">
                <el-radio-group v-model="examineForm.examineStatus">
                  <el-radio :label="3">{{
                    $t("资料审核通过并进入试讲阶段")
                  }}</el-radio>
                  <el-radio :label="4">{{ $t("淘汰") }}</el-radio>
                  <el-radio :label="5">{{ $t("老师主动放弃") }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="examineForm.examineStatus == 3"
                :label="$t('试讲版本')"
                prop="courseEditionId"
              >
                <el-select
                  v-model="examineForm.courseEditionId"
                  clearable
                  :placeholder="
                    $t('my-home-Select') + (currentLang == 'en' ? '' : '版本')
                  "
                >
                  <el-option
                    v-for="item in editionList"
                    :key="item.editionId"
                    :label="
                      currentLang == 'en'
                        ? item.editionNameEn
                        : item.editionNameZh
                    "
                    :value="item.editionId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="examineForm.examineStatus == 3"
                :label="$t('试讲时间')"
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
                :label="$t('试讲考官')"
                prop="tryUserId"
              >
                <el-select
                  style="width: 400px"
                  v-model="examineForm.tryUserId"
                  reserve-keyword
                  remote
                  filterable
                  :placeholder="' ' + $t('请搜索作为试讲考官的老师')"
                  :remote-method="remoteMethod"
                  :loading="remoteLoading"
                >
                  <el-option
                    v-for="item in filterTeacherOptions"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  >
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      "
                    >
                      <span>{{ item.userName }}</span>
                      <span style="color: #666">{{ item.realName }}</span>
                      <span style="color: #8492a6; font-size: 13px">{{
                        item.phone
                      }}</span>
                    </div>
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
                    (currentLang == 'en' ? '' : '淘汰原因')
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
                    (currentLang == 'en' ? '' : '放弃原因')
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
                v-if="examineForm.examineStatus == 3"
                :label="$t('student-info-Notes')"
                prop="regRemark"
              >
                <el-input
                  type="textarea"
                  maxlength="500"
                  show-word-limit
                  :rows="4"
                  :placeholder="
                    $t('glb-input') + (currentLang == 'en' ? '' : '内容')
                  "
                  v-model="examineForm.regRemark"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="
                  examineForm.examineStatus == 4 ||
                  examineForm.examineStatus == 5
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
                    $t('glb-input') + (currentLang == 'en' ? '' : '内容')
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
          :title="$t('分配招聘专员')"
          center
          :visible.sync="distributionDialogFlag"
        >
          <div class="distribution-form-wrap">
            <el-form
              :model="distributionForm"
              ref="distributionForm"
              :label-width="currentLang === 'en' ? '200px' : '100px'"
              class="distribution-form"
            >
              <el-form-item :label="$t('招聘专员')" prop="recruitUserId">
                <el-select
                  filterable
                  clearable
                  v-model="distributionForm.recruitUserId"
                  :placeholder="
                    $t('my-home-Select') +
                    (currentLang == 'en' ? ' ' : '招聘专员')
                  "
                >
                  <el-option
                    v-for="item in recruitUserList"
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
              :loading="distributionLoading"
              >{{ $t("my-home-Confirm") }}</el-button
            >
          </span>
        </el-dialog>
      </div>
      <!-- 分配 end -->
    </div>
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
  },
  components: {
    FilterByUserAccount,
  },
  data() {
    return {
      userParams: {},
      editionList: [],
      distributionLoading: false,
      currentObj: null,
      filterTeacherOptions: [],
      teacherOptions: [],
      applyDate: [],
      total: 0,
      loading: false,
      remoteLoading: false,
      tableData: [],
      screenData: {
        pageSize: 50,
        pageNum: 1,
        recruitUserId: "",
      },
      recruitUserList: [], // hr
      examineDialogFlag: false, // 审核资料 dialog show or hide
      examineForm: {
        examineStatus: 3, //审核状态
        courseEditionId: 1, //试讲版本 id
        tryTime: "", // 试讲时间
        tryUserId: "", //试讲考官id
        regRemark: "", //试讲审核备注
        outReasonId: "", //淘汰原因 / 放弃原因
        outRemark: "", // 淘汰备注 / 放弃备注
        date1: "",
        date2: "",
      },
      examineRules: {},
      distributionDialogFlag: false, //分配 dialog show or hide
      distributionForm: {
        recruitUserId: "",
      },
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
    examineDialogFlag(newData) {
      if (newData) {
      }
    },
    examineStatus(newData) {
      this.examineForm = this.$options.data().examineForm;
      this.$refs["examineForm"].resetFields();
      this.examineForm.examineStatus = newData;
    },
    // 审核弹窗也监听一下，如果打开的时候 teacherOptions 还没数据，就拉一下子
    examineDialogFlag(newData) {
      if (newData && this.teacherOptions.length == 0) {
        let code = "tutor";
        this.$Api.tutorManagement.getRoleList(code).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.teacherOptions = data.data;
          }
        });
      }
    },
    currentLang() {
      this.initData();
    },
  },
  methods: {
    // 获取课程版本
    reqCourseEdition() {
      this.$Api.base.courseEdition().then(({ data }) => {
        if (data.code === 200) {
          this.editionList = data.data || [];
        }
      });
    },
    initData() {
      var checkUserName = (rule, value, cb) => {
        const regPhone = /^1[3456789]\d{9}$/,
          regEmail =
            /^[A-Za-z0-9][_\.-/-^_~A-Za-z0-9]*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
        if (regPhone.test(value) || regEmail.test(value)) {
          return cb();
        } else {
          cb(new Error(this.$t("教师账号需要是手机号或者邮箱")));
        }
      };
      this.examineRules = {
        examineStatus: [
          {
            required: true,
            message: this.$t("my-home-Select") + this.$t("审核结论"),
            trigger: "blur",
          },
        ],
        courseEditionId: [
          {
            required: true,
            message: this.$t("my-home-Select") + this.$t("试讲版本"),
            trigger: "blur",
          },
        ],
        date1: [
          {
            required: true,
            message: this.$t("my-home-Select") + this.$t("试讲日期"),
            trigger: "blur",
          },
        ],
        date2: [
          {
            required: true,
            message: this.$t("my-home-Select") + this.$t("试讲时间"),
            trigger: "blur",
          },
        ],
        tryUserId: [
          {
            required: true,
            message: this.$t("my-home-Select") + this.$t("试讲考官"),
            trigger: "blur",
          },
        ],
        regRemark: [
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
      };
    },
    search() {
      this.screenData.pageNum = 1;
      this.screenData.pageSize = 50;
      this.getTableData();
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    // 远程搜索方法
    remoteMethod(query) {
      if (query !== "") {
        this.remoteLoading = true;
        setTimeout(() => {
          this.filterTeacherOptions = this.teacherOptions.filter((item) => {
            var upperCase = query.toLocaleUpperCase();
            if (
              item.userName &&
              item.userName.toLocaleUpperCase().indexOf(upperCase) !== -1
            ) {
              return item;
            }
            if (
              item.realName &&
              item.realName.toLocaleUpperCase().indexOf(upperCase) !== -1
            ) {
              return item;
            }
            if (
              item.identityName &&
              item.identityName.toLocaleUpperCase().indexOf(upperCase) !== -1
            ) {
              return item;
            }
          });
          this.remoteLoading = false;
        }, 200);
      } else {
        this.filterTeacherOptions = [];
      }
    },
    // 打开审核弹窗
    toExamine(scopeRow) {
      this.examineObj = scopeRow;
      this.examineDialogFlag = true;
    },
    // 关闭审核弹窗
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
          if (this.examineForm.date1) {
            let str = `${new Date(
              this.examineForm.date1
            ).toLocaleDateString()} ${this.examineForm.date2}`;
            this.examineForm.tryTime = new Date(str).toISOString();
          }
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

    // 获取招聘专员 select列表
    getRecruitUserList() {
      let code = "zhaopinzhuanyuan";
      this.$Api.tutorManagement.getRoleList(code).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.recruitUserList = data.data;
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
      this.currentObj = scopeRow;
      this.distributionDialogFlag = true;
    },
    // 确认提交分配
    sureDistribution() {
      this.distributionLoading = true;
      this.$Api.tutorManagement
        .distributionApi(this.currentObj.id, this.distributionForm)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: this.$t("Allocation succeeded"),
              type: "success",
            });
            this.distributionLoading = false;
            this.closeDistribution();
            this.getTableData();
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
      let { pageNum, pageSize, recruitUserId } = this.screenData;
      console.log(this.userParams);
      let params = {
        startTime,
        endTime,
        recruitUserId,
      };

      this.$Api.tutorManagement
        .getTeacherProcessList(1, pageNum, pageSize, {
          ...params,
          ...this.userParams,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
  },
  created() {
    this.reqCourseEdition();
    this.initData();
    this.getRecruitUserList();
    this.getTableData();
  },
};
</script>
