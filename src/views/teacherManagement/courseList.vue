<template>
  <div class="course-wrap">
    <div class="top-course-select-wrap">
      <el-select
        v-model="screenData.courseEditionId"
        placeholder="版本"
        @change="changeEdition"
      >
        <el-option
          v-for="item in editionListData"
          :label="currentLang == 'en' ? item.editionNameEn : item.editionNameZh"
          :value="item.editionId"
          :key="item.editionId"
        ></el-option>
      </el-select>
      <el-select
        v-model="screenData.courseLevel"
        placeholder="级别"
        @change="changeLevel"
      >
        <el-option
          v-for="item in levelList"
          :label="item.courseName"
          :value="item.courseLevel"
          :key="item.courseName"
        ></el-option>
      </el-select>
      <el-select
        v-model="screenData.unitNo"
        placeholder="单元"
        @change="changeUnit"
      >
        <el-option
          v-for="item in unitList"
          :key="item.id"
          :label="strUnit(item.unitNo)"
          :value="item.unitNo"
        ></el-option>
      </el-select>
    </div>

    <div class="table-top">
      <el-table
        :data="joinTogether"
        v-loading="loading"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column label="unit" width="100" align="center">
          <template slot-scope="scope">
            {{ unitval }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('名称')" align="center">
          <template slot-scope="scope">
            {{ tables[0] }}
          </template>
        </el-table-column>
        <el-table-column align="center"> </el-table-column>
        <el-table-column align="center"> </el-table-column>
        <el-table-column align="center"> </el-table-column>
        <el-table-column align="center"> </el-table-column>
        <el-table-column :label="$t('操作')" align="center">
          <template>
            <div>
              <el-button :disabled="unitId == -1" type="text" @click="goDetails"
                ><span style="color: #4f67f8">{{
                  $t("单元详情")
                }}</span></el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="table-wrap">
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
        <el-table-column align="center" label="lesson" width="100">
          <template slot-scope="scope">{{ scope.row.lessonNo }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('课程名称')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('课程简介')"
          prop="description"
          :width="currentLang === 'zh' ? '' : 150"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('最近修改人')"
          prop="updateUserName"
        ></el-table-column>
        <el-table-column align="center" :label="$t('最近修改时间')" prop="name">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('创建时间')"
          prop="name"
          :width="currentLang === 'zh' ? '' : 150"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" prop="name">
          <template slot-scope="scope">
            <el-button type="text" @click="goDetail(scope.row.id)">{{
              $t("课程详情")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "courseList",
  data() {
    return {
      screenData: {
        pageNum: 1,
        pageSize: 50,
        courseEditionId: "",
        courseLevel: "",
        unitNo: "",
      },
      levelList: [],
      unitList: [],
      lessonList: [],
      editionListData: [],
      tableData: [{ name: 1 }],
      loading: false,
      total: 0,
      UnitDetails: [],
      joinTogether: [{ data: "" }],
      joinTogethers: [],
      tables: [],
      identify: null,
      editionId: 1,
      levelId: 1,
      unitId: -1,
      unitval: 1,
    };
  },
  computed: {
    ...mapState({
      editionList: (state) => state.user.editionList,
      currentLang: (state) => state.app.currentLang,
    }),
    ...mapGetters(["currentLang"]),
    editionName() {
      return this.screenData.courseEditionId;
    },
    level() {
      return this.screenData.courseLevel;
    },
  },
  methods: {
    changeEdition(val) {
      this.editionId = val;
      this.levelList = [];
      this.unitId = -1;
      this.screenData.courseLevel = "";
      this.unitList = [];
      this.screenData.unitNo = "";
      this.editionListData.forEach((item) => {
        if (item.editionId == this.screenData.courseEditionId) {
          this.tables[1] = item.editionNameZh;
          this.levelList = item.courseLevelInfoList;
          this.identify = 1;
        }
      });
    },
    changeLevel(val) {
      this.levelId = val;
      this.unitList = [];
      this.unitNo = "";
      this.unitId = -1;
      this.levelList.forEach((item) => {
        if (item.courseLevel == this.screenData.courseLevel) {
          this.tables[2] = "" + item.courseName;
          this.unitList = item.courseUnitList;
          this.unitval = this.unitList[0].unitNo;
          this.screenData.unitNo = this.unitval;
          this.changeUnit(this.unitval);
        }
      });
    },
    changeUnit(val) {
      this.unitval = val;
      this.unitList.forEach((item) => {
        if (item.unitNo == val) {
          this.unitId = item.id;
        }
      });
      this.tables[3] = "" + "unit" + val;
      if (this.tables[1] == undefined) {
        this.tables[1] = this.joinTogethers[0];
      }
      if (this.tables[2] == undefined) {
        this.tables[2] = this.joinTogethers[1];
      }
      this.tables.shift();
      this.tables.unshift(
        this.tables[0] + " " + this.tables[1] + " " + this.tables[2]
      );
      this.getTableData();
    },
    strUnit(unit) {
      return `unit${unit}`;
    },
    goDetail(lessonId) {
      let { courseEditionId, courseLevel, unitNo } = this.screenData;
      this.$router.push(
        `/teacherManagement/lessonInfo?courseEditionId=${courseEditionId}&courseLevel=${courseLevel}&unitNo=${unitNo}&lessonId=${lessonId}`
      );
    },
    goDetails() {
      let isUnitVersion2 = (res) => {
        let isVersion2 = res.data.data == 2;
        if (isVersion2) {
          return true;
        }
        return false;
      };
      this.$Api.base
        .checkUnitVersion2({
          unitId: this.unitId,
        })
        .then(async (res) => {
          if (res.data.code == 200) {
            if (isUnitVersion2(res)) {
              if (await this.isEnglishUnitReport(this.screenData.courseEditionId)) {
                this.$router.push({
                  name: "englishUnitDetails",
                  query: {
                    unitName: this.tables[0],
                    unitId: this.unitId,
                  },
                });
                return;
              }
              this.$router.push({
                name: "unitDetails2",
                query: {
                  unitName: this.tables[0],
                  unitId: this.unitId,
                },
              });
            } else if (res.data.data === 4) {
              this.$notify({
                message: "请在教研中台配置",
                type: "warning",
              });
              return
            } else {
              this.$router.push({
                name: "unitDetails",
                query: {
                  editionId: this.editionId,
                  levelId: this.levelId,
                  unitId: this.unitId,
                },
              });
            }
          }
        });
    },
    getTableData() {
      this.loading = true;
      let { courseEditionId, courseLevel, unitNo } = this.screenData;
      this.$Api.teacherManagement
        .getCourseList(courseEditionId, courseLevel, unitNo)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data;
          }
          this.loading = false;
        });
    },
    // 通过版本id查询是否是英文直播课单元报告
    async isEnglishUnitReport(courseEditionId) {
      const {
        status,
        data: { code, data },
      } = await this.$Api.teacherManagement.getUnitReportType({
        courseEditionId: courseEditionId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      return !!data;
    },
  },
  created() {
    this.$Api.base.courseEdition().then((res) => {
      if (res.status === 200) {
        this.editionListData = res.data.data;
        this.tables.push(this.editionListData[0].editionNameZh);
        this.joinTogethers.push(this.editionListData[0].editionNameZh);
        this.screenData.courseEditionId = 1;
        this.levelList = this.editionListData[0].courseLevelInfoList;
        this.tables[0] += " " + this.levelList[0].courseName;
        this.joinTogethers.push(this.levelList[0].courseName);
        this.screenData.courseLevel = 1;
        this.unitList = this.levelList[0].courseUnitList;
        this.tables[0] += " " + "unit" + this.unitList[0].unitNo;
        this.unitId = this.unitList[0].id;
        this.screenData.unitNo = "1";
        this.getTableData();
      }
    });
  },
  activated() {},
};
</script>
<style lang="scss" scoped>
.course-wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
