<template>
  <div
    class="groupListWrapper"
    v-if="Per.handleButtonPer('teach.groupMT.groupList.clViewClassList')"
  >
    <!-- 搜索栏 -->
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item :label="$t('收费标准')" :part="4" :label-width="labelWidth">
        <el-select
          clearable
          v-model="screenData.classCategory"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in classCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('班级名称')"
        :part="4"
        :label-width="labelWidth"
        v-if="
          Per.handleButtonPer(
            'teach.groupMT.groupList.clFilterByClassStudentName'
          )
        "
      >
        <el-input
          v-model="screenData.className"
          :placeholder="$t('glb-input') + ' ' + $t('班级名称')"
        />
      </screen-item>
      <screen-item
        :label="$t('班级编号')"
        :part="4"
        :label-width="labelWidth"
        v-if="
          Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassNumber')
        "
      >
        <el-input
          v-model="screenData.classNo"
          :placeholder="$t('glb-input') + ' ' + $t('班级编号')"
        />
      </screen-item>
      <screen-item
        :label="$t('是否结课')"
        :part="4"
        :label-width="labelWidth"
        v-if="Per.handleButtonPer('teach.groupMT.groupList.clUserNumSearch')"
      >
        <el-select
          clearable
          v-model="screenData.status"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in classStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>

      <!-- 课程包 -->
      <screen-item
        v-if="Per.handleButtonPer('teach.groupMT.groupList.filterByCoursePkg')"
        :label="$t('课程包')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          clearable
          filterable
          v-model="screenData.coursePackageId"
          :placeholder="$t('请选择课程包')"
          :loading="coursePackageLoading"
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
        v-if="Per.handleButtonPer('teach.groupMT.groupList.filterByEdition')"
        :label="$t('版本')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          filterable
          v-model="screenData.packageTreeId"
          :loading="packageTreeLoading"
          :placeholder="$t('版本')"
          @change="handlePackageTreeChange"
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
      <screen-item
        clearable
        :label="$t('下节课程')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-cascader
          clearable
          v-model="screenData.nextLessonId"
          :options="courseHierarchyList"
          :props="{ value: 'id', label: 'name' }"
          :placeholder="$t('级别、单元、lesson')"
        />
      </screen-item>
      <screen-item
        :label="$t('创建人')"
        :part="4"
        :label-width="labelWidth"
        v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByCreator')"
      >
        <el-input
          v-model="screenData.createUserName"
          :placeholder="$t('请输入创建人姓名')"
        />
      </screen-item>
      <screen-item
        :label="$t('教师')"
        :label-width="currentLang == 'en' ? 140 : labelWidth"
        v-if="
          Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassTeacher')
        "
      >
        <span style="display: inline-block; width: 412px;">
          <FilterByUserAccount
            @change="
              (params) => {
                userParams = params;
              }
            "
            @search="search"
          />
        </span>
      </screen-item>
      <screen-item
        :label="$t('班级学员')"
        :part="4"
        :label-width="currentLang === 'en' ? '120' : labelWidth"
        v-if="
          Per.handleButtonPer(
            'teach.groupMT.groupList.clFilterByClassStudentName'
          )
        "
      >
        <el-input
          v-model="screenData.studentUserName"
          :placeholder="$t('请输入班级学员姓名')"
        />
      </screen-item>
      <screen-item
        :label="$t('班级人数')"
        :part="4"
        :label-width="labelWidth"
        v-if="Per.handleButtonPer('teach.groupMT.groupList.clUserNumSearch')"
      >
        <el-input
          v-model="screenData.userNum"
          :placeholder="$t('请输入班级人数')"
        />
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <el-button
        type="primary"
        slot="header-right"
        @click="jumpToCreateClass"
        v-if="Per.handleButtonPer('teach.groupMT.groupList.clCreateClass')"
        >{{ $t("创建班级") }}</el-button
      >
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
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
            (currentPage - 1) * perPage + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('班级编号')"
          prop="class_no"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                Per.handleButtonPer(
                  'teach.groupMT.groupList.clViewClassDetails'
                )
              "
              @click.native.prevent="jumpToClassInfo(scope.$index, tableData)"
              type="text"
              size="small"
            >
              {{ scope.row.classNo }}
            </el-button>
            <el-button
              v-else
              disabled
              @click.native.prevent="jumpToClassInfo(scope.$index, tableData)"
              type="text"
              size="small"
            >
              {{ scope.row.classNo }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('班级中文名称')"
          prop="classNameZh"
          :width="currentLang === 'en' ? 160 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('班级英文名称')"
          prop="className"
          :width="currentLang === 'en' ? 160 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('班级规模')"
          align="center"
          :width="currentLang === 'en' ? 110 : 100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.classTypeId | mapClassType }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('收费标准')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.classCategory | mapRechargeRule }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('班级下节课程')"
          width="240"
          align="center"
          :prop="currentLang === 'en' ? 'lessonDescEN' : 'lessonDescZH'"
        />
        <el-table-column
          :label="$t('系统lesson')"
          align="center"
          :width="currentLang === 'en' ? 110 : 100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.nextLessonId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('下节上课时间')"
          prop="startTime"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('教师用户名')"
          prop="tutorRealName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('教师ID')"
          width="180"
        >
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.tutorRealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('老师姓名')"
          :width="currentLang === 'en' ? 120 : 100"
          prop="tutorIdentityName"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('班级人数')"
          prop="userNum"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column :label="$t('班级学员')" width="150" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.classroomClassMemberInfoList">
              <div
                v-for="(item, index) in scope.row.classroomClassMemberInfoList"
                :key="index"
              >
                {{ item.realName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 课程顾问&学管-->
        <el-table-column
          align="center"
          :label="$t('课程顾问&学管')"
          width="150"
          prop="courseAdviser"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.classroomClassMemberInfoList"
              :key="index"
            >
              <el-popover placement="top-start" width="200" trigger="click">
                <div v-loading="infoLoading">
                  <p>{{ $t("学管") }}：{{ currentXgName }}</p>
                  <p>{{ $t("顾问") }}：{{ currentGwName }}</p>
                </div>
                <el-button
                  type="text"
                  slot="reference"
                  @click="getXgGw(item, scope.row)"
                  >{{ $t("点击查看") }}</el-button
                >
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('已上/排课')"
          :width="currentLang === 'en' ? 180 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.finishCourseNum }}/{{
                scope.row.scheduleCourseNum
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('课程状态')"
          :width="currentLang === 'en' ? 100 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.status == Constants.classStatus
                ? $t("已完结")
                : $t("正在进行")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('实到人次/应到人次')"
          :width="currentLang === 'en' ? 350 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.attendStudentNum }}/{{
                scope.row.courseStudentNum
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('总出勤率')"
          :width="currentLang === 'en' ? 200 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.attendRate"
              >{{ (scope.row.attendRate * 100).toFixed(2) }}%</span
            >
            <span v-else>0%</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('创建人')"
          prop="createUserName"
          :width="currentLang === 'en' ? 90 : 80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('创建时间')"
          prop="createTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </custom-card>
    <!-- 分页器 -->
    <custom-pagination
      :total="total"
      :current-page="currentPage"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

export default {
  components: { FilterByUserAccount },
  data() {
    return {
      labelWidth: "100",
      tableHeight: window.innerHeight - 200 || 300,
      total: 0,
      currentPage: 1,
      perPage: 50,
      role: [],
      tableData: [],
      loading: "",
      userParams: {},
      screenData: {
        classNo: "",
        className: "",
        createUserName: "",
        status: "",
        studentUserName: "",
        xgUserId: "",
        userNum: "",
        nextLessonId: "",
        classCategory: "",
        coursePackageId: "",
        packageTreeId: "",
      },
      classCategoryList: [],
      classTypeList: [],
      classStatusList: [],
      editionList: [],
      levelList: [],
      unitList: [],
      lessonList: [],
      coursePackageList: [],
      packageTreeList: [],
      coursePackageLoading: false,
      packageTreeLoading: false,
      courseHierarchyList: [],
      currentXgName: "",
      currentGwName: "",
      infoLoading: false,
    };
  },
  computed: {
    ...mapState({
      groupListSearchData: (state) => state.remberSearch.groupListSearchData,
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
    }),
    ...mapGetters(["currentLang"]),
  },

  created() {
    this.queryClassPackageList();
    this.initData();
    if (Object.keys(this.groupListSearchData).length !== 0) {
      this.screenData = { ...this.screenData, ...this.groupListSearchData };
    }
  },
  methods: {
    ...mapMutations(["setGroupListSearchData"]),

    getCoursePackageName(item) {
      return (
        item.coursePackageNameList.find((t) =>
          this.currentLang === "en"
            ? t.languageCode === "EN"
            : t.languageCode === "CN"
        )?.name || item.packageName
      );
    },
    getXgGw(student, item) {
      this.infoLoading = true;
      this.$Api.groupManagement
        .getGwXg(student.studentUserId, item.coursePackageId)
        .then(({ data }) => {
          if (data.code !== 200) return Promise.reject();
          const { studentLearnManagerInfo, studentAdvisorInfoList } = data.data;
          this.currentXgName = studentLearnManagerInfo
            ? studentLearnManagerInfo.xgUserName
            : "";
          this.currentGwName =
            studentAdvisorInfoList && studentAdvisorInfoList.length
              ? studentAdvisorInfoList[0].adviserUserName
              : "";
          this.infoLoading = false;
        })
        .catch(() => {
          this.currentXgName = "";
          this.currentGwName = "";
          this.infoLoading = false;
        });
    },
    async handleCoursePackageChange(val) {
      this.screenData.packageTreeId = "";
      this.courseHierarchyList = [];
      if (!val) {
        this.packageTreeList = [];
        return;
      }
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
    async handlePackageTreeChange() {
      this.screenData.courseHierarchyIds = [];
      this.courseHierarchyList = [];
      const {
        status,
        data: { code, data },
      } = await this.$Api.groupManagement.getCourseHierarchyData({
        packageId: this.screenData.coursePackageId,
        packageTreeId: this.screenData.packageTreeId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      this.courseHierarchyList = data;
    },
    initData() {
      this.classCategoryList = [
        {
          value: 1,
          label: this.$t("免费"),
        },
        {
          value: 2,
          label: this.$t("新加坡"),
        },
        {
          value: 3,
          label: this.$t("亚欧"),
        },
      ];
      this.classTypeList = [
        {
          value: null,
          label: this.$t("全部"),
        },
        {
          value: 3,
          label: this.$t("大班课"),
        },
        {
          value: 2,
          label: this.$t("小班课"),
        },
      ];
      this.classStatusList = [
        {
          value: 1,
          label: this.$t("进行中"),
        },
        {
          value: 2,
          label: this.$t("已完结"),
        },
      ];
    },
    /**
     * 跳班级详情
     */
    jumpToClassInfo(index, data) {
      this.$router.push({
        name: "classInfo",
        query: {
          id: data[index].classId,
          type: 2,
        },
      });
    },
    /**
     * 跳创建班级
     */
    jumpToCreateClass() {
      this.$router.push({
        name: "createClass",
        query: {
          type: 2,
        },
      });
    },
    /**
     * 跳学生详情
     */
    goStudentDetail(id) {
      this.$router.push(`/studentManagement/studentInfo?studentId=${id}`);
    },
    changeEditBtnFlag(value) {
      this.editionProgressData.edit = value;
      this.editionProgressData.level = 1;
    },
    changeLevelBtnFlag(value) {
      this.editionProgressData.level = value;
    },
    search() {
      if (isNaN(this.screenData.userNum)) {
        this.$notify({
          message: "班级人数请输入有效数字",
          type: "error",
        });
        return;
      }
      this.setGroupListSearchData(this.screenData);
      this.searchFunc();
    },
    indexMethod(index) {
      return index + 1;
    },
    sortChange(column) {
      if (column.prop === "user_num" && column.order === "ascending") {
        // 升序
        this.screenData.ordering = "user_num";
      } else if (column.prop === "user_num" && column.order === "descending") {
        // 降序
        this.screenData.ordering = "-user_num";
      } else {
        return;
      }
      this.getTableData();
    },
    getSortClass(key) {
      const sort = this.screenData.ordering;
      return sort === `${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    },
    getCurrentPage(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.perPage = perPage;
      this.currentPage = 1;
      this.getTableData();
    },
    searchFunc() {
      this.loading = true;
      this.currentPage = 1;
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      let params = { 
        ...this.screenData,
        ...this.userParams
      };
      params.nextLessonId =
        params.nextLessonId && params.nextLessonId.length
          ? params.nextLessonId[2]
          : "";
      params.pageNum = this.currentPage;
      params.pageSize = this.perPage;
      this.$Api.classManagement
        .getClassListData(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total;
            this.tableData = data.data.list;
          }
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
