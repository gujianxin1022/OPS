<template>
  <div class="my-student-wrap">
    <screen-wrapper @search="search" screenTitle>
      <screen-item
        :label="$t('我的范围')"
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myStudent.olFilterByUserScope')
        "
      >
        <CommonTree @get_seleParams="get_seleParams"></CommonTree>
      </screen-item>
      <!-- 课程包 -->
      <screen-item
        :label="$t('课程包')"
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myStudent.filterByCoursePkg')
        "
      >
        <el-select
          filterable
          clearable
          v-model="screenData.coursePackageId"
          :placeholder="$t('请选择课程包')"
          @change="handleCoursePackageChange"
        >
          <el-option
            v-for="item of coursePackageList"
            :key="item.packageId"
            :label="getCoursePackageName(item)"
            :value="item.packageId"
          />
        </el-select>
      </screen-item>
      <!-- 版本 -->
      <screen-item
        :label="$t('版本')"
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myStudent.filterByEdition')
        "
      >
        <el-select
          clearable
          filterable
          v-model="screenData.packageTreeId"
          :placeholder="$t('版本')"
        >
          <el-option
            v-for="item of packageTreeList"
            :key="item.packageTreeId"
            :label="
              currentLang === 'en'
                ? item.editionNameOpsEn
                : item.editionNameOpsZh
            "
            :value="item.packageTreeId"
          />
        </el-select>
      </screen-item>
      <!-- 学生 -->
      <screen-item
        v-if="
          Per.handleButtonPer(
            'teach.myWorkbench.myStudent.olFilterByStudentName'
          )
        "
        :label="$t('glb-student')"
      >
        <el-input
          v-model.trim="screenData.studentName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '学生用户名')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <!-- 家长ID -->
      <screen-item
        v-if="
          Per.handleButtonPer(
            'teach.myWorkbench.myStudent.olFilterByParentName'
          )
        "
        :label="$t('家长id')"
      >
        <el-input
          v-model.trim="screenData.parentUserId"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '家长ID')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <!-- 学科 -->
      <screen-item
        :label="$t('学科')"
        v-if="Per.handleButtonPer('teach.myWorkbench.myStudent.subject')"
      >
        <FilterBySpuSubject
          @changeSelect="
            (val) => {
              screenData.courseType = val;
            }
          "
        />
      </screen-item>
    </screen-wrapper>
    <!-- 下拉 -->
    <div class="my-student-table">
      <custom-card :title="$t('数据列表')" class="table-wrapper">
        <el-table
          :span-method="spanMethod"
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          ref="multipleTable"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('序号')"
            :width="currentLang == 'en' ? 110 : 50"
          >
            <template slot-scope="scope">
              {{
                (screenData.pageNum - 1) * screenData.pageSize +
                scope.$index +
                1
              }}
            </template>
          </el-table-column>
          <!-- 学生 -->
          <el-table-column
            fixed
            align="center"
            :label="$t('my-home-Students')"
            :width="120"
            prop="studentName"
          >
            <template slot-scope="scope">
              <el-button
                @click="
                  goStudentDetail(scope.row.studentId, scope.row.studentName)
                "
                type="text"
                >{{ scope.row.studentName || "-" }}</el-button
              >
            </template>
          </el-table-column>

          <!-- 学生ID -->
          <el-table-column
            fixed
            align="center"
            :label="$t('my-home-Students ID')"
            :width="120"
            prop="studentId"
          >
            <template slot-scope="scope">
              <el-button
                @click="
                  goStudentDetail(scope.row.studentId, scope.row.studentName)
                "
                type="text"
                >{{ scope.row.studentId || "-" }}</el-button
              >
            </template>
          </el-table-column>
          <!-- 家长 -->
          <el-table-column
            fixed
            align="center"
            prop="parentUserId"
            :label="$t('家长id')"
            width="150"
          >
            <template slot-scope="scope">
              <span>
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: scope.row.parentUserId },
                  }"
                >
                  <el-button type="text">
                    {{ scope.row.parentUserId || "-" }}
                  </el-button>
                </router-link>
              </span>
            </template>
          </el-table-column>
          <!-- 地区 -->
          <el-table-column
            align="center"
            :label="$t('my-home-1-Country of Residence')"
            :width="currentLang == 'en' ? 150 : 120"
            prop="area"
          ></el-table-column>
          <!-- 年龄 -->
          <el-table-column
            align="center"
            :label="$t('my-home-Age')"
            :width="50"
            prop="age"
          >
          </el-table-column>
          <!-- 性别 -->
          <el-table-column
            align="center"
            :label="$t('my-home-Gender')"
            :width="50"
            prop="gender"
          >
            <template slot-scope="scope">
              <span>
                {{ Filters.mapGender(scope.row.gender, currentLang) }}
              </span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            align="center"
            :label="$t('创建时间')"
            :width="150"
            prop="createTime"
          >
            <template slot-scope="scope">
              <span>
                {{ DateTimeUtils.dateClockTime(scope.row.createTime) }}
              </span>
            </template>
          </el-table-column>
          <!-- 学科 -->
          <el-table-column
            align="center"
            :label="$t('学科')"
            width="120"
            prop="courseList"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <span>{{
                  Filters.getSubjectLabel(item.courseType, currentLang)
                }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 试听课情况 -->
          <el-table-column
            align="center"
            :label="$t('试听课情况')"
            :width="120"
            prop="trialLessonsInfo"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <div
                  v-if="item.trialLessonsInfo && item.trialLessonsInfo.length"
                >
                  <p
                    v-for="t in item.trialLessonsInfo"
                    :key="t + item.trialStatus"
                  >
                    {{ currentLang === "en" ? t.trialCourseEn : t.trialCourseZh
                    }}{{ t.trialStatus ? ":" : ""
                    }}{{
                      Constants.getTrialClassStatus(currentLang, t.trialStatus)
                    }}
                  </p>
                </div>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <!-- 课程进度 -->
          <el-table-column
            align="center"
            :label="$t('课程进度')"
            :width="160"
            prop="normalLessonsInfo"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <div v-if="item.normalLessonsInfo">
                  {{
                    currentLang === "en"
                      ? item.normalLessonsInfo.courseProgressEn
                      : item.normalLessonsInfo.courseProgressZh
                  }}
                </div>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <!-- 顾问 -->
          <el-table-column
            align="center"
            :label="$t('课程顾问')"
            :width="currentLang == 'en' ? 130 : 120"
            prop="adviser"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <span>{{ item.adviserUserName || "--" }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 学管 -->
          <el-table-column
            align="center"
            :label="$t('学管老师')"
            :width="120"
            prop="xgUserName"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <span>{{ item.xgUserName || "--" }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 剩余课时 -->
          <el-table-column
            align="center"
            prop="residueHour"
            :label="$t('剩余课时')"
            :width="150"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <div v-if="item.residueHour">
                  <span
                    >{{
                      currentLang === "en"
                        ? item.residueHour.courseEn
                        : item.residueHour.courseZh
                    }}：{{ item.residueHour.surplusHours }}</span
                  >
                </div>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <!-- 上次正常完课时间 -->
          <el-table-column
            align="center"
            :label="$t('my-home-Previous Lesson')"
            :width="150"
            prop="name"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <span>{{ item.beforeFinishClassTime || "--" }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 距离今天天数 -->
          <el-table-column
            align="center"
            :label="$t('my-home-Days from Last Lesson')"
            :width="currentLang == 'en' ? 160 : 120"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <span>{{ item.finishClassDay }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 下次上课时间 -->
          <el-table-column
            align="center"
            :label="$t('my-home-Next Lesson')"
            :width="150"
            prop="name"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <span>{{ item.nextClassTime || "--" }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 上次备注时间 -->
          <el-table-column
            align="center"
            prop="lastRemark"
            :label="$t('Last remark time')"
            width="150"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.courseList" :key="item.courseId">
                <span>{{ item.beforeRemarkTime || "-" }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column
            align="center"
            :label="$t('操作')"
            fixed="right"
            width="200"
          >
            <template slot-scope="scope">
              <span
                class="operation-col"
                v-for="item in scope.row.courseList"
                :key="item.courseId"
              >
                <!-- 复制链接 -->
                <el-button
                  slot="reference"
                  type="text"
                  @click="showCopyLinkDialog(scope.row, item.courseType)"
                  >{{ $t("复制专属链接") }}</el-button
                >
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
                          'teach.myWorkbench.myStudent.chinesePoster'
                        )
                      "
                      @click.native="showPosterDialog(scope.row, 'zh')"
                      >{{ $t("中文海报") }}</el-dropdown-item
                    >
                    <el-dropdown-item
                      :disabled="
                        !Per.handleButtonPer(
                          'teach.myWorkbench.myStudent.englishPoster'
                        )
                      "
                      @click.native="showPosterDialog(scope.row, 'en')"
                      >{{ $t("英文海报") }}</el-dropdown-item
                    >
                    <el-dropdown-item
                      :disabled="
                        !Per.handleButtonPer(
                          'teach.myWorkbench.myStudent.mathPoster'
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
                        showPosterDialog(
                          scope.row,
                          'zh',
                          'ops/poster/list/group'
                        )
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
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="`https://student.lingoace.com/evaluate/result/index.html?studentId=${scope.row.studentUserId}`"
                  placement="top-start"
                >
                  <el-button
                    v-if="
                      Per.handleButtonPer(
                        'teach.myWorkbench.myStudent.testlink'
                      )
                    "
                    type="text"
                    :disabled="item.courseType === 2"
                    @click="testlink(scope.row)"
                    >{{ $t("测评链接") }}</el-button
                  >
                </el-tooltip>
              </span>
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
    <PosterPopUp
      v-if="info && showPoster"
      :show="showPoster"
      :lang="posterLang"
      :info="info"
      @handleClose="handleClosePoster"
      :loc="loc"
    />
    <CopyLinkDialog
      v-if="info && copyLinkVisibility"
      :visible.sync="copyLinkVisibility"
      :currentItem="info"
      :lang="linkLang"
    />
  </div>
</template>
<script>
import PosterPopUp from "../components/posterPopUp.vue";
import CustomerDetail from "../components/customerDetail";
import { parentIdValidate } from "@/utils/reg.js";
import { mapGetters, mapState } from "vuex";
import CommonTree from "../../reportManagement/commonTree";
import Constants from "@/utils/constants";
import { copyLink } from "@/utils/file";
import CopyLinkDialog from "../components/copyLinkDialog.vue";
import FamilyLaList from "../../Task/components/familyLaList";
import FilterBySpuSubject from "@/components/FilterItem/CommodityFilter/FilterBySpuSubject";

export default {
  name: "MyStudent",
  components: {
    CustomerDetail,
    CommonTree,
    PosterPopUp,
    CopyLinkDialog,
    FamilyLaList,
    FilterBySpuSubject,
  },
  data() {
    return {
      parentId: -1,
      tableData: [],
      loading: false,
      coursePackageList: [],
      tableHeight: window.innerHeight - 200 || 300,
      screenData: {
        funcCode: 200300, // LA岗位编,
        programmeName: "", // 版本
        courseLevel: "", // 级别
        studentName: "",
        parentUserId: "",
        courseType: "", // 学科：1中文 2英文
        pageNum: 1,
        page: 1,
        pageSize: 50,
        coursePackageId: "",
        packageTreeId: "",
      },
      total: 0,
      editionList: [],
      showPoster: false,
      copyLinkVisibility: false,
      info: null,
      coursePackageList: [],
      packageTreeList: [],
      coursePackageLoading: false,
      packageTreeLoading: false,
      isBatch: false,
      posterLang: null,
      linkLang: null,
      loc: "",
    };
  },
  computed: {
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    ...mapGetters(["currentLang"]),
    levelList() {
      let result = this.editionList.find(
        (item) => item.editionId == this.screenData.programmeName
      );
      if (result != undefined) {
        return result.courseLevelInfoList || [];
      } else {
        this.screenData.courseLevel = "";
        return [];
      }
    },
  },
  watch: {
    "screenData.labelInfo": function (newData) {
      this.getTableData();
    },
  },
  methods: {
    async handleCoursePackageChange(val) {
      if (!val) {
        this.packageTreeList = [];
        this.screenData.packageTreeId = "";
        return;
      }
      this.screenData.packageTreeId = "";
      this.queryPackageTreeList();
    },

    async queryPackageTreeList() {
      try {
        this.packageTreeLoading = true;
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryPackageTreeList({
          packageId: this.screenData.coursePackageId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.packageTreeList = data;
      } finally {
        this.packageTreeLoading = false;
      }
    },
    //获取全量课程包
    async queryClassPackageList() {
      try {
        this.coursePackageLoading = true;
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryClassPackageList({});
        if (status !== 200 || code !== 200) return Promise.reject();
        this.coursePackageList = data;
      } finally {
        this.coursePackageLoading = false;
      }
    },
    showCopyLinkDialog(item, courseType) {
      this.linkLang = Constants.subjectTypeMap[courseType];
      this.copyLinkVisibility = true;
      this.info = item;
    },
    // 海报弹窗
    showPosterDialog(row, lang, loc) {
      this.loc = loc||'ops/poster/list';
      this.posterLang = lang;
      this.info = row;
      this.showPoster = true;
    },

    handleClosePoster() {
      this.showPoster = false;
    },
    async copyLink(link) {
      await copyLink(link)
        .then(
          () => {
            this.$notify({
              message: this.$t("复制成功"),
              type: "success",
            });
          },
          () => {
            this.$notify({
              message: this.$t("复制失败"),
              type: "error",
            });
          }
        )
        .finally(() => (this.copyLinkVisibility = false));
    },
    //获取范围组件的值
    get_seleParams(val, valName) {
      if (valName === "postIdList") {
        this.screenData.userIdStr = "";
        this.screenData.postIdStr = val.join(",");
      } else if (valName === "userIdList") {
        this.screenData.postIdStr;
        this.screenData.userIdStr = val.join(",");
      } else if (valName === "clear") {
        this.screenData.postIdStr = "";
        this.screenData.userIdStr = "";
      }
    },
    selectable(row, index) {
      if (row.xgUserId !== null) {
        return true;
      } else {
        return false;
      }
    },
    search() {
      if (
        this.screenData &&
        this.screenData.parentUserId &&
        !parentIdValidate(this, this.screenData.parentUserId)
      ) {
        return;
      }
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    testlink(scopeRow) {
      let transfer = document.createElement("input");
      transfer.style.position = "fixed";
      transfer.style.top = "-10000px";
      transfer.style.left = "-10000px";
      document.body.appendChild(transfer);
      transfer.value = `https://student.lingoace.com/evaluate/result/index.html?studentId=${scopeRow.studentUserId}`; // 这里表示想要复制的内容
      transfer.focus();
      transfer.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
      }
      transfer.blur();
      this.$notify({
        message: this.$t("复制成功"),
        type: "success",
      });
      document.body.removeChild(transfer);
    },

    getTableData() {
      this.loading = true;
      let {
        pageNum,
        pageSize,
        studentName,
        labelInfo,
        programmeName,
        courseLevel,
        postIdStr,
        userIdStr,
        parentUserId,
        funcCode,
        courseType,
        coursePackageId,
        packageTreeId,
      } = this.screenData;
      this.$Api.workBench
        .getMyStudentList(this.nowUserInfo.id, pageNum, pageSize, {
          studentName,
          labelInfo: labelInfo ? "1" : "",
          programmeName,
          courseLevel,
          postIdStr,
          userIdStr,
          parentUserId,
          funcCode,
          courseType,
          coursePackageId,
          packageTreeId: packageTreeId + "",
        })
        .then(
          ({ data }) => {
            if (data.code == 200 && data.data) {
              this.total = data.data.total;
              this.tableData = this.sliptDataByCourse(data.data.list);
            } else {
              this.tableData = [];
            }
            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        );
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    goStudentDetail(studentId, studentName) {
      this.$router.push(
        `/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`
      );
    },

    sliptDataByCourse(originList) {
      let resultList = [];
      originList.forEach((parent) => {
        if (parent.courseList && parent.courseList.length > 1) {
          resultList = resultList.concat(
            parent.courseList.map((t, i) => {
              const obj = {
                ...parent,
                courseList: [t],
                isChildren: parent.courseList.length > 1,
              };
              return i === 0
                ? {
                    ...obj,
                    rowspan: parent.courseList.length,
                  }
                : obj;
            })
          );
        } else {
          resultList = resultList.concat([parent]);
        }
      });
      return resultList;
    },

    spanMethod({ row, columnIndex }) {
      const colSpan = [0, 1, 2, 3, 4, 5, 6, 7];
      if (colSpan.includes(columnIndex)) {
        if (!row.isChildren) return;
        if (row.rowspan) {
          return {
            rowspan: row.rowspan,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    getCoursePackageName(item) {
      return (
        item.coursePackageNameList.find((t) =>
          this.currentLang === "en"
            ? t.languageCode === "EN"
            : t.languageCode === "CN"
        )?.name || item.packageName
      );
    },
  },
  created() {
    this.queryClassPackageList();
    this.getTableData();
    this.$eventBus.$off("needGetMyStudentListData");
    this.$eventBus.$on("needGetMyStudentListData", (target) => {
      if (target) {
        this.getTableData();
      }
    });
  },
};
</script>
<style lang="scss" scope>
.my-student-wrap {
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

.my-student-search-wrap {
  width: 100%;
  display: flex;

  .check-box {
    display: inline-block;
    margin-left: 10px;
  }
}
.my-student-search-wrap {
  display: flex;
  align-items: center;
}
</style>
