<template>
  <div class="assign-record-list-container">
    <screen-wrapper
      @search="search"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        :label="$t('分配时间')"
        label-width="120px"
      >
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="formState.time"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        ></el-date-picker>
      </screen-item>
      <screen-item
        key="current"
        v-if="assignType === ASSIGN_TYPE.FIRST_ASSIGN"
        :label="$t('分配学管')"
        label-width="120px"
      >
        <CommonTree @get_seleParams="getUserData">
        </CommonTree>
      </screen-item>
      <screen-item
        key="after"
        v-if="assignType === ASSIGN_TYPE.RE_ASSIGN"
        :label="$t('分配后学管')"
        label-width="120px"
      >
        <CommonTree @get_seleParams="getUserDataAfter">
        </CommonTree>
      </screen-item>
      <screen-item
        v-if="
          assignType===ASSIGN_TYPE.RE_ASSIGN"
        :label="$t('分配前学管')"
        label-width="120px"
      >
        <CommonTree @get_seleParams="getUserDataBefore">
        </CommonTree>
      </screen-item>
      <screen-item
        :label="$t('用户')"
        label-width="120px"
      >
        <UserSelect @userChange="handleUserChange" />
      </screen-item>
      <screen-item
        :label="$t('学科')"
        label-width="120px"
      >
        <el-select
          multiple=""
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.subjectTypeIds"
        >
          <el-option
            v-for="(item, index) in Constants.subjectListAll(currentLang, false)"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('进度创建方式')"
        v-if="assignType === ASSIGN_TYPE.FIRST_ASSIGN"
        label-width="120px"
      >
        <el-select
          multiple
          clearable
          v-model="formState.createTypes"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.progressCreateMethods(isEn)"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('是否手动交接')"
        v-if="assignType === ASSIGN_TYPE.FIRST_ASSIGN"
        label-width="120px"
      >
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.manualHandover"
        >
          <el-option
            :label="$t('是')"
            :value="1"
          ></el-option>
          <el-option
            :label="$t('否')"
            :value="0"
          ></el-option>
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('分配方式')"
        label-width="120px"
        v-if="assignType === ASSIGN_TYPE.FIRST_ASSIGN"
      >
        <el-select
          clearable
          v-model="formState.assignmentType"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.assignMethodForAuto(isEn)"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('分配途径')"
        label-width="120px"
        v-if="assignType === ASSIGN_TYPE.FIRST_ASSIGN"
      >
        <el-select
          multiple
          clearable
          v-model="formState.assignmentChannels"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.assignChannels(isEn)"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        label-width="120px"
        :label="$t('分配规则')"
        v-if="formState.assignmentChannels && formState.assignmentChannels.includes(ASSIGN_CHANNEL_TYPE.SYSTEM_RULE)"
      >
        <el-select
          clearable
          v-model="formState.ruleParentId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in ruleList"
            :key="item.ruleName"
            :label="item.ruleName"
            :value="item.id"
          />
        </el-select>
      </screen-item>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
    >
      <el-table
        ref="tableRef"
        v-if="assignType === ASSIGN_TYPE.FIRST_ASSIGN"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        :default-sort="{prop: 'distributionTime', order: 'descending'}"
        @sort-change="sortChange"
      >
        <el-table-column
          fixed
          :label="$t('序号')"
          :width="isEn ? 110 : 50"
        >
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="distributionTime"
          column-key="distributionTime"
          :label="$t('分配时间')"
          :width="150"
          sortable="custom"
          key="timeFirst"
        >
          <template slot-scope="{row}">
            {{ DateTimeUtils.dateClockTime(row.distributionTime || row.assignmentTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="parentId"
          :label="$t('家长id')"
          sortable="custom"
          :width="120"
          key="idFirst"
        >
          <template slot-scope="{ row }">
            <span>
              <router-link :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId:  row.parentId },
                }">
                <el-button type="text">
                  {{ row.parentId || "-" }}
                </el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="studentName"
          :label="$t('学生姓名')"
        >
          <template slot-scope="{ row }">
            <el-button
              @click="goStudentDetail(row.studentId, row.studentName)"
              type="text"
            >{{ row.studentName	 || "-" }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="country"
          :label="$t('国家')"
        >
          <template
            slot-scope="{row}">{{isEn ? (row.countryEn || row.country ): row.country}}</template>
        </el-table-column>
        <el-table-column
          prop="coursePackage"
          :label="$t('课包')"
        >
          <template slot-scope="{ row }">
            {{isEn ? row.coursePackageNameEn : row.coursePackageNameZh }}
          </template>
        </el-table-column>
        <el-table-column
          prop="schedule"
          :label="$t('进度')"
        >
          <template slot-scope="{ row }">
            {{isEn ? row.subjectSpeedEn : row.subjectSpeedZh}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createMethod"
          :label="$t('进度创建方式')"
          :width="120"
        >
          <template slot-scope="{row}">
            {{Filters.createTypeFilter(row.createType, isEn)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="language"
          :label="$t('语言要求')"
        >
          <template slot-scope="{row}">
            {{$t(row.specialLanguageDesc) || $t('无')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="part"
          :label="$t('交接人-部门')"
          :width="120"
        >
          <template slot-scope="{row}">
            {{getPartName(row.handoverUserInfoResp, row.handoverPostInfoResp)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="part2"
          :label="$t('分配学管-部门')"
          :width="120"
        >
          <template slot-scope="{row}">
            {{getPartName(row.recipientUserInfoResp, row.recipientPostInfoResp)}}
          </template>
        </el-table-column>
        <el-table-column
          :width="120"
          prop="assignType"
          :label="$t('分配方式')"
        >
          <template slot-scope="{row}">
            {{Filters.assignmentType(row.assignmentType, isEn) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="assignmentChannel"
          :label="$t('分配途径')"
          :width="100"
        >
          <template slot-scope="{row}">
            {{Filters.assignmentChannel(row.assignmentChannel, isEn) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="rule"
          :label="$t('分配规则')"
          :width="isEn ? 200 :100"
        >
          <template slot-scope="{row}">
            <span
              v-if="row.assignmentChannel === ASSIGN_CHANNEL_TYPE.SYSTEM_RULE && row.assignmentType === AUTO_ASSIGN_TYPE.MANUAL_ALLOCATION"
            >{{$t('自动分配原学管')}}</span>
            <span
              v-else-if="row.assignmentChannel === ASSIGN_CHANNEL_TYPE.SYSTEM_RULE && row.assignmentType !== AUTO_ASSIGN_TYPE.MANUAL_ALLOCATION"
            >{{row.ruleName}}</span>
            <span v-else>-</span>
            <el-button
              v-if="row.assignmentChannel === ASSIGN_CHANNEL_TYPE.SYSTEM_RULE"
              type="text"
              @click="handleShowSnapshot(row)"
            >{{row.assignRule}}{{$t('分配快照')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        ref="tableRef"
        v-if="assignType === ASSIGN_TYPE.RE_ASSIGN"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        :default-sort="{prop: 'distributionTime', order: 'descending'}"
        @sort-change="sortChange"
      >
        <el-table-column
          fixed
          :label="$t('序号')"
          :width="isEn ? 110 : 50"
        >
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="distributionTime"
          :label="$t('分配时间')"
          :width="150"
          sortable="custom"
          key="timeRe"
        >
          <template slot-scope="{row}">
            {{ DateTimeUtils.dateClockTime(row.distributionTime || row.assignmentTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="parentId"
          :label="$t('家长id')"
          sortable="custom"
          :width="120"
          key="idRe"
        >
          <template slot-scope="{ row }">
            <span>
              <router-link :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId:  row.userParentId },
                }">
                <el-button type="text">
                  {{ row.userParentId || "-" }}
                </el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="studentName"
          :label="$t('学生姓名')"
        >
          <template slot-scope="{ row }">
            <el-button
              @click="goStudentDetail(row.userStudentId, row.studentName)"
              type="text"
            >{{ row.studentName	 || "-" }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="packageNameEn"
          :label="$t('课包')"
        >
          <template slot-scope="{ row }">
            {{isEn ? row.packageNameEn : row.packageNameZH}}
          </template>
        </el-table-column>
        <el-table-column
          prop="schedule"
          :label="$t('进度')"
        >
          <template slot-scope="{ row }">
            {{isEn ? row.subjectSpeedEn : row.subjectSpeedZh}}
          </template>
        </el-table-column>
        <el-table-column
          prop="la"
          :label="$t('分配后学管')"
        >
          <template slot-scope="{row}">
            <span v-if="row.newXgInfo">
              {{row.newXgInfo.username}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="la2"
          :label="$t('分配前学管')"
        >
          <template slot-scope="{row}">
            <span v-if="row.oldXgInfo">
              {{row.oldXgInfo.username }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="la2"
          :label="$t('操作人')"
        >
          <template slot-scope="{row}">
            <span v-if="row.createUser">
              {{row.createUser.username}}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
    <AssignSnapshotDialog
      v-if="showAssignSnapshotDialog"
      :visible.sync="showAssignSnapshotDialog"
      :currentLog="currentLog"
    />
  </div>
</template>
<script>
import { computed, defineComponent, reactive, toRefs, ref, onMounted, unref, watch } from '@vue/composition-api'
import { ASSIGN_RULE_TYPE, ASSIGN_TYPE } from '@/views/myWorkbench/dataConfig/enum'
import UserSelect from '@/views/myWorkbench/components/MyStudentNew/userSelect.vue'
import CommonTree from "@/views/reportManagement/commonTree";
import AssignSnapshotDialog from './assignSnapshot.vue'
import { ASSIGN_CHANNEL_TYPE, AUTO_ASSIGN_TYPE } from '@/utils/constants'
import moment from "moment";
import { parentIdValidate, studentIdValidate} from "@/utils/reg.js";

export default defineComponent({
  components: { UserSelect, CommonTree, AssignSnapshotDialog },
  props: {
    assignType: {
      type: Number,
      default: 0
    }
  },
  setup (props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const formState = reactive({
      time: '',
      userIdStr: '',
      postIdStr: '',
      studentName: '',
      studentUserId: null,
      parentUserName: '',
      parentUserId: null,
      subjectTypeIds: [],
      createTypes: [],
      manualHandover: null,
      assignmentType: null,
      assignmentChannels: null,
      ruleParentId: null
    })
    const pageData = reactive({
      total: 0,
      pageNum: 1,
      pageSize: 50,
    });

    const ruleList = ref([])

    const currentLog = ref(null)
    const showAssignSnapshotDialog = ref(false)

    const loading = ref(false)
    const tableData = ref([])

    watch(() => props.assignType, (val) => {
      loading.value = true
      emit('forceUpdate')
    })

    const handleUserChange = (userState) => {
      Object.assign(formState, userState)
    }

    const getDepart = (info) => {
      if (!info) return
      const { upPostNameEn, currentPostNameEn, upPostNameZh, currentPostNameZh, thirdPostNameZh, thirdPostNameEn } = info
      let strZh = currentPostNameZh
      if (upPostNameZh) {
        strZh += '/' + upPostNameZh
      }
      if (thirdPostNameZh) {
        strZh += '/' + thirdPostNameZh
      }
      let strEn = currentPostNameEn
      if (upPostNameEn) {
        strEn += '/' + upPostNameEn
      }
      if (thirdPostNameEn) {
        strEn += '/' + thirdPostNameEn
      }
      return unref(isEn) ? strEn : strZh
    }

    const goStudentDetail = (studentId, studentName) => {
      root.$router.push(
        `/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`
      );
    };

    const getRules = () => {
      root.$Api.workBench.getRuleList(ASSIGN_RULE_TYPE.NORMAL_RULE).then(({ status, data: { data, code } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        ruleList.value = data
      }).catch(() => {
        ruleList.value = []
      })
    }

    const getUserDataAfter = (val, valName) => {
      if (valName === "postIdList") {
        formState.newUserIdStr = "";
        formState.newPostIdStr = val.join(",");
      } else if (valName === "userIdList") {
        formState.newPostIdStr = "";
        formState.newUserIdStr = val.join(",");
      } else if (valName === "clear") {
        formState.newPostIdStr = "";
        formState.newUserIdStr = "";
      }
    }

    const getUserData = (val, valName) => {
      if (valName === "postIdList") {
        formState.userIdStr = "";
        formState.postIdStr = val.join(",");
      } else if (valName === "userIdList") {
        formState.postIdStr = "";
        formState.userIdStr = val.join(",");
      } else if (valName === "clear") {
        formState.postIdStr = "";
        formState.userIdStr = "";
      }
    }

    const getUserDataBefore = (val, valName) => {
      if (valName === "postIdList") {
        formState.oldUserIdStr = "";
        formState.oldPostIdStr = val.join(",");
      } else if (valName === "userIdList") {
        formState.oldPostIdStr = "";
        formState.oldUserIdStr = val.join(",");
      } else if (valName === "clear") {
        formState.oldPostIdStr = "";
        formState.oldUserIdStr = "";
      }
    }

    const search = () => {
      if (formState && formState.parentUserId && !parentIdValidate(root, formState.parentUserId)) {
        return;
      }
      if (formState && formState.studentUserId && !studentIdValidate(root, formState.studentUserId)) {
        return;
      }
      pageData.pageNum = 1
      const prop = refs.tableRef.columns[1].property
      const order = refs.tableRef.columns[1].order
      if (prop === 'distributionTime') {
        formState.orderColumn = props.assignType === ASSIGN_TYPE.FIRST_ASSIGN ? 'distribution_time' : 'create_time'
        formState.asc = order ? (order === "ascending" ? 'asc' : 'desc') : 'desc'
      }
      getTableData()
    }

    const getUtc = (gmt, type) => {
      return type === 'start' ? moment(`${gmt} 00:00:00`).toISOString() : moment(`${gmt} 23:59:59`).toISOString()
    }

    const getPartName = (item, postItem) => {
      return (item?.username || '-') + '-' + getDepart(postItem)
    }

    const getTableData = (changeType) => {
      loading.value = true;
      tableData.value = []
      const params = { ...formState, ...pageData }
      params.startDate = params.time && params.time[0] ? getUtc(params.time[0], 'start') : (params.startDate || '');
      params.endDate = params.time && params.time[1] ? getUtc(params.time[1], 'end') : (params.endDate || '');
      if (!params.assignmentChannels?.includes(ASSIGN_CHANNEL_TYPE.SYSTEM_RULE)) params.ruleParentId = null
      delete params.time
      if (props.assignType === ASSIGN_TYPE.FIRST_ASSIGN) {
        delete params.oldPostIdStr
        delete params.oldUserIdStr
        delete params.newUserIdStr
        delete params.newPostIdStr
      } else {
        delete params.assignmentChannels
        delete params.assignmentType
        delete params.createTypes
        delete params.manualHandover
        delete params.ruleParentId
        delete params.userIdStr
      }

      const url = props.assignType === ASSIGN_TYPE.FIRST_ASSIGN ? 'getFirstAssignRecordList' : "getReAssignRecordList"
      root.$Api.dataManagement[url](params).then(({ status, data: { data, code } }) => {
        if (code !== 200 || status !== 200) return Promise.reject()
        tableData.value = data.list || []
        pageData.total = data.total
        loading.value = false;
      }).catch(() => {
        tableData.value = []
        pageData.total = 0
        loading.value = false;
      })
    }


    const getCurrentPage = (page) => {
      pageData.pageNum = page;
      getTableData();
    };

    const getPerPage = (perPage) => {
      pageData.pageSize = perPage;
      getTableData();
    };

    const sortChange = (column) => {
      const isFirstAssign = props.assignType === ASSIGN_TYPE.FIRST_ASSIGN
      const asc = column.order === "ascending" ? 'asc' : 'desc'
      if (column.prop === "distributionTime") {
        formState.orderColumn = isFirstAssign ? 'distribution_time' : 'create_time'
      } else if (column.prop === "parentId") {
        formState.orderColumn = isFirstAssign ? 'parent_id' : 'parent_user_id'
      } else {
        return
      }
      formState.asc = asc
      formState.page = 1;
      getTableData();
    }

    const handleShowSnapshot = (row) => {
      currentLog.value = row
      showAssignSnapshotDialog.value = true
    }

    onMounted(() => {
      root.$nextTick(() => {
        setTimeout(() => {
          formState.orderColumn = props.assignType === ASSIGN_TYPE.FIRST_ASSIGN ? 'distribution_time' : 'create_time'
          formState.asc = 'desc'
          getTableData('changeType')
        }, 1000)
      })
      getRules()
    })
    return {
      isEn,
      formState,
      tableData,
      ruleList,
      loading,
      getDepart,
      goStudentDetail,
      ...toRefs(pageData),
      ASSIGN_TYPE,
      currentLog,
      showAssignSnapshotDialog,

      search,
      getUserData,
      getUserDataBefore,
      getUserDataAfter,
      getCurrentPage,
      getPerPage,
      sortChange,
      handleUserChange,
      handleShowSnapshot,
      ASSIGN_CHANNEL_TYPE,
      AUTO_ASSIGN_TYPE,
      getPartName
    }
  },
})
</script>
<style lang="scss" scoped>
.assign-record-list-container {
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>
