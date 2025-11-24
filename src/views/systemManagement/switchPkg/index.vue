<template>
  <div class="change-pkg-list">
    <screen-wrapper
      @search="search"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        :label="$t('课程包')"
        :label-width="isEn ? 120 : 100"
        :part="10"
      >
        <FilterByCoursePackage @changeEditionSelect="
            (val) => {
              screenData.coursePackageId = val;
            }
          " />
      </screen-item>
      <screen-item
        :label="$t('版本')"
        :label-width="isEn ? 120 : 100"
        :part="10"
      >
        <FilterByEditionInPackage
          @changeSelect="
            (val) => {
              screenData.packageTreeId = val;
            }
          "
          :coursePackageId="screenData.coursePackageId"
        />
      </screen-item>
      <screen-item
        :label="$t('级别')"
        :label-width="isEn ? 120 : 100"
      >
        <FilterByLevelInPackage
          @changeSelect="
            (val) => {
              screenData.courseId = val;
            }
          "
          :coursePackageId="screenData.coursePackageId"
          :packageTreeId="screenData.packageTreeId"
        />
      </screen-item>
      <screen-item
        :label="$t('家长id')"
        :label-width="isEn ? 120 : 100"
      >
        <el-input
          clearable
          class="mr10"
          :placeholder="$t('请输入家长ID查询')"
          v-model="screenData.parentUserId"
        ></el-input>
      </screen-item>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
    >
      <div slot="header-right">
        <el-button
          type="primary"
          @click="handleAdd"
        >{{ $t("添加") }}</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        border
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="isEn? 110 : 50"
        >
          <template slot-scope="scope">{{
              (pageData.pageNum - 1) * pageData.pageSize + scope.$index + 1
            }}</template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('家长id')"
          :width="130"
          prop="parentUserId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="studentName"
          :label="$t('my-home-Student')"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              @click="
                  goStudentDetail(
                    scope.row.studentUserId,
                    scope.row.studentName
                  )
                "
              type="text"
            >{{ scope.row.studentName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('课包')"
          :width="120"
          prop="parentUserId"
        >
          <template slot-scope="{row}">
            {{isEn ? row.coursePackageNameEN : row.coursePackageNameZH}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('版本')"
          :width="120"
          prop="parentUserId"
        >
          <template slot-scope="{row}">
            {{isEn ? row.packageTreeNameEN : row.packageTreeNameZH}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('级别')"
          :width="120"
          prop="parentUserId"
        >
          <template slot-scope="{row}">
            Level{{row.levelNo}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('拒绝原因')"
          prop="reason"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('添加时间')"
          :width="140"
          prop="parentUserId"
        >
          <template slot-scope="{row}">
            {{DateTimeUtils.dateClockTime(row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作人')"
          :width="120"
          prop="opsUserName"
        >
          <template slot-scope="{row}">
            {{row.opsRole === 1 ? $t('用户本人') : row.opsUserName}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          :width="120"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="handleRemove(row)"
            >{{$t('移除')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="pageData.total"
        :current-page="pageData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
    <AddWhiteUserDialogVue
      v-if="showAddDialog"
      :visible.sync="showAddDialog"
      @addSucess="handleAddCb"
    />
  </div>
</template>
<script>
import { computed, defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import FilterByCoursePackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByCoursePackage";
import FilterByEditionInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByEditionInPackage";
import FilterByLevelInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByLevelInPackage";
import AddWhiteUserDialogVue from './addWhiteUserDialog.vue';
import { parentIdValidate } from "@/utils/reg.js";

export default defineComponent({
  components: { FilterByCoursePackage, FilterByEditionInPackage, FilterByLevelInPackage, AddWhiteUserDialogVue },
  setup (_, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const tableData = ref(null)
    const loading = ref(false)
    const showAddDialog = ref(false)
    const screenData = reactive({
      coursePackageId: null,
      packageTreeId: null,
      courseId: null,
      parentUserId: null
    })
    const pageData = reactive({
      pageSize: 50,
      pageNum: 1,
      total: 0
    })
    const getCurrentPage = (page) => {
      pageData.pageNum = page;
      getTableData();
    }

    const getPerPage = (perPage) => {
      pageData.pageSize = perPage;
      getTableData();
    }

    const getTableData = () => {
      if (screenData && screenData.parentUserId && !parentIdValidate(root, screenData.parentUserId)) {
        return;
      }
      loading.value = true
      root.$Api.systemManagement.getChangePkgWhiteList(pageData.pageNum, pageData.pageSize, screenData).then(({ status, data: { data, code } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        tableData.value = data.list
        pageData.total = data.total || 0
        loading.value = false
      }).catch(() => {
        loading.value = false
      })
    }

    const search = () => {
      pageData.pageNum = 1
      getTableData()
    }

    const goStudentDetail = (studentId, studentName) => {
      root.$router.push(
        `/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`
      );
    }

    const handleRemove = (row) => {
      root.$confirm(root.$t('移除后，该学生将会切换至新版本上课，确定要移除嘛?'), root.$t('提示'))
        .then(async (_) => {
          confirmDelete(row.id)
        }).catch(() => {
        })
    }

    const confirmDelete = (id) => {
      root.$Api.systemManagement.removeSwitchPkgWhite(id).then(({ status, data: { data, code } }) => {
        if (code !== 200 || status !== 200) return Promise.reject()
        root.$notify.success(root.$t('移除成功'))
        getTableData()
      })
    }

    const handleAdd = () => {
      showAddDialog.value = true
    }

    const handleAddCb = () => {
      showAddDialog.value = false
      getTableData()
    }

    onMounted(search)

    return {
      isEn,
      tableData,
      pageData,
      loading,
      screenData,
      showAddDialog,
      getCurrentPage,
      getPerPage,
      getCurrentPage,
      getTableData,
      search,
      goStudentDetail,
      handleRemove,
      handleAdd,
      handleAddCb
    }
  },
})
</script>
<style lang="scss" scoped>
.change-pkg-list {
}
</style>
