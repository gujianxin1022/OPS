<template>
  <div class="first-class-report-template">
    <screen-wrapper @search="search" :screenTitle="$t('报告模板')">
      <screen-item :label="$t('版本')" label-width="100">
        <el-select
          clearable
          filterable
          v-model="selectedEdition"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in editionAndLevelInfo"
            :key="index"
            :label="currentLang == 'en' ? item.labelEn : item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('状态')" label-width="100">
        <el-select v-model="selectedStatus" :placeholder="$t('请选择')">
          <el-option
            v-for="(item, index) in allStatusArr"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
    </screen-wrapper>
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <div class="flex1">
        <el-button type="primary" size="small" @click="addTemplate">{{
          $t("添加模板")
        }}</el-button>
      </div>
      <el-table
        v-loading="loading"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        tooltip-effect="dark"
        fit
        style="width: 100%"
        :data="tableData"
      >
        <el-table-column
          fixed
          prop="id"
          align="center"
          :label="$t('模板id')"
          :width="currentLang == 'en' ? 110 : 100"
        >
        </el-table-column>
        <el-table-column align="center" prop="versions" :label="$t('版本')">
          <template slot-scope="scope">{{
            versionStatusMap[scope.row.versions]
          }}</template>
        </el-table-column>
        <el-table-column align="center" prop="name" :label="$t('模板名称')" />
        <el-table-column
          align="center"
          prop="createTime"
          :label="$t('创立时间')"
        >
          <template slot-scope="scope">{{
            scope.row.createTime.split("T")[0]
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          :label="$t('更新时间')"
        >
          <template slot-scope="scope"
            ><span>{{
              DateTimeUtils.dateClockTime(scope.row.updateTime)
            }}</span></template
          >
        </el-table-column>
        <el-table-column
          align="center"
          prop="lessonInfo"
          :label="$t('关联试听课')"
        >
          <template slot-scope="scope">
            <div
              v-for="(classItem, classIndex) in scope.row.lessonInfo"
              :key="classIndex"
            >
              {{ classItem.courseEditionId | mapEdtion }} Level{{
                classItem.courseLevelNo
              }}
              Lesson{{ classItem.courseLessonNo }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" :label="$t('状态')">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? "已发布" : "未发布" }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button type="text" @click="view(scope.row)">{{
              $t("查看")
            }}</el-button>
            <el-button type="text" @click="edit(scope.row)">{{
              $t("编辑")
            }}</el-button>
            <el-button type="text" @click="link(scope.row)">{{
              $t("关联试听课")
            }}</el-button>
            <el-button
              v-if="scope.row.status === 1"
              type="text"
              @click="multilingual(scope.row)"
              >{{ $t("多语言管理") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </custom-card>
    <custom-pagination
      :total="total"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="currentSize"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getHistoryClassPerPage"
    />
    <el-dialog
      title="多语言管理"
      :visible.sync="dialogVisible"
      width="350px"
      :before-close="handleClose"
    >
      <el-table :data="versionTableData" style="width: 100%">
        <el-table-column prop="name" label="版本"> </el-table-column>
        <el-table-column align="center" prop="status" :label="$t('状态')">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? "已发布" : "未发布" }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button
              @click="viewMultilingualTem(scope.row)"
              type="text"
              size="small"
              >查看</el-button
            >
            <el-button
              @click="editMultilingualTem(scope.row)"
              type="text"
              size="small"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "firstClassReportTemplate",
  data() {
    return {
      loading: false,
      selectedEdition: null,
      selectedStatus: null,
      allStatusArr: [
        {
          value: 2,
          label: "待发布",
        },
        {
          value: 1,
          label: "已发布",
        },
        {
          value: null,
          label: "全部",
        },
      ],
      tableData: [],
      screenData: {
        pageNum: 1,
        pageSize: 50,
      },
      editionAndLevelInfo: [],
      total: null,
      currentPage: 1,
      currentSize: 50,
      dialogVisible: false,
      versionTableData: [
        {
          index: 0,
          name: "英语",
          status: 1,
          language: "EN",
        },
        {
          index: 1,
          name: "印尼语",
          status: 0,
          language: "IN",
        },
        {
          index: 2,
          name: "泰语",
          status: 0,
          language: "TN",
        },
        {
          index: 3,
          name: "法语",
          status: 0,
          language: "FR",
        },
      ],
      versionStatusMap: {
        1: "V1.0",
        2: "V2.0",
        3: "V3.0",
      },
      curTemplate: null,
    };
  },
  mounted() {
    this.getEditionAndLevel();
    this.search();
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    getCurrentPage(currentPage) {
      this.currentPage = currentPage;
      this.search();
    },
    getHistoryClassPerPage(size) {
      this.currentSize = size;
      this.search();
    },
    edit(item) {
      // this.$router.push({
      //   path: "/reportManagement/editTemplate",
      //   query: {
      //     id: item.id,
      //     status: item.status,
      //   },
      // });
      let routeData = this.$router.resolve({
        path: "/reportManagement/editTemplate",
        query: {
          id: item.id,
          status: item.status,
        },
      });
      window.open(routeData.href, "_blank");
    },
    view(item) {
      this.$router.push({
        path: "/reportManagement/editTemplate",
        query: {
          id: item.id,
          status: item.status,
          type: 1,
        },
      });
    },
    //编辑多语言模板
    editMultilingualTem(item) {
      this.dialogVisible = false;
      this.$router.push({
        path: "/reportManagement/editMultilingualTemplate",
        query: {
          id: this.curTemplate.id,
          status: item.status,
          index: item.index,
          language: item.language,
        },
      });
    },
    //查看多语言模板
    viewMultilingualTem(item) {
      this.dialogVisible = false;
      this.$router.push({
        path: "/reportManagement/editMultilingualTemplate",
        query: {
          id: this.curTemplate.id,
          status: item.status,
          type: 1,
          language: item.language,
        },
      });
    },
    async search() {
      this.loading = true;
      try {
        const {
          status,
          data: { code, data },
        } = await this.$Api.unitReportManagement.getTemplate({
          status: this.selectedStatus,
          pageNum: this.currentPage,
          pageSize: this.currentSize,
          courseEditionId: this.selectedEdition,
          lessionNo: null,
          courseLevel: null,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        if (data !== null) {
          this.tableData = data.list;
          this.total = data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      } finally {
        this.loading = false;
      }
    },
    addTemplate() {
      window.sessionStorage.removeItem("templateId");
      // this.$router.push({
      //   path: "/reportManagement/editTemplate",
      // });
      let routeData = this.$router.resolve({
        path: "/reportManagement/editTemplate",
      });
      window.open(routeData.href, "_blank");
    },
    link(item) {
      this.$router.push({
        path: "/reportManagement/templateLinkClass",
        query: {
          id: item.id,
        },
      });
    },
    multilingual(item) {
      this.versionTableData[0].status = item.nowLanguage.includes("EN")
        ? "1"
        : "2";
      this.versionTableData[1].status = item.nowLanguage.includes("IN")
        ? "1"
        : "2";
      this.versionTableData[2].status = item.nowLanguage.includes("TN")
        ? "1"
        : "2";
      this.versionTableData[3].status = item.nowLanguage.includes("FR")
        ? "1"
        : "2";
      this.dialogVisible = true;
      this.curTemplate = item;
    },
    getEditionAndLevel() {
      this.$Api.base.courseEdition().then((res) => {
        if (res.status === 200) {
          this.editionAndLevelOriginData = res.data.data;
          res.data.data.forEach((editionValue, editionIndex) => {
            this.$set(this.editionAndLevelInfo, editionIndex, {
              value: editionValue.editionId,
              label: editionValue.editionNameZh,
              labelEn: editionValue.editionNameEn,
            });
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scope>
.flex1 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
