<template>
  <div class="white-list">
    <!-- 搜索 -->
    <header>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="$t('视频主题')">
          <el-select
            v-model="formInline.courseTopicId"
            :placeholder="$t('请选择视频主题')"
            clearable
            @change="slet"
          >
            <el-option
              v-for="item in videoList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('家长ID')">
          <el-input
            clearable
            v-model="formInline.parentUserId"
            :placeholder="$t('请输入家长ID')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{
            $t("查询")
          }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 添加 -->
      <el-button class="el-righit" type="primary" @click="dialogForm('add')"
        >{{ $t("新增白名单") }}
      </el-button>
    </header>
    <!-- 表格 -->
    <main>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="title" :label="$t('视频主题')">
        </el-table-column>
        <el-table-column prop="parentUserId" :label="$t('家长id')">
        </el-table-column>
      </el-table>
    </main>
    <!-- 分页 -->
    <footer>
      <PaginationIndex
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @getPerPage="handleSizeChange"
        @getCurrentPage="handleCurrentChange"
      />
    </footer>
    <!-- 弹窗框 -->
    <el-dialog
      :title="$t('新增白名单')"
      :visible.sync="dialogFormVisible"
      @close="eliminate"
      width="1000px"
      top="5vh"
    >
      <WhiteDialog
        :form="form"
        :tags="tags"
        :videoList="videoList"
        :errTags="errTags"
        @changeEdition="changeEdition"
        @addList="addList"
        @deleteList="deleteList"
        @deleteTag="deleteTag"
        @importList="importList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="eliminate">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="dialogForm('yes')">{{
          $t("确定")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import WhiteDialog from "./components/whiteDialog.vue";
import PaginationIndex from "@/customUI/components/customPagination/index";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: "whitelist",
  components: {
    PaginationIndex,
    WhiteDialog,
  },
  data() {
    return {
      // 下拉 输入
      formInline: {
        parentUserId: null,
        courseTopicId: null,
      },
      videoList: [],
      // 表格数据
      tableData: [],
      // 分页
      currentPage: 1, //第几页
      pageSize: 50, //每页几条数据
      total: 0, //总条数
      // 弹出框
      form: {
        parentUserName: "",
        courseTopicId: null,
      },
      parentUserIds: [],
      dialogFormVisible: false,
      // tag
      tags: [],
      errTags: [],
    };
  },
  computed: {},
  methods: {
    // 下拉
    slet(val) {
      this.formInline.courseTopicId = val;
    },
    // 搜索
    async onSubmit() {
      if (this.formInline && this.formInline.parentUserId && !parentIdValidate(this, this.formInline.parentUserId)) {
        return;
      }
      if (this.formInline.courseTopicId == "")
        return (this.formInline.courseTopicId = null);
      if (this.formInline.parentUserId == "")
        return (this.formInline.parentUserId = null);
      const pageNum = this.currentPage;
      const pageSize = this.pageSize;
      const { parentUserId, courseTopicId } = { ...this.formInline };
      const {
        status,
        data: { code, data },
      } = await this.$Api.teacherManagement.getQuery({
        pageNum,
        pageSize,
        parentUserId,
        courseTopicId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      this.tableData = data.list;
      this.total = data.total;
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSubmit();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.onSubmit();
    },
    //弹框 下拉
    changeEdition(val) {
      this.form.courseTopicId = val;
    },
    // 确定 取消
    async dialogForm(val) {
      if (val === "yes") {
        if (this.parentUserIds == "" || this.form.courseTopicId == "") {
          return this.$message.error("请填加视频主题和家长用户名");
        } else {
          if (this.form.courseTopicId == "")
            return (this.form.courseTopicId = null);
          const { courseTopicId } = { ...this.form };
          const parentUserIds= this.parentUserIds;
          const {
            status,
            data: { code, data, message },
          } = await this.$Api.teacherManagement.getWhiteList({
            courseTopicId,
            parentUserIds,
          });
          if (status !== 200 || code !== 200) return Promise.reject();
          if (message === "用户名不存在，请检查后重新输入") {
            let list = data.toString();
            this.$message({
              message: "当前家长姓名 " + list + " 不存在",
              type: "error",
            });
            this.findErrTags(data);
          } else {
            this.$message.success("添加成功");
            this.eliminate();
          }
        }
      } else {
        this.dialogFormVisible = true;
      }
    },
    eliminate() {
      this.tags = [];
      this.dialogFormVisible = false;
      this.form = {
        parentUserName: "",
        courseTopicId: null,
      };
      this.parentUserIds = [];
    },
    // 添加单个tag
    addList(val) {
      this.parentUserIds.unshift(val);
      this.tags.unshift(val);
    },
    // 批量导入tag
    importList(arr) {
      this.parentUserIds = [...arr, ...this.parentUserIds];
      this.tags = [...arr, ...this.tags];
      this.errTags = [];
    },
    // 删除全部tag
    deleteList(val) {
      this.tags = val;
      this.parentUserIds = [];
    },
    // 删除单个tag
    deleteTag(val) {
      this.tags.splice(this.tags.indexOf(val), 1);
      this.parentUserIds.splice(this.parentUserIds.indexOf(val), 1);
    },
    // 找出错误tags
    findErrTags(errArr) {
      this.errTags = errArr;
    },
  },
  async created() {
    const {
      status,
      data: { code, data },
    } = await this.$Api.teacherManagement.getVideoTopicList();
    if (status !== 200 || code !== 200) return Promise.reject();
    this.videoList = data;
  },
  mounted() {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.white-list {
  padding: 20px;
  .el-righit {
    float: right;
  }
  .el-input--small .el-input__inner {
    width: 100px;
  }
}
</style>
