<template>
  <div class="normal-gtl-wrap">
    <div class="search-wrap">
      <el-select
        style="width: 30%; margin-bottom: 15px"
        clearable
        v-model="screenData.status"
        :placeholder="$t('请选择班型状态')"
      >
        <el-option
          v-for="item in groupTypeStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        style="width: 30%"
        clearable
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
        style="width: 30%"
        clearable
        v-model="screenData.classTypeName"
        :placeholder="$t('请输入班型名称')"
      ></el-input>
      <el-select
        style="width: 30%; margin-bottom: 15px"
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
        style="width: 30%"
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
        style="width: 30%"
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
        style="width: 30%"
        v-model="screenData.time"
        :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '23:30',
        }"
        :placeholder="$t('选择时间')"
      >
      </el-time-select>
      <el-button
        type="primary"
        @click="search"
      >{{
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
          :label="$t('负责团队')"
          prop="name"
          :width="currentLang === 'en' ? 130 : 120"
        >
          <template slot-scope="scope">
            <span>{{ Filters.teamFilter(scope.row.team,currentLang==="en") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="300"
          :label="$t('班型名称')"
          prop="classtypeNameZh"
        >
          <template slot-scope="scope">
            <router-link :to="{
                path: `/groupManagement/groupTypeDetail?groupTypeId=${scope.row.id}`,
              }">
              <el-button type="text">
                <span>{{ scope.row.classtypeNameZh }}</span>
                <el-tag
                  type="success"
                  v-if="scope.row.languageLabel"
                >{{
                  scope.row.languageLabel | languageLabelFilter
                }}</el-tag>
                <el-tag
                  type="danger"
                  v-if="scope.row.ageLabel"
                >{{
                  scope.row.ageLabel | ageLabelFilter
                }}</el-tag>
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('班型首课')"
          :prop="currentLang === 'en' ? 'lessonDescEN' : 'lessonDescZH'"
          min-width="180"
        />
        <el-table-column
          align="center"
          :label="$t('上课周期')"
          prop="name"
          :width="currentLang === 'en' ? 110 : 100"
        >
          <template slot-scope="scope">
            <p
              v-for="(item, index) in scope.row.weekList"
              :key="index"
            >
              <span>{{ Filters.mapWeek(item.week, currentLang === "en") }}
                {{ item.time }}
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下节课时间')"
          prop="name"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.nextLessonTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下节课程')"
          :prop="currentLang === 'en' ? 'nextLessonDescEN' : 'nextLessonDescZH'"
          min-width="180"
        />
        <el-table-column
          align="center"
          :label="$t('已组班级')"
          prop="classNum"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('班型状态')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | groupTypeStatusFilter }}</span>
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
export default {
  data () {
    return {
      groupTypeStatusList: [],
      courseEditionList: [],
      timeList: [{ label: "15:30", value: "15:30" }],
      total: 0,
      loading: false,
      tableData: [],
      screenData: {
        status: 0,
        team: "",
        classTypeName: "",
        languageLabel: "",
        ageLabel: "",
        week: "",
        time: "",
        pageNum: 1,
        pageSize: 50,
      },
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    currentLang () {
      this.initData();
    },
  },
  methods: {
    initData () {
      this.groupTypeStatusList = [
        { label: this.$t("启用中"), value: 0 },
        { label: this.$t("停用"), value: 1 },
      ];
    },
    search () {
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    getCurrentPage (page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage (perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    getTableData () {
      this.loading = true;
      let {
        status,
        team,
        classTypeName,
        languageLabel,
        ageLabel,
        week,
        time,
        pageNum,
        pageSize,
      } = this.screenData;
      let params = {
        status,
        team,
        classTypeName,
        languageLabel,
        ageLabel,
        week,
        time,
      };
      this.$Api.groupManagement
        .getNormalGroupTypeList(pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
  },
  created () {
    this.initData();
    this.getTableData();
  },
};
</script>
<style lang="scss" scoped>
.normal-gtl-wrap {
  margin-top: 10px;
  width: 100%;
  .search-wrap {
    width: 100%;
  }
}
</style>
