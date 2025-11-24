<template>
  <div class="ipa-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('教师IPA列表')">
      <screen-item :label="$t('教师用户名')">
        <span style="display: inline-block; width: 412px;">
          <FilterByUserAccount
            @change="
              (params) => {
                userParams = params;
              }
            "
          />
        </span>
      </screen-item>
      <screen-item :label="$t('IPA状态')">
        <el-select v-model="screenData.ipaStatus" :placeholder="$t('请选择')">
          <el-option
            v-for="item in ipaStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('报名批次')">
        <el-select
          class="ipa-year"
          v-model="screenData.signYear"
          :placeholder="$t('请选择年份')"
        >
          <el-option
            v-for="item in yearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          class="ipa-year"
          v-model="screenData.signBath"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in signBathOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <div slot="header-right">
        <!-- <el-button type="primary" @click="handelExport()">{{
          $t("export")
        }}</el-button> -->
        <el-button type="primary" @click="closeAdviser = true">{{
          $t("批量报名")
        }}</el-button>
        <el-button type="primary" @click="batchAllAttestation()">{{
          $t("批量认证")
        }}</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column type="selection" width="50" />
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
          prop="username"
          :label="$t('教师用户名')"
          min-width="150"
        >
          <!-- <template slot-scope="scope">
            <router-link
              :to="{
                path: `studentInfo`,
                query: {
                  studentId: scope.row.id,
                  studentName: scope.row.username,
                },
              }"
            >
              <el-button type="text">{{ scope.row.username }}</el-button>
            </router-link>
          </template> -->
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="realName"
          :label="$t('真实姓名')"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="ipaStatusValue"
          :label="$t('IPA状态')"
          :width="currentLang == 'en' ? 120 : 100"
        />
        <el-table-column
          prop="bath"
          align="center"
          :label="$t('报名批次')"
          width="150"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('教师管理人员')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.tmUsername">
              {{ scope.row.tmUsername }}
            </span>
            <span v-else>---</span>
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
    <el-dialog
      :before-close="closeAddMoreHours"
      :close-on-click-modal="false"
      width="772px"
      :destroy-on-close="true"
      @close="closeFormDialog"
      :key="timer"
      :title="
        $t(
          '批量增加报名教师（批量操作涉及数据量较大，请谨慎操作，单次最多支持100条数据）'
        )
      "
      center
      :visible.sync="closeAdviser"
    >
      <div class="more-select">
        <el-form
          :inline="true"
          ref="signUpData"
          :rules="ruleMore"
          :model="signUpData"
          label-width="120px"
        >
          <el-form-item :label="$t('报名批次')" prop="year">
            <el-select v-model="signUpData.year" placeholder="请选择">
              <el-option
                v-for="item in optYearOptions"
                :key="item"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="bath">
            <el-select v-model="signUpData.bath" placeholder="请选择">
              <el-option
                v-for="item in optSignBathOptions"
                :key="item"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('批量数据')" prop="tutorUserName">
            <el-input
              style="width: 520px"
              type="textarea"
              :rows="16"
              :placeholder="$t('教师用户名，不同用户隔行隔开')"
              v-model="signUpData.tutorUserName"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="error-message" v-if="errorNum !== 0">
          <el-alert
            :title="
              $t('XX条数据有问题，请修正后点击确定添加', { number: errorNum })
            "
            type="error"
            :center="false"
            :closable="false"
            show-icon
          >
          </el-alert>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAdviser = false"
          >&nbsp;&nbsp;{{$t("取消")}}&nbsp;&nbsp;</el-button
        >
        <el-button
          type="primary"
          @click="sureAddSignUp"
          :loading="addMoreHoursLoading"
          >{{$t("确定添加")}}</el-button
        >
      </div>
    </el-dialog>
    <!-- 批量认证弹窗 -->
    <el-dialog :title="$t('提示')" :visible.sync="warningDialogVisible" width="30%">
      <p>
        {{$t("此操作会将选中教师状态更改为已认证 批量操作涉及数据量较大 请谨慎操作")}}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warningDialogVisible = false">{{$t("取消")}}</el-button>
        <el-button type="primary" @click="sureBatchAllAttestation"
          >{{$t("确定")}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getIPATeacherList,
  getIPAStatus,
  reqInsertIpaSign,
  updateIpaSignStatus
} from "@/api/tutorManagement/";
import { downloadFile } from "@/utils/handleData";
import { mapState, mapMutations } from "vuex";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

export default {
  name: "teacherIPAList",
  components: {
    FilterByUserAccount,
  },
  data() {
    return {
      userParams: {},
      errorNum: 0,
      warningDialogVisible: false,
      screenData: {
        signBath: "",
        signYear: "",
        ipaStatus: "",
        pageNum: 1,
        pageSize: 50
      },
      pageNum: 1,
      pageSize: 50,
      labelWidth: "80",
      role: [],
      loading: true, // 加载loading
      ipaStatusOptions: [],
      yearOptions: [],
      closeAdviser: false,
      // 当前页
      currentPage: 1,
      // 一共多少页
      total: 0,
      // 每页多少数据
      perPage: 50,
      tableHeight: window.innerHeight - 200 || 300,
      // 表格数据
      tableData: [],
      attestationData: {
        tutorUserName: []
      },
      ruleMore: {
        year: [{ required: true, message: "请选择年份", trigger: "blur" }],
        bath: [{ required: true, message: "请选择批次", trigger: "blur" }],
        tutorUserName: [
          { required: true, message: "请输入批量数据", trigger: "blur" }
        ]
      },
      signUpData: {
        bath: "",
        tutorUserName: "",
        year: ""
      },
      timer: new Date().getTime()
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
    initData() {
      (this.signBathOptions = [
        {
          value: "",
          label: this.$t("全部")
        },
        {
          value: "Q1",
          label: "Q1"
        },
        {
          value: "Q2",
          label: "Q2"
        },
        {
          value: "Q3",
          label: "Q3"
        },
        {
          value: "Q4",
          label: "Q4"
        }
      ]),
        (this.optSignBathOptions = [
          {
            value: "Q1",
            label: "Q1"
          },
          {
            value: "Q2",
            label: "Q2"
          },
          {
            value: "Q3",
            label: "Q3"
          },
          {
            value: "Q4",
            label: "Q4"
          }
        ]),
        (this.yearOptions = [
          {
            value: "",
            label: this.$t("全部")
          },
          {
            value: "2021",
            label: "2021"
          },
          {
            value: "2022",
            label: "2022"
          },
          {
            value: "2023",
            label: "2023"
          },
          {
            value: "2024",
            label: "2024"
          },
          {
            value: "2025",
            label: "2025"
          }
        ]);
      this.optYearOptions = [
        {
          value: "2021",
          label: "2021"
        },
        {
          value: "2022",
          label: "2022"
        },
        {
          value: "2023",
          label: "2023"
        },
        {
          value: "2024",
          label: "2024"
        },
        {
          value: "2025",
          label: "2025"
        }
      ];
      getIPAStatus().then(res => {
        if (res.status === 200 && res.data.code === 200) {
          this.ipaStatusOptions = [{ value: "", label: this.$t("全部") }];
          Object.entries(res.data.data).forEach(e => {
            this.ipaStatusOptions.push({ value: e[0], label: e[1] });
          });
        }
      });
    },
    // 筛选
    search() {
      this.currentPage = 1;
      this.getTableData();
    },
    // 表格数据
    getTableData() {
      this.loading = true;
      let params = {
        ...JSON.parse(JSON.stringify(this.screenData)),
        ...this.userParams
      };
      getIPATeacherList(
        this.screenData.pageNum,
        this.screenData.pageSize,
        params
      ).then(res => {
        this.loading = false;
        this.total = res.data.data.total;
        this.tableData = res.data.data.list;
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
    handleSelectionChange(val) {
      this.attestationData.tutorUserName = val.map(item => item.username);
      this.attestationData.tutorUserIds = val.map(item => item.userTutorId);
    },
    // 添加报名
    sureAddSignUp() {
      this.$refs["signUpData"].validate(valid => {
        if (valid) {
          this.signUpData.tutorUserName.split("\n");
          let teacherNameList = this.signUpData.tutorUserName.split("\n");
          if (teacherNameList.length > 100) {
            this.$notify({
              message: "单次最多支持100条数据",
              type: "error"
            });
            return;
          }

          reqInsertIpaSign(
            this.signUpData.year,
            this.signUpData.bath,
            teacherNameList
          ).then(({ status, data }) => {
            if (status === 200 && data.code === 200) {
              if (Array.isArray(data.data) && data.data.length > 0) {
                data.data.forEach(item => {
                  teacherNameList[item.index] += ` (${item.message})`;
                });
                this.signUpData.tutorUserName = teacherNameList.join("\n");
                this.errorNum = data.data.length;
                this.timer = new Date().getTime();
              } else {
                this.$notify({
                  message: "批量报名成功",
                  type: "success"
                });
                this.getTableData();
                this.closeAdviser = false;
              }
            }
          });
        }
      });
    },
    // 批量认证
    batchAllAttestation() {
      if (this.attestationData.tutorUserName.length === 0) {
        this.$notify({
          type: "warning",
          message: "请选择老师"
        });
        return;
      }
      this.warningDialogVisible = true;
    },
    // 添加认证
    sureBatchAllAttestation() {
      updateIpaSignStatus("2", this.attestationData.tutorUserIds).then(
        ({ code, data }) => {
          if (data.code == 200) {
            this.$notify({
              message: "批量认证成功",
              type: "success"
            });
            this.getTableData();
            this.warningDialogVisible = false;
          }
        }
      );
    },
    // 导出表格
    handelExport() {
      let query = "?";
      // 合并 screenData 和 userParams
      let allParams = {
        ...this.screenData,
        ...this.userParams
      };
      
      Object.keys(allParams).forEach(item => {
        if (query === "?") {
          query += `${item}=${encodeURIComponent(allParams[item])}`;
        } else {
          query += `&${item}=${encodeURIComponent(allParams[item])}`;
        }
      });
      query += `&pageNum=${this.pageNum}&pageSize=${this.pageSize}`;
      let fileName = `教师IPA列表`;
      downloadFile(
        `${process.env.VUE_APP_BASE_API}/opsapi/tutor/ipa/sign/exportTutorIpaSign/${query}`,
        fileName
      );
    },
    // 关闭清空form表单
    closeFormDialog() {
      this.signUpData = {};
      this.errorNum = 0;
    }
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
.table-wrapper {
  margin-top: 20px;
}
.red {
  color: #f00;
}
.orange {
  color: #e6a23c;
}
.el-date-editor {
  width: 210px;
}
</style>

<style lang="scss">
.ipa-year {
  margin-right: 15px;
  .el-input__inner {
    width: 80px !important;
  }
}
</style>
