<template>
  <div class="out-teacher-wrap">
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
        v-model="screenData.outStage"
        :placeholder="$t('淘汰阶段')"
      >
        <el-option
          v-for="item in outList"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        >
        </el-option>
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
          :label="$t('淘汰时间')"
          width="150"
          prop="outExamineTime"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.outExamineTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('淘汰阶段')"
          :width="currentLang === 'en' ? 130 : 120"
          prop="outStage"
        >
          <template slot-scope="scope">
            <span>{{
              Filters.processCode(scope.row.outStage, currentLang)
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
          :label="$t('my-home-Age')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.birthdayMapToAge(scope.row.birthday)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('学历')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.highestDegree | highestDegreeFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('是否在读')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isSchool | isSchoolFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('就职单位')"
          width="120"
          prop="currentEmployer"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('工作年限')"
          width="120"
          prop="name"
        >
          <template slot-scope="scope">
            <div>{{ Constants.teachAgoComputed(scope.row.teachingStartTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-3-Country of Residence')"
          :width="currentLang === 'en' ? 150 : 120"
          prop="countryOfResidence"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          :width="currentLang === 'en' ? 170 : 120"
          prop="name"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="goNewRegistry(scope.row)">{{
              $t("回新注册")
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
    <div>
      <el-dialog
        :before-close="close"
        :close-on-click-modal="false"
        :title="$t('回新注册')"
        center
        :visible.sync="goNewRegistryFlag"
      >
        <el-input
          type="textarea"
          maxlength="500"
          show-word-limit
          :rows="7"
          :placeholder="$t('glb-input') + $t('详细原因')"
          v-model="remark"
        >
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t("my-home-CCancel") }}</el-button>
          <el-button type="primary" @click="sure" :loading="sureLoading">{{
            $t("my-home-Confirm")
          }}</el-button>
        </span>
      </el-dialog>
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
  },
  components: {
    FilterByUserAccount,
  },
  data() {
    return {
      userParams: {},
      sureLoading: false,
      outList: [],
      remark: "",
      applyDate: [],
      total: 0,
      loading: false,
      tableData: [],
      screenData: {
        pageSize: 50,
        pageNum: 1,
        outStage: "",
      },
      goNewRegistryFlag: false,
      gobackObj: null,
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
      this.outList = [
        { label: this.$t("新 注 册"), peopleNum: 0, id: 1 },
        { label: this.$t("试 讲 阶 段"), peopleNum: 0, id: 2 },
        { label: this.$t("教 学 培 训 阶 段"), peopleNum: 0, id: 3 },
        { label: this.$t("技 术 培 训 阶 段"), peopleNum: 0, id: 4 },
        { label: this.$t("终 面 阶 段"), peopleNum: 0, id: 5 },
        { label: this.$t("磨 课 阶 段"), peopleNum: 0, id: 6 },
        { label: this.$t("待 上 岗"), peopleNum: 0, id: 7 },
      ];
    },
    sure() {
      if (this.remark) {
        this.sureLoading = true;
        this.$Api.tutorManagement
          .rollbackOutTeacher(this.gobackObj.id, {
            remark: this.remark,
          })
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200) {
              this.$notify({
                message: this.$t("回新注册成功"),
                type: "success",
              });
              this.close();
              this.getTableData();
              this.$emit("getCount");
            }
            this.sureLoading = false;
          });
      } else {
        this.$notify({
          message: this.$t("glb-input") + this.$t("详细原因"),
          type: "error",
        });
      }
    },
    close() {
      this.goNewRegistryFlag = false;
      this.gobackObj = null;
    },
    goNewRegistry(scopeRow) {
      this.gobackObj = scopeRow;
      this.goNewRegistryFlag = true;
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
      let { pageNum, pageSize, outStage } = this.screenData;
      let params = {
        startTime,
        endTime,
        outStage,
        ...this.userParams,
      };
      this.$Api.tutorManagement
        .getTeacherProcessList(8, pageNum, pageSize, params)
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