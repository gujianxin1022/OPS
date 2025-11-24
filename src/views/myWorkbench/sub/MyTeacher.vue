<template>
  <div class="my-teacher-wrap">
    <!-- 下拉 -->
    <div
      class="top-selsect mb10"
      v-if="Per.handleButtonPer('teach.myWorkbench.myTeacher.wbmyTeacherScope')"
    >
      <CommonTree @get_seleParams="get_seleParams"></CommonTree>
    </div>
    <div class="my-teacher-seach-wrap">
      <el-select
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myTeacher.wbmyTeacherStatus')
        "
        v-model="screenData.working"
        :placeholder="$t('在岗状态')"
        @change="getTableData()"
      >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="$t(item.label)"
          :value="item.value"
        />
      </el-select>
      <el-select
        style="margin-left: 20px"
        v-model="screenData.hide"
        :placeholder="$t('开放状态')"
        @change="getTableData()"
      >
        <el-option
          v-for="item in openList"
          :key="item.value"
          :label="$t(item.label)"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="my-teacher-table-wrap">
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Teacher\'s Account')"
          prop="userName"
          :width="150"
        >
          <template slot-scope="scope">
            <span>
              <router-link
                :to="{
                  path: `/tutorManagement/teacherInfo`,
                  query: { id: scope.row.tutorUserId },
                }"
              >
                <el-button type="text">{{ scope.row.userName }}</el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.realName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Teacher\'s Nickname')"
          :width="currentLang == 'en' ? 160 : 150"
          prop="realName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Teacher\'s Name')"
          :width="120"
          prop="identityName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('教师管理人员')"
          :width="currentLang == 'en' ? 200 : 120"
          prop="tmUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Gender')"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ Filters.mapGender(scope.row.gender, currentLang) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-3-Country of Residence')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="countryOfResidence"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Mobile')"
          :width="120"
          prop="phone"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-2-Class Type')"
          :width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ canTeachClassType(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Lesson Version')"
          :width="180"
          prop="name"
        >
          <template slot-scope="scope">
            <p v-for="item in canTeachClass(scope.row)" :key="item">
              {{ item }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Wage of Last Month')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="lastMonthMoney"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('在岗状态')"
          :width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ $t(Filters.getWorkingTxt(scope.row.working)) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('开放状态')" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ $t(Filters.getOpenTxt(scope.row.hide)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('上岗时间')"
          :width="150"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.workingTime)
            }}</span>
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CommonTree from "../../reportManagement/commonTree/index";
export default {
  name: "MyTeacher",
  components: {
    CommonTree,
  },
  data() {
    return {
      statusList: [
        { label: "全部", value: "" },
        ...this.Constants.workingForTeacherList,
      ],
      openList: [
        { label: "全部", value: "" },
        ...this.Constants.openForTeacherList,
      ],
      selectOptions: [],
      tableData: [],
      loading: false,
      tableHeight: window.innerHeight - 200 || 300,
      screenData: {
        pageNum: 1,
        pageSize: 50,
        status: "",
        working: "",
        hide: "",
        seleParams: [],
      },
      total: 0,
      canTeachClassArray: [],
      editionList: [],
      courseEditionMap: {},
      courseEditionMapEn: {},
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
  },
  watch: {
    currentLang() {
      this.selectOptions = [
        { label: this.$t("my-home-3-All"), value: -1 },
        { label: this.$t("my-home-Not On-Board Yet"), value: 0 },
        { label: this.$t("my-home-On Duty"), value: 1 },
        { label: this.$t("my-home-Restricted Visibility"), value: 2 },
        { label: this.$t("my-home-Resigned"), value: 3 },
        { label: this.$t("my-home-Blacklist"), value: 4 },
      ];
    },
  },
  methods: {
    // 获取课程版本
    reqCourseEdition() {
      this.$Api.base.courseEdition().then(({ data }) => {
        if (data.code === 200) {
          this.editionList = data.data || [];
          this.editionList.unshift({
            editionId: "",
            editionNameEn: "all",
            editionNameZh: "全部",
            courseLevelInfoList: [],
          });
          let courseEditionMap = new Map();
          //便利英文版课程名称
          let courseEditionMapEn = new Map();
          data.data.forEach((ele) => {
            courseEditionMap.set(ele.editionId, ele.editionNameZh);
          });
          data.data.forEach((ele) => {
            courseEditionMapEn.set(ele.editionId, ele.editionNameEn);
          });
          this.courseEditionMap = courseEditionMap;
          this.courseEditionMapEn = courseEditionMapEn;
        }
      });
    },
    //获取范围组件的值
    get_seleParams(val, valName) {
      if (valName === "postIdList") {
        this.screenData.userIdStr = "";
        this.screenData.postIdStr = val.join(",");
        this.getTableData();
      } else if (valName === "userIdList") {
        this.screenData.postIdStr = "";
        this.screenData.userIdStr = val.join(",");
        setTimeout(() => {
          this.getTableData();
        }, 500);
      }
    },
    initData() {
      this.selectOptions = [
        { label: this.$t("my-home-3-All"), value: -1 },
        { label: this.$t("my-home-Not On-Board Yet"), value: 0 },
        { label: this.$t("my-home-On Duty"), value: 1 },
        { label: this.$t("my-home-Restricted Visibility"), value: 2 },
        { label: this.$t("my-home-Resigned"), value: 3 },
        { label: this.$t("my-home-Blacklist"), value: 4 },
      ];
    },
    canTeachClass({ courseInfoList }) {
      let str = "";
      if (courseInfoList) {
        this.editionList.forEach((item) => {
          let editionArray = courseInfoList.filter(
            (ite) => ite.courseEditionId == item.editionId
          );
          if (editionArray.length != 0) {
            let s =
              this.currentLang === "en"
                ? `${this.courseEditionMapEn.get(
                    editionArray[0].courseEditionId
                  )}`
                : `${this.courseEditionMap.get(
                    editionArray[0].courseEditionId
                  )}`;
            editionArray.forEach((items) => {
              s += `L${items.courseLevel},`;
            });
            str += `${s.substr(0, s.length - 1)} | `;
          }
        });
      }
      str.substr(0, str.length - 1);
      return str.split("|");
    },
    canTeachClassType({ scheduleTutorClasstypeList }) {
      let str = "";
      if (scheduleTutorClasstypeList) {
        scheduleTutorClasstypeList.forEach((item, index) => {
          str +=
            this.Filters.mapClassType(item.classTypeId, this.currentLang) +
            "、";
        });
      }
      return `${str.slice(0, str.length - 1)}`;
    },
    getTableData() {
      this.loading = true;
      let { pageNum, pageSize, working, status, hide, seleParams } =
        this.screenData;
      let params = {};
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      this.$Api.workBench
        .getMyTeacherList(this.nowUserInfo.id, pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total;
            this.tableData = data.data.list;
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
    this.reqCourseEdition();
    this.initData();
    this.getTableData();
  },
};
</script>
<style lang="scss">
.my-teacher-wrap {
  padding: 10px 0 0 10px;
  .my-teacher-seach-wrap {
    // margin-top: 10px;
    display: flex;
    align-items: center;
    .my-teacher-check-wrap {
      margin-left: 20px;
    }
    .my-teacher-seach-btn {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
