<template>
  <el-dialog
    :title="$t('加入学生')"
    :show-close="true"
    :visible.sync="show"
    :close-on-click-modal="false"
    :before-close="close"
    width="900px"
    append-to-body
  >
    <div v-loading="loading">
      <div class="searchWrap mb10">
        <el-input
          style="width: 300px; margin: 0 10px"
          v-model.trim="screenData.parentUserId"
          :placeholder="$t('请输入家长ID查询')"
        />
        <el-button type="primary" @click="search">{{
          $t("my-home-Search")
        }}</el-button>
      </div>
      <el-table
        :data="studentList"
        style="width: 100%"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        height="340px"
      >
        <el-table-column
          prop="studentId"
          :label="$t('Student ID')"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="realName"
          :label="$t('学生名字')"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="parentId"
          align="center"
          width="160"
          :label="$t('家长ID')"
        >
        </el-table-column>
        <el-table-column
          prop="gender"
          align="center"
          :label="$t('my-home-Gender')"
          width="80"
        >
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.gender | mapGender }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          align="center"
          :label="$t('my-home-Age')"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="countryOfResidence"
          :label="$t('所在地')"
          align="center"
          width="140"
        >
        </el-table-column>
        <el-table-column :label="$t('学生所在班级')" align="center" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.classNames">
              <p>{{ scope.row.classNames }}</p>
            </div>
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="joinClass(scope.$index, studentList)"
              type="text"
              size="small"
            >
              {{ $t("加入班级") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="currentPage"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { ABNORMAL_CODE } from "@/utils/constants";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    groupDetailsInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      studentList: [],
      screenData: {
        page: 1,
        page_size: 50,
        parentUserId: "",
      },
      total: -1,
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    show(newData, oldData) {
      if (newData) {
        this.getData();
      }
    },
  },
  methods: {
    search() {
      if (!/^[0-9]*$/.test(this.screenData.parentUserId)) {
        this.$notify({
          message: this.$t("请输入正确的家长ID格式"),
          type: "error",
        });
        return;
      }
      this.currentPage = 1;
      this.screenData.page = 1;
      this.getData();
    },
    close() {
      this.$emit("close");
      this.screenData.parentUserId = "";
    },
    joinClass(index, data) {
      this.$alert(`${this.$t("确定加入班级吗")}？`, this.$t("加入班级"), {
        confirmButtonText: this.$t("my-home-Confirm"),
        callback: (action) => {
          if (action == "confirm") {
            this.addStudent(data[index].studentId);
          }
        },
      });
    },
    getData() {
      this.loading = true;
      this.$Api.groupManagement.getStudentList(this.screenData).then((res) => {
        this.total = res.data.data.total;
        this.studentList = res.data.data.list;
        this.loading = false;
      });
    },
    addStudent(student_id) {
      if (this.groupDetailsInfo.classTypeId == 2) {
        this.$Api.groupManagement
          .addStudentToSmallClass({
            class_id: this.groupDetailsInfo.id,
            student_id,
          })
          .then((res) => {
            if (
              res.data.code === ABNORMAL_CODE.releaseOrAppointmentTimeConflict
            ) {
              this.$notify({
                message: this.$t("发布或者约课时间有冲突"),
                type: "error",
              });
            }
            if (res.data.code == 200) {
              this.$notify({
                message: this.$t("加入班级成功"),
                type: "success",
              });
              this.close();
              this.$emit("getGroupInfo");
            }
          });
      } else {
        this.$Api.groupManagement
          .addStudentToBigClass({
            class_id: this.groupDetailsInfo.id,
            student_id,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$notify({
                message: this.$t("加入班级成功"),
                type: "success",
              });
              this.close();
              this.$emit("getGroupInfo");
            }
          });
      }
    },
    getCurrentPage(currentPage) {
      this.currentPage = currentPage;
      this.screenData.page = currentPage;
      this.getData();
    },
    getPerPage(perPage) {
      this.screenData.page_size = perPage;
      this.getData();
    },
  },
};
</script>
<style lang="scss" scoped>
.searchWrap {
  display: flex;
}
</style>
