<template>
  <div class="my-customer-wrap">
    <screen-wrapper @search="search" screenTitle="">
      <screen-item
        :label="$t('我的范围')"
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myCustomer.wbmyCustomerScope')
        "
      >
        <CommonTree @get_seleParams="get_seleParams"></CommonTree>
      </screen-item>
      <screen-item
        :label="$t('商机创建时间')"
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myCustomer.dealsCreatTime')
        "
      >
        <el-date-picker
          v-model="businessCreateTime"
          type="daterange"
          :start-placeholder="$t('开始日期')"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 300px"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
      </screen-item>
      <screen-item
        :label="$t('glb-student')"
        v-if="
          Per.handleButtonPer(
            'teach.myWorkbench.myCustomer.nlFilterByStudentName'
          )
        "
      >
        <el-input
          v-model.trim="screenData.studentName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '学生用户名')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item :label="$t('学生ID')">
        <el-input
          clearable
          v-model="screenData.studentUserId"
          :placeholder="$t('请输入学生ID')"
          @keyup.enter.native="search"
        />
      </screen-item>
      <!-- 家长id -->
      <screen-item label="家长id">
        <el-input
          clearable
          class="mr10"
          :placeholder="$t('请输入家长ID查询')"
          v-model="screenData.userParentId"
        ></el-input>
      </screen-item>
      <screen-item
        :label="$t('学科')"
        v-if="Per.handleButtonPer('teach.myWorkbench.myCustomer.subject')"
      >
        <FilterBySpuSubject
          @changeSelect="
            (val) => {
              screenData.subject = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('商机id')"
        v-if="Per.handleButtonPer('teach.myWorkbench.myCustomer.dealsId')"
      >
        <el-input
          v-model.trim="screenData.dealsId"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '商机ID')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        :label="$t('是否成单')"
        v-if="Per.handleButtonPer('teach.myWorkbench.myCustomer.dealsOrder')"
      >
        <el-select
          class="mr10"
          clearable
          v-model="screenData.dealsOrder"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.yesOrNoConfig(currentLang, false)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </screen-item>
      <screen-item
        label
        v-if="Per.handleButtonPer('teach.myWorkbench.myCustomer.canHandover')"
      >
        <div>
          <el-checkbox v-model="screenData.handover"
            >{{ $t("可交接") }}
          </el-checkbox>
        </div>
      </screen-item>
    </screen-wrapper>
    <div class="my-customer-table">
      <custom-card :title="$t('数据列表')" class="table-wrapper">
        <div slot="header-right">
          <el-button
            type="primary"
            @click="createStudentUser()"
            v-if="
              Per.handleButtonPer(
                'teach.myWorkbench.myCustomer.nlCreateStudentUser'
              )
            "
            >{{ $t("创建账号") }}</el-button
          >
        </div>
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          fit
          border
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          @selection-change="handleSelectionChange"
          :height="tableHeight"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('序号')"
            :width="currentLang == 'en' ? 110 : 50"
          >
            <template slot-scope="scope">{{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}</template>
          </el-table-column>
          <!-- 商机ID -->
          <el-table-column
            fixed
            align="center"
            :label="$t('商机id')"
            :width="120"
            prop="dealsId"
          >
          </el-table-column>
          <!-- 学生 -->
          <el-table-column
            fixed
            align="center"
            prop="studentRealName"
            :label="$t('my-home-Student')"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                @click="
                  goStudentDetail(
                    scope.row.studentId,
                    scope.row.studentRealName
                  )
                "
                type="text"
                >{{ scope.row.studentRealName }}
              </el-button>
            </template>
          </el-table-column>
          <!-- 家长ID  -->
          <el-table-column
            fixed
            width="150"
            align="center"
            :label="$t('家长id')"
            prop="parentUserId"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="goParentDetail(scope.row.parentUserId)"
                >{{ scope.row.parentUserId }}</el-button
              >
            </template>
          </el-table-column>
          <!-- 学生id -->
          <el-table-column
            width="150"
            align="center"
            :label="$t('学生id')"
            prop="studentId"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  goStudentDetail(
                    scope.row.studentId,
                    scope.row.studentRealName
                  )
                "
                >{{ scope.row.studentId }}</el-button
              >
            </template>
          </el-table-column>
          <!-- 地区 -->
          <el-table-column
            align="center"
            :label="$t('my-home-2-Country of Residence')"
            :width="currentLang == 'en' ? 150 : 120"
            prop="area"
          ></el-table-column>
          <!-- 课程顾问 -->
          <el-table-column
            align="center"
            :label="$t('课程顾问')"
            :width="currentLang == 'en' ? 150 : 120"
            prop="adviser"
          ></el-table-column>
          <!-- 学科 -->
          <el-table-column
            align="center"
            :label="$t('学科')"
            width="120"
            prop="subjects"
          >
            <template slot-scope="scope">
              <div
                class="text-wrap"
                v-if="scope.row.subjects && scope.row.subjects.length"
              >
                <span
                  v-for="(subject, idx) in scope.row.subjects"
                  :key="subject"
                >
                  {{ $t(SUBJECT_TYPE_CODE_NAME[subject]) }}
                  <span v-if="idx !== scope.row.subjects.length - 1">、</span>
                </span>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <!-- 推荐人 -->
          <el-table-column
            align="center"
            :label="$t('my-home-Referrer')"
            prop="name"
            width="160px"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="goRefferUserDetail(scope.row)"
                >{{ scope.row.referrerName || scope.row.referrerId }}
              </el-button>
            </template>
          </el-table-column>
          <!-- 家长注册时间 -->
          <el-table-column
            align="center"
            :label="$t('家长注册时间')"
            :width="150"
            prop="parentRegisterTime"
          >
            <template slot-scope="scope">
              <span>{{
                DateTimeUtils.dateClockTime(scope.row.parentRegisterTime)
              }}</span>
            </template>
          </el-table-column>
          <!-- 商机创建时间 -->
          <el-table-column
            align="center"
            :label="$t('商机创建时间')"
            :width="150"
            prop="dealsCreateTime"
          >
            <template slot-scope="scope">
              <span>{{
                DateTimeUtils.dateClockTime(scope.row.dealsCreateTime)
              }}</span>
            </template>
          </el-table-column>
          <!-- 试听课信息 -->
          <el-table-column
            align="center"
            :label="$t('试听课信息')"
            :width="currentLang == 'en' ? 150 : 120"
            prop="attemptCourseInfos"
          >
            <template slot-scope="scope">
              <p
                v-for="item in scope.row.attemptCourseInfos"
                :key="item.course + item.status"
              >
                <span>{{
                  currentLang === "en" ? item.courseEn : item.courseZh
                }}</span>
                <span>{{ item.status | mapStudentProcess }}</span>
              </p>
            </template>
          </el-table-column>
          <!-- 课程进度 -->
          <el-table-column
            align="center"
            :label="$t('schedule-课表')"
            :width="300"
            prop="plannedSpeeds"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.plannedSpeeds && scope.row.plannedSpeeds.length"
              >
                <div
                  v-for="item in scope.row.plannedSpeeds"
                  :key="item.studentPlanId"
                >
                  <div>
                    <span v-if="item.subjectSpeedEn || item.subjectSpeedZh"
                      >{{
                        currentLang === "en"
                          ? item.subjectSpeedEn || "-"
                          : item.subjectSpeedZh || "-"
                      }}：</span
                    >
                    <span v-else>{{ $t("无进度") }}：</span>
                    <!-- 交接过，直接展示学管名称，隐藏交接按钮 -->
                    <template v-if="item.hasLa">
                      <span>{{ item.xgUserName }}</span>
                    </template>
                    <!-- 没交接过 -->
                    <template v-else>
                      <span>-</span>
                      <!-- 可以交接 -->
                      <el-button
                        v-if="item.handover"
                        type="text"
                        @click="onHandover(scope.row, item)"
                        >{{ $t("交接") }}</el-button
                      >
                      <!-- 不可交接：显示交接按钮并置灰：nonHandoverStatus - 1：无对应课时进度 2：交接中-->
                      <template v-else>
                        <el-popover
                          placement="top-start"
                          width="200"
                          trigger="hover"
                          :content="
                            item.nonHandoverStatus === 1
                              ? $t('无付费课时，无法交接')
                              : $t('交接中')
                          "
                        >
                          <span
                            style="
                              color: #c0c4cc;
                              height: 32px;
                              line-height: 32px;
                              cursor: pointer;
                            "
                            slot="reference"
                            >{{ $t("交接") }}</span
                          >
                        </el-popover>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <!-- 剩余课时 -->
          <el-table-column
            align="center"
            :label="$t('剩余课时')"
            :width="currentLang == 'en' ? 160 : 120"
            prop="surplusCourseHours"
          >
            <template slot-scope="scope">
              <p
                v-for="item in scope.row.surplusCourseHours"
                :key="item.course"
              >
                <span
                  >{{
                    currentLang === "en" ? item.courseEn : item.courseZh
                  }}：</span
                >
                <span>{{ item.surplusHours || 0 }}</span>
              </p>
            </template>
          </el-table-column>
          <!-- 订单 -->
          <el-table-column
            align="center"
            :label="$t('订单')"
            :width="300"
            prop="orders"
          >
            <template slot-scope="scope">
              <p v-for="(item, idx) in scope.row.orders" :key="idx">
                <span
                  >{{
                    currentLang === "en" ? item.courseEn : item.courseZh
                  }}：{{ item.hours || 0 }}</span
                >
              </p>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column
            align="center"
            fixed="right"
            :label="$t('操作')"
            :width="150"
          >
            <template slot-scope="scope">
              <!-- 复制链接 -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{ $t("复制链接")
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="showCopyLinkDialog(scope.row, 'zh')"
                    >{{ $t("复制中文链接") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myCustomer.copyELlink'
                      )
                    "
                    @click.native="showCopyLinkDialog(scope.row, 'en')"
                    >{{ $t("复制英文链接") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myCustomer.copyMAlink'
                      )
                    "
                    @click.native="showCopyLinkDialog(scope.row, 'ma')"
                    >{{ $t("复制数学链接") }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 选择海报 -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{ $t("查看海报")
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myCustomer.chinesePoster'
                      )
                    "
                    @click.native="showPosterDialog(scope.row, 'zh')"
                    >{{ $t("中文海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myCustomer.englishPoster'
                      )
                    "
                    @click.native="showPosterDialog(scope.row, 'en')"
                    >{{ $t("英文海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myCustomer.mathPoster'
                      )
                    "
                    @click.native="showPosterDialog(scope.row, 'ma')"
                    >{{ $t("数学海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="showPosterDialog(scope.row, 'mu')"
                    >{{ $t("音乐海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(scope.row, 'zh', 'ops/poster/list/group')
                    "
                    >{{ $t("中文团购海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(scope.row, 'en', 'ops/poster/list/group')
                    "
                    >{{ $t("英文团购海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(scope.row, 'ma', 'ops/poster/list/group')
                    "
                    >{{ $t("数学团购海报") }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <br />
              <el-button
                v-if="
                  Per.handleButtonPer(
                    'teach.myWorkbench.myCustomer.nlResetPassword'
                  )
                "
                type="text"
                @click="resetpassword(scope.row.parentUserId)"
                >{{ $t("student-management-Reset Password") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </custom-card>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <CustomerDetail
      :showCustomerDetail="showCustomerDetail"
      :customerInfo="customerInfo"
      @closeCustomerDetailDialog="closeCustomerDetailDialog"
      @preUser="preUser"
      @nextUser="nextUser"
    ></CustomerDetail>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('student-management-Assign Course Consultant')"
      :visible.sync="closeAdviser"
      width="30%"
    >
      <el-form>
        <el-form-item :label="$t('课程顾问')">
          <el-select
            filterable
            v-model="adviserSubmit.course_adviser_id"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="(item, index) in gwTeacherList"
              :key="index"
              :label="
                item.nameEn +
                `${item.nameEn && item.nameZh ? '-' : ''}` +
                item.nameZh
              "
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="btn-wrapper text-center">
          <el-button @click="closeAdviser = false">{{ $t("取消") }}</el-button>
          <el-button type="primary" @click="submitAdviser">{{
            $t("my-home-Confirm")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <CreateStudentUserDialog
      v-if="showCreateSDialog"
      :showCreateSDialog="showCreateSDialog"
      @getNewStudentListData="getTableData"
      @closeCreateStudentUser="closeCreateStudentUser"
    />
    <PosterPopUp
      v-if="info && showPoster"
      :show="showPoster"
      :info="info"
      :lang="posterLang"
      @handleClose="handleClose"
      :loc="loc"
    />
    <CopyLinkDialog
      v-if="info && copyLinkVisibility"
      :visible.sync="copyLinkVisibility"
      :currentItem="info"
      :lang="posterLang"
    />
    <HandoverStudents
      v-if="isShowDialog"
      :visible.sync="isShowDialog"
      :current-info="currentTransfer"
      :taskLine="1"
      @refreshPage="search()"
    />
  </div>
</template>
<script>
import CreateStudentUserDialog from "../../studentManagement/subPage/CreateStudentUserDialog";
import CustomerDetail from "../components/customerDetail";
import { mapState, mapGetters } from "vuex";
import CommonTree from "../../reportManagement/commonTree";
import PosterPopUp from "../components/posterPopUp.vue";
import { parentIdValidate } from "@/utils/reg.js";
import Constants from "@/utils/constants";
import CopyLinkDialog from "../components/copyLinkDialog.vue";
import HandoverStudents from "../../Task/handoverStudents/index.vue";
import FilterBySpuSubject from "@/components/FilterItem/CommodityFilter/FilterBySpuSubject";
import { SUBJECT_TYPE_CODE_NAME } from "@/utils/constants";

export default {
  name: "MyCustomer",
  components: {
    CustomerDetail,
    CreateStudentUserDialog,
    CommonTree,
    PosterPopUp,
    CopyLinkDialog,
    HandoverStudents,
    FilterBySpuSubject,
  },
  data() {
    return {
      tableHeight: window.innerHeight - 165,
      SUBJECT_TYPE_CODE_NAME,
      copyLinkVisibility: false,
      tableData: [],
      loading: false,
      screenData: {
        pageNum: 1,
        pageSize: 50,
        startDate: null,
        endDate: null,
        studentName: "",
        userParentId: "",
        subject: null,
        dealsId: "", // 商机id
        dealsOrder: null, // 是否成单
        handover: "",
        studentUserId: "",
      },
      total: 0,
      showCustomerDetail: false,
      customerInfo: {},
      currentScopeIndex: -1,
      showCreateSDialog: false,
      closeAdviser: false,
      adviserSubmit: {
        student_ids: [],
        course_adviser_id: "",
      },
      businessCreateTime: [],
      showPoster: false,
      info: null,
      isShowDialog: false,
      currentTransfer: null,
      posterLang: null,
      loc: null,
    };
  },
  computed: {
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    ...mapGetters(["currentLang"]),
    ...mapState({
      xgAndGwList: (state) => state.user.xgAndGwList,
      currentLang: (state) => state.app.currentLang,
    }),
    gwTeacherList() {
      return this.xgAndGwList.filter((item) => item.roleName == "课程顾问");
    },
  },
  watch: {
    businessCreateTime(newData) {
      if (newData === null) {
        this.screenData.startDate = "";
        this.screenData.endDate = "";
      } else {
        this.screenData.startDate = new Date(newData[0]).toISOString();
        this.screenData.endDate = new Date(newData[1]).toISOString();
      }
    },
  },
  methods: {
    onHandover(row, course) {
      /* 交接 */
      this.currentTransfer = row;
      this.currentTransfer.course = course;
      this.isShowDialog = true;
    },
    goParentDetail(pid) {
      this.$router.push(`/studentManagement/parentInfo?parentUserId=${pid}`);
    },
    // 海报弹窗
    showPosterDialog(row, lang, loc) {
      this.loc = loc||'ops/poster/list';
      this.posterLang = lang;
      this.info = row;
      this.showPoster = true;
    },
    //获取范围组件的值
    get_seleParams(val, valName) {
      if (valName === "postIdList") {
        this.screenData.userIdStr = "";
        this.screenData.postIdStr = val.join(",");
      } else if (valName === "userIdList") {
        this.screenData.postIdStr = "";
        this.screenData.userIdStr = val.join(",");
      } else if (valName === "clear") {
        this.screenData.postIdStr = "";
        this.screenData.userIdStr = "";
      }
      this.getTableData();
    },
    goStudentDetail(studentId, studentName) {
      this.$router.push(
        `/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`
      );
    },
    // 创建学生账号 打开弹窗
    createStudentUser() {
      this.showCreateSDialog = true;
    },
    closeCreateStudentUser() {
      this.showCreateSDialog = false;
    },
    // 提交分配 新用户迁移
    submitAdviser() {
      let { course_adviser_id, student_ids } = this.adviserSubmit;
      let params = {
        adviserId: course_adviser_id,
        parentIdList: student_ids,
      };
      this.$Api.studentManagement
        .studentAdviser(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: this.$t("Allocation succeeded"),
              type: "success",
            });
            this.closeAdviser = false;
            this.getTableData();
          }
        });
    },
    handleClose() {
      this.info = null;
      this.showPoster = false;
    },
    // 全选
    handleSelectionChange(val) {
      this.adviserSubmit.student_ids = val.map((item) => item.parentUserId);
    },
    // 重置密码
    resetpassword(id) {
      var username = "";
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          username = this.tableData[i].studentRealName;
        }
      }
      this.$confirm(
        this.$t("student-management-Confirm reset password", {
          username: username,
        }),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("my-home-Confirm"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      )
        .then(() => {
          this.$Api.classManagement.resetCUserPsw(id, 1).then((res) => {
            if (res.status === 200) {
              this.$notify({
                type: "success",
                message: this.$t("reset successfully"),
              });
            }
          });
        })
        .catch((_) => {});
    },
    getSortClass(key) {
      const sort = this.screenData.ordering;
      return sort === `${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    },
    // 筛选
    search() {
      if (
        this.screenData &&
        this.screenData.userParentId &&
        !parentIdValidate(this, this.screenData.userParentId)
      ) {
        return;
      }
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    resetPosterInfo() {
      this.$set(this.posterInfo, "username", "");
      this.$set(this.posterInfo, "registration", "");
      this.$set(this.posterInfo, "referrerUrl", "");
      this.$set(this.posterInfo, "avatarImgUrl", "");
    },
    showCopyLinkDialog(item, lang) {
      this.copyLinkVisibility = true;
      this.info = item;
      this.posterLang = lang;
    },

    goRefferUserDetail({ referrerId }) {
      this.$router.push(
        `/studentManagement/parentInfo?parentUserId=${referrerId}`
      );
    },
    getTableData() {
      this.loading = true;
      let objs = this.screenData;
      if (!this.screenData.startDate) {
        objs.startDate = null;
      }
      if (!this.screenData.endDate) {
        objs.endDate = null;
      }
      let {
        pageNum,
        pageSize,
        courseLevel,
        endDate,
        startDate,
        studentName,
        postIdStr,
        userIdStr,
        dealsId,
        dealsOrder,
        handover,
        subject,
        userParentId,
        parentUserId,
        studentUserId,
      } = objs;
      let obj = {
        postIdStr,
        userIdStr,
        courseLevel,
        startDate,
        endDate,
        studentName,
        userParentId,
        pageNum,
        pageSize,
        dealsId,
        dealsOrder,
        handover,
        subject,
        userId: this.nowUserInfo.id,
        parentUserId,
        studentUserId,
      };
      let params = {};
      for (var k in obj) {
        if (obj[k] !== "" && obj[k] !== null) {
          params[k] = obj[k];
        }
      }
      this.$Api.workBench.getMyCustomerList(params).then(({ data, code }) => {
        if (data.code === 200) {
          this.tableData = (data.data.list || []).map((item) => {
            return {
              ...item,
              link: `${item.webReferrerUrl}`,
            };
          });
          this.total = data.data != null ? data.data.total : 0;
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
    showCustomerDetailDialog(scoprRow, scopeIndex) {
      this.currentScopeIndex = scopeIndex;
      this.customerInfo = JSON.parse(JSON.stringify(scoprRow));
      this.showCustomerDetail = true;
    },
    preUser() {
      if (this.currentScopeIndex == 0) {
        return false;
      } else {
        this.currentScopeIndex -= 1;
        this.customerInfo = JSON.parse(
          JSON.stringify(this.tableData[this.currentScopeIndex])
        );
        return true;
      }
    },
    nextUser() {
      if (this.currentScopeIndex == this.tableData.length - 1) {
        return false;
      } else {
        this.currentScopeIndex += 1;
        this.customerInfo = JSON.parse(
          JSON.stringify(this.tableData[this.currentScopeIndex])
        );
        return true;
      }
    },
    closeCustomerDetailDialog() {
      this.showCustomerDetail = false;
    },
  },
};
</script>
<style lang="scss" scope>
.my-customer-wrap {
  padding: 10px 0 0 10px;
  .el-dropdown-link {
    cursor: pointer;
    color: #7580e5;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
