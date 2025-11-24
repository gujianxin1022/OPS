<template>
  <div class="ipa-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('筛选查询')">
      <screen-item :label="$t('合同模版名称')">
        <el-input
          v-model.trim="screenData.contractTemplateName"
          :placeholder="
            $t('glb-input') + (currentLang === 'en' ? '...' : $t('合同模版名称'))
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item :label="$t('适用学科')">
        <el-select v-model="screenData.subjectType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in classOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('状态')">
        <el-select v-model="screenData.status" :placeholder="$t('请选择')">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')">
      <div slot="header-right">
        <el-button @click="showAddDialog(null, false)" type="primary">
            {{ $t("新建合同") }}
          </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :header-cell-style="{ background: '#7e8ae7', color: '#fff' }"
      >
        <el-table-column
          fixed
          align="center"
          prop="contractTemplateName"
          :label="$t('合同模版名称')"
          min-width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="contractTemplateNo"
          :label="$t('合同模版编号')"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('合同类型')"
        >
        <template slot-scope="scope">
          {{ scope.row.contractType === 0 ? '员工合同' : '--' }}
        </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('适用学科')"
        >
        <template slot-scope="scope">
            <span v-if="scope.row.subjectType === 0">中文</span>
            <span v-if="scope.row.subjectType === 1">英文</span>
            <span v-if="scope.row.subjectType === 2">数学</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('适用范围')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.templateScope === 0">兼职教师</span>
            <span v-if="scope.row.templateScope === 1">全职教师</span>
            <span v-if="scope.row.templateScope === 2">全体教师</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('合同周期')"
        >
        <template slot-scope="scope">
            {{ scope.row.contractDuration }} 月
          </template>
        </el-table-column>
        <el-table-column
          prop="validStartTime"
          align="center"
          :label="$t('合同模版生效时间(北京)')"
          width="180"
        >
        <template slot-scope="scope">
          {{ DateTimeUtils.dateClockTime(scope.row.validStartTime) }}
        </template>
        </el-table-column>
        <el-table-column
          prop="validEndTime"
          align="center"
          :label="$t('合同模版失效时间(北京)')"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.validEndTime.includes('2099') ? '暂无' : DateTimeUtils.dateClockTime(scope.row.validEndTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="templateCreator"
          align="center"
          :label="$t('创建人')"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('状态')"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">
              {{ $t("生效中") }}
            </el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 0">
              {{ $t("已失效") }}
            </el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 2">
              {{ $t("待生效") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="attachmentAddr"
          align="center"
          :label="$t('合同附件')"
          width="150"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
            <el-button type="text" @click="goRead(scope.row.attachmentAddr)">{{
              $t("查看")
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="showAddDialog(scope.row, false)" v-if="scope.row.status !== 0">{{
              $t("编辑")
            }}</el-button>
            <el-button type="text" @click="showAddDialog(scope.row, true)">{{
              $t("查看")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </custom-card>
    <!-- 分页 -->
    <custom-pagination
      :total="total"
      :current-page="currentPage"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <addOrEditContractDialog
      v-if='dialogVisible'
      :visible.sync="dialogVisible"
      :row-data="currentRow"
      @update-table="getTableData"
      @close="handleDialogClose"
      :isView="isView"
    />
  </div>
</template>

<script>
import {getContractTemplateList} from "@/api/teacherContractTemplate";
import { mapState, mapMutations } from "vuex";
import addOrEditContractDialog from "./_dialog/addOrEditContract.vue";

export default {
  name: "teacherContractTemplate",
  components: {
    addOrEditContractDialog
  },
  data() {
    return {
      isView: false,
      dialogVisible:false,
      currentRow: null,
      screenData: {
        contractTemplateName: "",
        status: "3",
        subjectType: "3",
        pageNum: 1,
        pageSize: 50
      },
      pageNum: 1,
      pageSize: 50,
      loading: true,
      // 当前页
      currentPage: 1,
      // 一共多少页
      total: 0,
      // 每页多少数据
      perPage: 50,
      // 表格数据
      tableData: [],
      classOptions: [],
      typeOptions: [],
    };
  },
  created() {
    this.initData();
    this.getTableData();
  },
  computed: {
    ...mapState({
      xgAndGwList: state => state.user.xgAndGwList,
      xgAndGwListSet: state => state.user.xgAndGwListSet,
      currentLang: state => state.app.currentLang
    })
  },
  watch: {
    currentLang() {
      this.initData();
    }
  },
  methods: {
    // 查看合同附件
    goRead(url) {
      if(url) {
        window.open(url, '__blank');
      } else {
        this.$message.error(this.$t('合同附件不存在'));
      }
    },
    showAddDialog(row, isView) {
      row? this.currentRow = row:this.currentRow = null;
      this.dialogVisible = true;
      this.isView = isView;
    },
    handleDialogClose() {
      this.dialogVisible = false;
      this.currentRow = null;
    },
    initData() {
      this.classOptions = [
        {
          value: "3",
          label: "全部"
        },
        {
          value: "0",
          label: "中文"
        },
        {
          value: "1",
          label: "英文"
        },
        {
          value: "2",
          label: "数学"
        }
      ];
      this.typeOptions = [
        {
          value: "3",
          label: "全部"
        },
        {
          value: "2",
          label: "待生效"
        },
        {
          value: "1",
          label: "生效中"
        },
        {
          value: "0",
          label: "已失效"
        },
      ];
    },
    // 筛选
    search() {
      this.currentPage = 1;
      this.getTableData();
    },
    // 表格数据
    getTableData() {
      this.loading = true;
      const status = this.screenData.status === '3' ? '' : this.screenData.status;
      const subjectType = this.screenData.subjectType === '3' ? '' : this.screenData.subjectType;
      getContractTemplateList(
        this.screenData.pageNum,
        this.screenData.pageSize,
        this.screenData.contractTemplateName,
        status,
        subjectType,
        new Date().toISOString()
      ).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          this.loading = false;
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
        } else {
          this.loading = false;
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    // 获取当前页码
    getCurrentPage(currentPage) {
      this.screenData.pageNum = currentPage;
      this.currentPage = currentPage;
      this.getTableData();
    },
    // 改变每页展示数据的条数
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.perPage = perPage;
      this.getTableData();
    },
  }
};
</script>

<style lang="scss" scoped>
.ipa-wrap {
  .type-btn {
    padding: 20px 0;
  }
  .more-select {
    .data-box {
      width: 397px;
      height: 280px;
      overflow: scroll;
      padding: 20px;
      border-radius: 4px;
      border: solid 1px #ccc;
      line-height: 10spx;
      p {
        span {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>


