<template>
  <div class="word-practice-wrap">
    <!-- 下拉 -->
    <div
      class="top-selsect mb10"
      v-if="Per.handleButtonPer('teach.myWorkbench.myclass.wbmyClassTimeScope')"
    >
      <CommonTree
        @get_seleParams="get_seleParams"
        isShowLACCSelect="true"
        :hasLAPermission="
          Per.handleButtonPer('teach.myWorkbench.myclass.filterByLA')
        "
        :hasCCPermission="
          Per.handleButtonPer('teach.myWorkbench.myclass.filterByCC')
        "
        :hasTeachTubePermission="false"
      ></CommonTree>
    </div>
    <div class="word-practice-search-wrap">
      <el-radio-group
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myclass.wbmyClassTimePick')
        "
        style="display: inline-block"
        class="time-buttons"
        v-model="dateType"
        @change="changeDate"
      >
        <el-radio-button label="-7">过去7天</el-radio-button>
        <el-radio-button label="-1">昨天</el-radio-button>
        <el-radio-button label="0">今天</el-radio-button>
        <el-radio-button label="1">明天</el-radio-button>
        <el-radio-button label="7">未来7天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        style="width: 230px; marginbottom: 10px"
        unlink-panels
        v-model="applyDate"
        type="daterange"
        value-format="yyyy-MM-dd"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
        size="small"
        @change="timeChange"
      />
      <span class="filter-item-box">
        <el-select v-model="courseType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in newCourseOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <el-select
        class="select"
        v-model="selectValue"
        placeholder="请选择课程状态"
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myclass.wbmyClassStatusSelect')
        "
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <span class="filter-item-box">
        <el-input
          clearable
          v-model="studentUserName"
          :placeholder="$t('请输入学生名字')"
        ></el-input>
      </span>
      <span class="filter-item-box">
        <el-input
          clearable
          v-model="studentUserId"
          :placeholder="$t('请输入学生ID')"
        ></el-input>
      </span>
      <span class="filter-item-box">
        <el-input
          clearable
          v-model="teacherUserName"
          :placeholder="$t('请输入教师名字')"
        ></el-input>
      </span>
      <el-button type="primary" @click="search">{{ $t("查询") }}</el-button>
    </div>
    <div class="word-practice-table-wrap">
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
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope"
            >{{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="courseStartTime"
          :label="$t('上课时间')"
        >
        </el-table-column>
        <el-table-column
          prop="appointmentStatusCn"
          :label="$t('课堂状态')"
        >
        </el-table-column>
        <el-table-column
          prop="studentName"
          :label="$t('学生姓名')"
        >
        </el-table-column>
        <el-table-column
          prop="opsStudentId"
          :label="$t('学生ID')"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="trainerName"
          :label="$t('教师姓名')"
        >
        </el-table-column>
        <el-table-column
          prop="trainerNamePhone"
          :label="$t('教师电话')"
        >
        </el-table-column>
        <el-table-column
          prop="courseFullTypeCn"
          :label="$t('课程类型')"
        >
        </el-table-column>
        <el-table-column
          prop="courseName"
          :label="$t('课程名称')"
        >
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        :pageSize="screenData.pageSize"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CommonTree from "../../reportManagement/commonTree";
import dayjs from "moment";

export default {
  name: "myClass",
  components: {
    CommonTree,
  },
  props: {},
  data() {
    return {
      singleConversion: false,
      currentSingleConversion: {},
      sureSingleConversionLoading: false,
      teacherUserName: null,
      studentUserId: null,
      studentUserName: null,
      dateType: 0,
      selectOptions: [], // 课堂状态 select data
      reasonOptions: [],
      selectValue: "", // 课堂状态
      tableData: [],
      loading: false,
      tableHeight: window.innerHeight - 200 || 300,
      total: 0,
      screenData: {
        pageNum: 1,
        pageSize: 10,
        // 默认startDate为今天的YYYY-MM-DD，endDate为今天的YYYY-MM-DD
        startDate: dayjs().format("YYYY-MM-DD 00:00:00"),
        endDate: dayjs().format("YYYY-MM-DD 23:59:59"),
      },
      studentAll: [],
      activeClass: "first",
      isShowClass: false,
      tabIndex: -1,
      currentClassTypeId: -1,
      applyDate: [],
      classTryradio: null,
      smallTryRadio: null,
      classRoomTry: {
        student: "",
        classRoom: "",
        classTime: "",
        class: "",
        smallCalssTry: [],
        virtualclassId: "",
      },
      sureTryLoading: false,
      courseType: "",
      searchType: "", // 1.教管 2.学管 3.顾问
      newCourseOption: [],
      isShowLACCSelect: true,
      singleChangeFrom: {
        virtualclassType: "",
        reason: "",
      },
      changeClassrules: {
        virtualclassType: [
          { required: true, message: this.$t("请选择"), trigger: "change" },
        ],
        reason: [
          { required: true, message: this.$t("请输入"), trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
      currentEdtionId: -1,
    };
  },
  watch: {
    currentLang() {
      this.initData();
    },
    selectValue(newData) {
      // if (newData != 4) {
      //   this.selectValueReason = -1;
      // }
      this.screenData.pageNum = 1;
      this.getTableData();
    },
  },
  computed: {
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    ...mapGetters(["currentLang"]),
  },
  activated() {
    this.getTableData();
  },
  methods: {
    search() {
      this.screenData.pageNum = 1;
      this.getTableData();
    },

    //获取范围组件的值
    get_seleParams(val, valName, type) {
      console.log(222, val, valName, type)
      if (valName === "postIdList") {
        this.screenData.userIdStr = "";
        this.searchType = parseInt(type);
        this.getTableData();
      } else if (valName === "userIdList") {
        this.screenData.userIdStr = val;
        this.searchType = parseInt(type);
        setTimeout(() => {
          this.getTableData();
        }, 500);
      } else if (valName === "init") {
        this.searchType = parseInt(type);
      } else if (!valName) {
        this.searchType = parseInt(type);
        this.getTableData();
      }
    },
    timeChange() {
      if (this.applyDate) {
        this.screenData.startDate = dayjs(this.applyDate[0]).format("YYYY-MM-DD 00:00:00");
        this.screenData.endDate = dayjs(this.applyDate[1]).format("YYYY-MM-DD 23:59:59");
        this.dateType = "";
      } else {
        this.screenData.startDate = null;
        this.screenData.endDate = null;
        this.dateType = 0;
      }
      this.getTableData();
    },
    initData() {
      this.selectOptions = [
        { label: '全部课程状态', value: "" },
        { label: '待上课', value: "1" },
        { label: '上课中', value: "2" },
        { label: '已取消', value: "3" },
        { label: '已结束', value: "4" },
        { label: '已过期', value: "5" },
      ];
      this.reasonOptions = [
        { label: this.$t("全部"), value: -1 },
        { label: this.$t("my-home-1-Student Absent"), value: 1 },
        {
          label: this.$t("my-home-Stduent's Device or Network Distruption"),
          value: 2,
        },
        {
          label: this.$t("my-home-Teacher's Device or Network Distruption"),
          value: 12,
        },
        { label: this.$t("my-home-Other Reasons"), value: 20 },
        { label: this.$t("my-home-Initiation Timeout"), value: 21 },
        { label: this.$t("上课时间out"), value: 22 },
      ];
      // 课堂类型
      this.newCourseOption = [
        {
          value: "",
          label: "全部课程类型",
        },
        {
          value: "2",
          label: this.$t("55分钟课"),
        },
        {
          value: "3",
          label: this.$t("25分钟体验课"),
        },
      ];
    },

    getTableData() {
      this.loading = true;
      this.tableData = [];
      let {
        teacherUserName,
        studentUserName,
        studentUserId,
        selectValue, //课堂状态
        courseType, // 课程类型，2：55分钟；3：25分钟试听课,
        searchType,
      } = this;

      let { pageNum, pageSize, startDate, endDate, userIdStr } =
        this.screenData;
      const params = {
        teacherUserName,
        studentUserName,
        studentUserId,
        courseStatus: selectValue,
        startDate,
        endDate,
        userId:userIdStr,
        // userId: this.nowUserInfo.id,
        pageNum,
        pageSize,
        courseType,
        searchType,
      };
      const getWordPracticeList = this.$Api.workBench.wordPracticeApi(params)

      getWordPracticeList.then(({ status, data }) => {
        console.log(111, status, data)
        if (status === 200 && data.code === 0) {
          this.tableData = data.data.rows;
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
    changeDate(val) {
      console.log(111, val)
      this.applyDate = [];
      // 如果val为-7，则startDate为7天前，endDate为昨天
      // 如果val为-1，则startDate和endDate为昨天
      // 如果val为0，则startDate和endDate为今天
      // 如果val为1，则startDate为明天，endDate为明天
      // 如果val为7，则startDate为明天，endDate为7天后
      if (val === "-7") {
        this.screenData.startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD 00:00:00");
        this.screenData.endDate = dayjs().subtract(1, "day").format("YYYY-MM-DD 23:59:59");
      } else if (val === "-1") {
        this.screenData.startDate = dayjs().subtract(1, "day").format("YYYY-MM-DD 00:00:00");
        this.screenData.endDate = dayjs().subtract(1, "day").format("YYYY-MM-DD 23:59:59");
      } else if (val === "0") {
        this.screenData.startDate = dayjs().format("YYYY-MM-DD 00:00:00");
        this.screenData.endDate = dayjs().format("YYYY-MM-DD 23:59:59");
      } else if (val === "1") {
        this.screenData.startDate = dayjs().add(1, "day").format("YYYY-MM-DD 00:00:00");
        this.screenData.endDate = dayjs().add(1, "day").format("YYYY-MM-DD 23:59:59");
      } else if (val === "7") {
        this.screenData.startDate = dayjs().add(1, "day").format("YYYY-MM-DD 00:00:00");
        this.screenData.endDate = dayjs().add(7, "day").format("YYYY-MM-DD 23:59:59");
      }
      this.getTableData();
    },
    closeSingleChangeFrom() {
      this.singleConversion = false;
      this.$refs.singleChangeFrom.resetFields();
    },
  },
  created() {
    this.initData();
    if (
      this.Per.handleButtonPer("teach.myWorkbench.myclass.wbmyClassTimeScope")
    )
      return;
    this.getTableData();
  },
};
</script>
<style lang="scss" scoped>
.elementIcon {
  font-size: 18px;
  cursor: pointer;
}

.word-practice-wrap {
  padding: 10px 10px 0 10px;

  .word-practice-search-wrap {
    margin-top: 20px;

    .check-search-item-wrap {
      display: flex;
      margin: 10px 0;

      .check-search-item {
        margin-right: 20px;
      }
    }
  }

  .word-practice-table-wrap {
    margin-top: 17px;
  }

  .column-button {
    display: inline-block;
    cursor: pointer;
    font-size: 18px;
    color: #666;
    margin: 3px;
  }

  .column-button:hover {
    color: rgb(92, 194, 208);
  }

  .fist-class-wrap {
    display: inline-block;
  }

  .disable-first-class {
    border: 1px solid #666;
    color: #666;
    border-radius: 50%;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;

    b {
      font-size: 10px;
    }
  }

  .fist-class,
  .unit-report {
    border: 1px solid #666;
    border-radius: 50%;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;

    b {
      font-size: 10px;
    }
  }

  .fist-class:hover,
  .unit-report:hover {
    border: 1px solid rgb(92, 194, 208);
    color: rgb(92, 194, 208);
  }

  .filter-item-box {
    width: 200px;
    display: inline-block;
    margin-bottom: 20px;
  }

  .fix-icon {
    margin-top: -1px;
    font-size: 14px;
    display: inline-block;
  }
}
.formalTry {
  > div {
    font-size: 14px;
    > div {
      line-height: 33px;
      .label {
        display: inline-block;
        text-align: left;
        width: 85px;
      }
      .value {
        color: #666666;
        margin-left: 15px;
      }
    }
    .smallTable {
      width: 80%;
      min-height: 50px;
      border: 1px solid;
      display: flex;
      flex-wrap: wrap;
      :nth-child(1) {
        width: 30%;
      }
      :nth-child(2) {
        width: 70%;
      }
    }
  }
}
.search—title {
  padding: 0 10px;
  line-height: 32px;
  text-align: right;
  font-size: 12px;
  color: #666;
}

.my-highlight-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
