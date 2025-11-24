<template>
  <div class="student-wrap">
    <screen-wrapper @search="search" screenTitle="">
      <screen-item
        :label="$t('glb-student')"
        v-if="
          Per.handleButtonPer(
            'teach.studentMT.newStudent.nlFilterByStudentName'
          )
        "
      >
        <el-input
          clearable
          v-model="screenData.studentName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '学生账户名')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item :label="$t('学生ID')">
        <el-input
          clearable
          v-model="screenData.studentUserId"
          :placeholder="$t('请输入学生ID')"
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        :label="$t('glb-parent')"
        v-if="
          Per.handleButtonPer('teach.studentMT.newStudent.nlFilterByParentName')
        "
        @keyup.enter.native="search"
      >
        <el-input
          clearable
          v-model.trim="screenData.parentUserName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '家长账户名')
          "
        />
      </screen-item>
      <screen-item
        :label="$t('家长id')"
        v-if="
          Per.handleButtonPer('teach.studentMT.newStudent.nlFilterByParentName')
        "
        @keyup.enter.native="search"
      >
        <el-input
          clearable
          v-model.trim="screenData.parentUserId"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '家长ID')
          "
        />
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <div slot="header-right">
        <el-button
          type="primary"
          @click="createStudentUser()"
          v-if="
            Per.handleButtonPer(
              'teach.studentMT.newStudent.nlCreateStudentUser'
            )
          "
          >{{ $t("创建账号") }}</el-button
        >
      </div>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (currentPage - 1) * perPage + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="studentName"
          :label="$t('glb-student')"
          width="150"
        >
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.studentName"
              :to="{
                path: `studentInfo`,
                query: {
                  studentId: scope.row.studentId,
                  studentName: scope.row.studentName,
                },
              }"
            >
              <el-button type="text">{{ scope.row.studentName }}</el-button>
            </router-link>
            <span v-else>{{ `[${$t("未设置")}]` }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="studentId"
          :label="$t('学生ID')"
          width="150"
        />
        <el-table-column
          fixed
          align="center"
          prop="parentUserId"
          :label="$t('家长id')"
          width="150"
        >
          <template slot-scope="scope">
            <span>
              <router-link
                :to="{
                  path: `parentInfo`,
                  query: { parentUserId: scope.row.parentUserId },
                }"
              >
                <el-button type="text">{{ scope.row.parentUserId }}</el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="studentArea"
          :label="$t('Student area')"
          :width="currentLang == 'en' ? 120 : 100"
        />
        <!-- 来源 -->
        <el-table-column
          align="center"
          prop="source"
          :label="$t('my-home-Sources')"
          :width="currentLang == 'en' ? 140 : 110"
        />
        <el-table-column
          align="center"
          prop="createTime"
          :label="$t('Date of registration')"
          :width="currentLang == 'en' ? 140 : 110"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button
              v-if="
                Per.handleButtonPer(
                  'teach.studentMT.newStudent.nlResetPassword'
                )
              "
              type="text"
              @click="resetpassword(scope.row.parentUserId)"
              >{{ $t("student-management-Reset Password") }}</el-button
            >
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
    <CreateStudentUserDialog
      v-if="showCreateSDialog"
      :showCreateSDialog="showCreateSDialog"
      @getNewStudentListData="getTableData"
      @closeCreateStudentUser="closeCreateStudentUser"
    />
  </div>
</template>

<script>
import { resetCUserPsw, managerNewStudent } from "@/api/classManagement/";
import { parentIdValidate } from "@/utils/reg.js";
import { mapState, mapMutations } from "vuex";
import CreateStudentUserDialog from "./subPage/CreateStudentUserDialog";
export default {
  name: "newStudentList",
  components: {
    CreateStudentUserDialog,
  },
  data() {
    return {
      checked: true,
      screenData: {
        pageNum: "1",
        pageSize: "50",
        parentUserName: "",
        studentName: "",
        parentUserId: "",
        studentUserId:""
      },
      loading: true, // 加载loading
      // closeAdviser: false,
      // 当前页
      currentPage: 1,
      // 一共多少页
      total: 0,
      // 每页多少数据
      perPage: 50,
      // 表格数据
      tableData: [],
      multipleSelection: [],
      // adviserSubmit: {
      //   student_ids: [],
      //   course_adviser_id: "",
      // },
      adviserId: "",
      showCreateSDialog: false,
    };
  },
  created() {
    this.loading = false;
  },
  computed: {
    ...mapState({
      xgAndGwList: (state) => state.user.xgAndGwList,
      currentLang: (state) => state.app.currentLang,
    }),
    gwTeacherList() {
      return this.xgAndGwList.filter((item) => item.roleName == "课程顾问");
    },
  },
  methods: {
    // 创建学生账号 打开弹窗
    createStudentUser() {
      this.showCreateSDialog = true;
    },
    closeCreateStudentUser() {
      this.showCreateSDialog = false;
    },
    // 重置密码
    resetpassword(id) {
      var username = "";
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          username = this.tableData[i].studentRealName;
        }
      }
      this.$confirm(
        this.$t("student-management-Confirm reset password", {
          username: username,
        }),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("my-home-Confirm"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      )
        .then(async () => {
          const { data } = await resetCUserPsw(id, 1);
          if (data.code === 200) {
            this.$notify({
              type: "success",
              message: this.$t("reset successfully"),
            });
          }
        })
        .catch((_) => {});
    },
    // 筛选
    search() {
      if (
        this.screenData &&
        this.screenData.parentUserId &&
        !parentIdValidate(this, this.screenData.parentUserId)
      ) {
        return;
      }
      this.currentPage = 1;
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    // 表格数据
    getTableData() {
      this.loading = true;
      let params = this.screenData;
      managerNewStudent(params).then((res) => {
        if (res.data.code == 200) {
          if (res.data.data) {
            this.total = res.data.data.total;
            this.tableData = res.data.data.list;
          } else {
            this.tableData = [];
          }
        }
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
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    sortChange(column) {
      if (column.order === "ascending") {
        // 升序
        this.screenData.ordering = column.prop + " asc";
      } else if (column.order === "descending") {
        // 降序
        this.screenData.ordering = "-" + column.prop + " desc";
      } else {
        return;
      }
      this.getTableData();
    },
    getSortClass(key) {
      const sort = this.screenData.ordering;
      return sort === `${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  margin-top: 20px;
}
</style>
