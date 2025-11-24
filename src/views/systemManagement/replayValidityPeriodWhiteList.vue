<template>
  <div class="video-white-list">
    <div class="pl15 tips">
      {{
        $t(
          "说明：课程回放有效期白名单为家长维度，加入白名单后，家长在用户端查看课程回放的有效期为365天"
        )
      }}
    </div>
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item :label="$t('添加时间')">
        <el-date-picker
          v-model="query.timeRange"
          type="daterange"
          :start-placeholder="$t('开始时间')"
          :end-placeholder="$t('结束时间')"
          size="small"
          :default-time="['00:00:00', '23:59:59']"
        />
      </screen-item>
      <screen-item :label="$t('家长ID')">
        <el-input clearable v-model.trim="query.parentId" />
      </screen-item>
      <screen-item :label="$t('添加操作人')">
        <FilterByOPSAccount
          @change="
            (user) => {
              query.opsUserId = user.userInfo.id;
            }
          "
        />
      </screen-item>
    </screen-wrapper>
    <div class="table-title">
      <div>{{ $t("数据列表") }}</div>
      <el-button type="primary" @click="openAddDialog">
        {{ $t("添加") }}
      </el-button>
    </div>
    <el-table
      :data="dataList"
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
    >
      <el-table-column type="index" :index="getRowIndex" width="50">
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('添加时间')">
        <template v-slot="{ row }">
          {{ toFormatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="opsUserName" :label="$t('添加操作人')">
      </el-table-column>
      <el-table-column prop="parentUserId" :label="$t('家长ID')">
      </el-table-column>
      <el-table-column :label="$t('操作')" width="100">
        <template v-slot="{ row }">
          <el-button type="text" size="small" @click="deleteItem(row)">{{
            $t("移除")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :current-page="page.pageNum"
      :total="page.total"
      :pageSize="page.pageSize"
      @getCurrentPage="onCurrentPageChange"
      @getPerPage="onPageSizeChange"
    />
    <el-dialog
      v-if="addDialogVisible"
      :title="$t('添加白名单')"
      :visible.sync="addDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="addForm" :model="addForm" :rules="addRules">
        <el-form-item :label="$t('批量数据')" prop="parentIds">
          <el-input
            type="textarea"
            :rows="10"
            :placeholder="batchAddPlaceholder"
            v-model="addForm.parentIds"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="closeAddDialog">{{ $t("取消") }}</el-button>
        <el-button
          type="primary"
          :loading="addBtnLoading"
          @click="postBatchAddWhiteList"
          >{{ $t("确定") }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import {
  reqVideoExpireWhiteList,
  deleteWhiteList,
  batchAddWhiteListForVideoExpire,
} from "@/api/systemManagement";
import FilterByOPSAccount from "@/components/FilterItem/UserDimensionFilter/FilterByOPSAccount";
export default {
  components: {
    FilterByOPSAccount,
  },
  data() {
    return {
      query: {
        timeRange: [], // 时间范围
        parentId: "", // 家长id
        opsUserId: "", // ops用户名
      },
      loading: false,
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      addDialogVisible: false,
      addBtnLoading: false,
      addForm: {
        parentIds: "",
      },
      parentIdList: [], // 用户输入的家长id转换成数组
      addRules: {
        parentIds: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error(this.$t("请输入家长ID")));
              }
              const list = value
                .split(/[\s,，]/)
                .map((item) => {
                  return item ? item.trim() : "";
                })
                .filter(Boolean);
              if (list.length === 0) {
                return callback(new Error(this.$t("请输入家长ID")));
              }
              if (list.length > this.batchAddMax) {
                return callback(new Error(this.batchAddPlaceholder));
              }
              const reg = /^\d+$/;
              const index = list.findIndex((item) => !reg.test(item));
              if (index > -1) {
                return callback(
                  new Error(
                    `${this.$t("请输入正确的家长ID")}, n = ${index + 1}`
                  )
                );
              }
              this.parentIdList = list;
              callback();
            },
            trigger: "blur",
          },
        ],
      },
      batchAddMax: 500, // 批量添加最大数量
    };
  },
  computed: {
    batchAddPlaceholder() {
      return this.$t("每行一个家长id，以回车分割，最多x条", {
        x: this.batchAddMax,
      });
    },
  },
  created() {
    this.getDataList();
  },
  methods: {
    search() {
      this.page.pageNum = 1;
      this.getDataList();
    },
    // 获取列表数据
    async getDataList() {
      const params = {
        parentUserId: this.query.parentId,
        opsUserId: this.query.opsUserId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      };
      const numberReg = /^\d+$/;
      if (params.parentUserId && !numberReg.test(params.parentUserId)) {
        this.$message.error(this.$t("请输入正确的家长ID"));
        return;
      }
      this.loading = true;
      this.dataList = [];
      const timeRange = this.query.timeRange;
      if (timeRange && timeRange.length > 1) {
        params.startTime = timeRange[0].toISOString();
        params.endTime = timeRange[1].toISOString();
      }
      const data = await reqVideoExpireWhiteList(params);
      this.page.total = data.total;
      this.dataList = data.list;
      this.loading = false;
    },
    // 当前页码改变
    onCurrentPageChange(val) {
      this.page.pageNum = val;
      this.getDataList();
    },
    // 每页展示数据条数改变
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNum = 1;
      this.getDataList();
    },
    // 行号
    getRowIndex(index) {
      return (this.page.pageNum - 1) * this.page.pageSize + index + 1;
    },
    // 移除白名单
    deleteItem(item) {
      this.$confirm(this.$t("是否确定删除？"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning",
      }).then(async () => {
        try {
          const data = {
            parentUserId: item.parentUserId,
          };
          await deleteWhiteList(data);
          this.$notify({
            message: this.$t("操作成功"),
            type: "success",
          });
        } finally {
          this.getDataList();
        }
      });
    },
    openAddDialog() {
      this.addForm.parentIds = "";
      this.parentIdList = [];
      this.addDialogVisible = true;
    },
    closeAddDialog() {
      this.addDialogVisible = false;
    },
    // 批量添加白名单
    postBatchAddWhiteList() {
      this.$refs["addForm"].validate(async (valid) => {
        if (!valid) {
          return;
        }
        const list = this.parentIdList;
        if (list.length === 0) {
          return;
        }
        try {
          this.addBtnLoading = true;
          const res = await batchAddWhiteListForVideoExpire(list);
          if (res.code === 200) {
            this.$notify({
              message: this.$t("操作成功"),
              type: "success",
            });
            this.search();
            this.closeAddDialog();
            return;
          } else {
            const unExistsList = (res.data.notExistParentUserIds || []).map(
              (item) => {
                return String(item);
              }
            );
            if (unExistsList.length > 0) {
              const errorMsg = res.message || this.$t("账号不存在或格式错误");
              const inputVal = list.map((item) => {
                if (unExistsList.includes(item)) {
                  return `${item} (${errorMsg})`;
                }
                return item;
              });
              this.addForm.parentIds = inputVal.join("\n");
            }
          }
        } finally {
          this.addBtnLoading = false;
        }
      });
    },
    toFormatTime(val) {
      if (val) {
        return moment(val).format("YYYY-MM-DD HH:mm:ss");
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.video-white-list {
  padding: 10px;
  .tips {
    font-size: 14px;
    color: #989898;
  }
}

.table-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;

  > div {
    color: #99a9bf;
    font-size: 14px;
  }
}
</style>
