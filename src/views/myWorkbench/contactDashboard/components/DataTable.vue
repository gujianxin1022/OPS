<template>
  <div>
    <el-table v-loading="loading" :data="tableData" border size="small"
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }" :span-method="cellSpanMethod"
      @sort-change="handleSortChange">
      <el-table-column :label="$t('序号')" type="index" :index="getColumnIndex" width="60" align="center"
        fixed></el-table-column>
      <el-table-column :label="$t('家长ID')" width="150" fixed>
        <template v-slot="{ row }">
          <el-button type="text" @click="goParentInfo(row)">{{ row.parentId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="employeeName" :label="isCC ? 'CC' : 'LA'" width="100" align="center"></el-table-column>
      <el-table-column prop="subjectTypeName" :label="$t('学科')" align="center"></el-table-column>
      <el-table-column prop="1" :label="$t('首次付费日期')" width="125" align="center" sortable="custom">
        <template v-slot="{ row }">
          <div>{{ formatDate(row.firstSubjectPayTime) }}</div>
          <div>({{ row.firstSubjectPayTimeCycle }})</div>
        </template>
      </el-table-column>
      <el-table-column prop="2" :label="$t('最近课消时间')" width="150" align="center" sortable="custom">
        <template v-slot="{ row }">
          <template v-if="row.lastSubjectFinishClassTime">
            <div>{{ formatDateTime(row.lastSubjectFinishClassTime) }}</div>
            <div>({{ getDaysAgoText(row.lastSubjectFinishClassTime) }})</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="subjectRemainBalance" :label="$t('剩余课时')" width="80" align="center"></el-table-column>
      <el-table-column prop="3" :label="$t('最近分配时间')" width="150" align="center" sortable="custom">
        <template v-slot="{ row }">
          <template v-if="row.lastAssignTime">
            <div>{{ formatDateTime(row.lastAssignTime) }}</div>
            <div>({{ getDaysAgoText(row.lastAssignTime) }})</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template v-slot:header>
          <span>{{ $t('用户账号绑定微信') }}</span>
          <el-tooltip class="item" effect="dark" :content="$t('若家长账号与微信未绑定，则系统无法识别您是否与家长有好友或群聊')" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template v-slot="{ row }">
          <el-tag v-if="row.isBindWechat" type="success">{{ $t('已绑定') }}</el-tag>
          <div v-else>
            <el-tag type="info">{{ $t('未绑定') }}</el-tag>
            <!-- <el-button v-if="isSelfScope" type="text" size="mini" icon="el-icon-edit"
              @click="goBindWechat(row)"></el-button> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column width="130" align="center">
        <template v-slot:header>
          <span>{{ $t('是否下载家长端APP') }}</span>
          <el-tooltip class="item" effect="dark" :content="$t('LingoAce Connect APP统计下载说明')" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template v-slot="{ row }">
          <span v-if="row.isLoadParentApp">{{ $t('是') }}[{{ row.parentAppVersion }}]</span>
          <span v-else>{{ $t('否') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('与用户有微信好友')" width="120" align="center">
        <template v-slot="{ row }">
          {{ toYesOrNo(row.isWechatFriend) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('与用户有微信群')" width="120" align="center">
        <template v-slot="{ row }">
          {{ toYesOrNo(row.isWechatGroup) }}
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template v-slot:header>
          <span>{{ $t('与用户有有效通话') }}</span>
          <el-tooltip class="item" effect="dark" :content="$t('与用户有有效通话描述')" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template v-slot="{ row }">
          {{ toYesOrNo(row.isActiveCall) }}
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template v-slot:header>
          <span>{{ $t('是否在IM有互动') }}</span>
          <el-tooltip class="item" effect="dark" :content="$t('是否在IM有互动描述')" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template v-slot="{ row }">
          {{ toYesOrNo(row.isImLink) }}
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" fixed="right">
        <template v-slot:header>
          <span>{{ $t('是否建联') }}</span>
          <el-tooltip class="item" effect="dark" :content="$t('是否建联描述')" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template v-slot="{ row }">
          <el-tag v-if="row.isLink" type="success" size="mini">{{ $t('是') }}</el-tag>
          <el-tag v-else type="danger" size="mini">{{ $t('否') }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <custom-pagination :current-page="pagination.currentPage" :pageSize="pagination.pageSize" :total="pagination.total"
      @getCurrentPage="onCurrentPageChange" @getPerPage="onPageSizeChange" />
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: 'DataTable',
  props: {
    list: {
      type: Array,
      required: true
    },
    pagination: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
    },
    // 当前筛选的数据是否属于登录用户的数据范围
    isSelfScope: {
      type: Boolean,
    },
    // 是 CC or LA
    isCC: {
      type: Boolean,
    },
  },
  computed: {
    isEnLanguage() {
      return this.$i18n.locale === 'en';
    },
    tableData() {
      const list = this.list;
      const result = [];
      list.forEach((item, index) => {
        item.dfResps.forEach((resp, subIndex) => {
          result.push({
            ...resp,
            parentIndex: index,
            rowspan: subIndex === 0 ? item.dfResps.length : 0,
            colspan: subIndex === 0 ? 1 : 0,
          });
        });
      });
      return result;
    }
  },
  methods: {
    getColumnIndex(index) {
      const row = this.tableData[index];
      const begin = (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
      return begin + row.parentIndex;
    },
    cellSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 2 || columnIndex > 6) {
        return {
          rowspan: row.rowspan,
          colspan: row.colspan
        };
      }
    },
    onPageSizeChange(val) {
      this.$emit('size-change', val)
    },
    onCurrentPageChange(val) {
      this.$emit('current-change', val)
    },
    formatDate(date) {
      if (date) {
        return moment(date).format("YYYY-MM-DD");
      }
      return "";
    },
    formatDateTime(date) {
      if (date) {
        return moment(date).format("YYYY-MM-DD HH:mm");
      }
      return "";
    },
    // 获取一个时间距离今天是x天前
    getDaysAgoText(date) {
      if (date) {
        const now = moment();
        const daysAgo = now.diff(date, "days");
        return this.$tc("x天前", daysAgo, { x: daysAgo });
      }
      return "";
    },
    handleSortChange(data) {
      this.$emit('sort-change', data);
    },
    goParentInfo(row) {
      this.$router.push({
        path: '/studentManagement/parentInfo',
        query: {
          parentUserId: row.parentId,
        }
      });
    },
    goBindWechat(row) {
      this.$router.push({
        path: '/studentManagement/parentWechatBinding',
        query: {
          parentId: row.parentId,
        }
      });
    },
    toYesOrNo(val) {
      return val ? this.$t('是') : this.$t('否');
    },
  }
}
</script>
