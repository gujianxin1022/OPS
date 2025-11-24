<template>
  <div class="auto-normal">
    <el-select
      style="width: 13%; marginbottom: 10px"
      clearable
      class="mb10"
      v-model="screenData.team"
      :placeholder="$t('请选择负责团队')"
    >
      <el-option
        v-for="item in Constants.responsiblieTeam(currentLang)"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input
      style="width: 13%"
      clearable
      v-model="screenData.className"
      :placeholder="$t('请输入') + $t('班级名称')"
    ></el-input>
    <el-select
      style="width: 13%"
      clearable
      v-model="screenData.languageLabel"
      :placeholder="$t('请选择语言标签')"
    >
      <el-option
        v-for="item in Constants.langList(currentLang)"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      style="width: 13%"
      clearable
      v-model="screenData.ageLabel"
      :placeholder="$t('请选择年龄标签')"
    >
      <el-option
        v-for="item in Constants.ageList(currentLang)"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      style="width: 12%"
      clearable
      v-model="screenData.week"
      :placeholder="$t('请选择周几')"
    >
      <el-option
        v-for="item in Constants.weekList(currentLang)"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-time-select
      style="width: 12%"
      v-model="screenData.time"
      :picker-options="{
        start: '00:00',
        step: '00:30',
        end: '23:30',
      }"
      :placeholder="$t('选择时间')"
    >
    </el-time-select>
    <el-select
      style="width: 15%"
      clearable
      v-model="screenData.haveTeach"
      :placeholder="$t('请选择是否安排老师')"
    >
      <el-option
        v-for="item in hasTeacherList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <span style="display: inline-block; margin-bottom: 15px; width: 412px;">
      <FilterByUserAccount
        @change="
          (params) => {
            userParams = params;
          }
        "
        @search="search"
      />
    </span>
    <el-button type="primary" @click="search">{{
      $t("my-home-Search")
    }}</el-button>
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
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="zydescription"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column type="expand">
          <template>
            <p
              class="student-line"
              v-for="item in currentRowStudentList"
              :key="item.id"
            >
              <span class="mr10">{{ item.realName }}</span>
              <span class="mr10" v-if="item.gender != 0 && item.gender != null"
                >{{ item.gender | mapGender }}孩</span
              >
              <span class="mr10" v-else>{{ $t("性别未设置") }}</span>
              <span class="mr10"
                >{{ $t("母语") }}:{{
                  item.motherTongue ? item.motherTongue : "--"
                }}</span
              >
              <span class="mr10">{{ item.age }}{{ $t("岁") }}</span>
              <span class="mr10"
                >{{ $t("现居") }}:{{
                  item.studentLocation ? item.studentLocation : "--"
                }}</span
              >
              <span class="mr10"
                >{{ $t("期望老师") }}:{{
                  item.expectTeacherStyle ? item.expectTeacherStyle : "--"
                }}</span
              >
            </p>
          </template>
        </el-table-column>
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
          :label="$t('负责团队')"
          prop="name"
          :width="currentLang == 'en' ? 130 : 120"
        >
          <template slot-scope="scope">
            <span>{{
              Filters.teamFilter(scope.row.team, currentLang === "en")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('班级名称')"
          prop="name"
          width="300"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/groupManagement/classInfo`,
                query: { id: scope.row.id, type: 2 },
              }"
            >
              <el-button type="text">{{ scope.row.classNameZh }}</el-button>
              <el-tag type="success" v-if="scope.row.languageLabel">{{
                scope.row.languageLabel | languageLabelFilter
              }}</el-tag>
              <el-tag type="danger" v-if="scope.row.ageLabel">{{
                scope.row.ageLabel | ageLabelFilter
              }}</el-tag>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('班型首课')"
          :prop="currentLang === 'en' ? 'lessonDescEN' : 'lessonDescZH'"
          width="180"
        />
        <el-table-column
          align="center"
          :label="$t('上课周期')"
          prop="name"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{
              Filters.normalWeekListMap(
                scope.row.weekList,
                currentLang === "en"
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下节课时间')"
          prop="name"
          width="140"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.nextCourseTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下节课程')"
          :prop="currentLang === 'en' ? 'nextLessonDescEN' : 'nextLessonDescZH'"
          width="180"
        />
        <el-table-column
          align="center"
          :label="$t('教师ID')"
          width="180"
        >
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorId}&teacherName=${scope.row.tutorUserName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下节课老师')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorId}&teacherName=${scope.row.tutorUserName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserName }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('已有学生')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('剩余位置')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.userMax != null && scope.row.userNum != null"
              >{{ scope.row.userMax * 1 - scope.row.userNum * 1 }}</span
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('班级组成时间')"
          prop="name"
          width="140"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
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
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

export default {
  components: {
    FilterByUserAccount,
  },
  data() {
    return {
      hasTeacherList: [],
      getRowKeys: (row) => {
        //获取当前行id
        return row.id; //这里看这一行中需要根据哪个属性值是id
      },
      expands: [], //只展开一行放入当前行id
      loading: false,
      total: 0,
      tableData: [],
      currentRowStudentList:[],
      userParams: {},
      screenData: {
        pageNum: 1,
        pageSize: 50,
        team: "",
        className: "",
        languageLabel: "",
        ageLabel: "",
        week: "",
        time: "",
        haveTeach: "",
      },
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    currentLang() {
      this.initData();
    },
  },
  methods: {
    initData() {
      this.hasTeacherList = [
        { label: this.$t("未安排"), value: 2 },
        { label: this.$t("安排"), value: 1 },
      ];
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    search() {
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    zydescription(row, rowList) {
      if (rowList.length) {
        // 只展开一行//说明展开了
        this.expands = [];
        if (row) {
          this.getRowStudentInfo(row.id); //这里可以调用接口数据渲染
        }
      } else {
        // 说明收起了
        this.expands = [];
      }
    },
    getRowStudentInfo(id) {
      this.$Api.groupManagement
        .getGroupStudentInfo(id)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.currentRowStudentList = data.data;
            this.expands.push(id); // 只展开当前行id
          } else {
            this.currentRowStudentList = [];
          }
        });
    },
    getTableData() {
      this.loading = true;
      let params = {
        ...this.screenData,
        ...this.userParams
      };
      this.$Api.groupManagement
        .getAutoClassNormalList(params)
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
    this.initData();
  },
};
</script>
<style lang="scss" scoped></style>
